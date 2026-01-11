<?php declare(strict_types=1);

namespace App\Console\Commands;

use App\Console\Commands\Concerns\HandlesLibrarySelection;
use App\Models\ArtistSplit;
use App\Models\Rekordbox\Artist;
use App\Services\ArtistSplitService;
use Illuminate\Console\Command;

class ResolveArtistsCommand extends Command
{
    use HandlesLibrarySelection;

    protected $signature = 'artists:resolve
                          {--library= : Library ID (UUID) to use}
                          {--auto : Automatically resolve high confidence matches}
                          {--threshold=0.95 : Confidence threshold for auto-resolve (0-1)}
                          {--limit=100 : Number of artists to process}
                          {--unresolved : Only process unresolved compound artists}';

    protected $description = 'Resolve compound artist names into individual artists';

    public function __construct(
        private readonly ArtistSplitService $splitService
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        // Select library first
        $library = $this->selectLibrary();

        if (!$library) {
            return self::FAILURE;
        }

        $this->newLine();
        $this->info('🎵 Artist Resolution Tool');
        $this->newLine();

        // Show library info
        $this->displayLibraryInfo($library);
        $this->newLine();

        // Show current statistics
        $this->displayStatistics();
        $this->newLine();

        if ($this->option('auto')) {
            return $this->autoResolve();
        }

        return $this->interactiveResolve();
    }

    protected function displayStatistics(): void
    {
        $stats = $this->splitService->getStatistics();

        $this->table(
            ['Metric', 'Count'],
            [
                ['Total Compound Artists', $stats['total_compound']],
                ['Resolved', $stats['resolved']],
                ['Unresolved', $stats['unresolved']],
                ['Verified', $stats['verified']],
            ]
        );
    }

    protected function autoResolve(): int
    {
        $threshold = (float) $this->option('threshold');

        $this->info("Auto-resolving with confidence threshold: {$threshold}");
        $this->newLine();

        $bar = $this->output->createProgressBar();
        $bar->start();

        $resolved = $this->splitService->autoResolveHighConfidence($threshold);

        $bar->finish();
        $this->newLine(2);

        $this->info("✅ Successfully auto-resolved {$resolved} compound artists");

        return self::SUCCESS;
    }

        protected function interactiveResolve(): int
    {
        $limit = (int) $this->option('limit');
        $unresolved = $this->option('unresolved');

        $query = Artist::query()
            ->whereRaw("Name LIKE '%,%'");

        if ($unresolved) {
            // Get all compound artists
            $allCompoundIds = Artist::whereRaw("Name LIKE '%,%'")
                ->pluck('ID')
                ->toArray();

            // Get resolved IDs from MySQL
            $resolvedIds = ArtistSplit::whereIn('compound_artist_id', $allCompoundIds)
                ->distinct('compound_artist_id')
                ->pluck('compound_artist_id')
                ->toArray();

            // Filter to only unresolved
            $unresolvedIds = array_diff($allCompoundIds, $resolvedIds);

            $query->whereIn('ID', $unresolvedIds);
        }

        $artists = $query->limit($limit)->get();

        if ($artists->isEmpty()) {
            $this->info('No compound artists to process.');
            return self::SUCCESS;
        }

        $this->info("Found {$artists->count()} compound artist(s) to process");
        $this->newLine();

        $processed = 0;
        $skipped = 0;

        foreach ($artists as $artist) {
            $result = $this->processArtist($artist);

            if ($result === 'processed') {
                $processed++;
            } elseif ($result === 'skipped') {
                $skipped++;
            } elseif ($result === 'quit') {
                break;
            }

            $this->newLine();
        }

        $this->newLine();
        $this->info("✅ Processed: {$processed}");
        $this->info("⏭️  Skipped: {$skipped}");

        return self::SUCCESS;
    }

    protected function processArtist(Artist $artist): string
    {
        $this->line("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        $this->info("Artist: {$artist->Name}");
        $this->line("Tracks: {$artist->tracks()->count()} | Albums: {$artist->albums()->count()}");
        $this->newLine();

        $analysis = $this->splitService->analyzeSplits($artist);

        if (!$analysis['is_compound']) {
            $this->warn('Not a compound artist');
            return 'skipped';
        }

        $splits = [];

        foreach ($analysis['suggestions'] as $suggestion) {
            $this->line("Position {$suggestion['position']}: \"{$suggestion['extracted_name']}\"");

            if (empty($suggestion['matches'])) {
                $this->warn('  No matches found');
                continue;
            }

            $this->newLine();

            // Display matches
            foreach ($suggestion['matches'] as $index => $match) {
                $confidenceColor = $this->getConfidenceColor($match['confidence']);
                $this->line(sprintf(
                    "  [%d] %s (<%s>%d%%</>) - %d tracks, %d albums",
                    $index + 1,
                    $match['name'],
                    $confidenceColor,
                    (int)($match['confidence'] * 100),
                    $match['track_count'],
                    $match['album_count']
                ));
            }

            $this->newLine();

            // Ask user to select
            $choice = $this->ask(
                'Select match number (or press Enter to skip, "q" to quit)',
                '1'
            );

            if (strtolower($choice) === 'q') {
                return 'quit';
            }

            if ($choice === '' || $choice === null) {
                continue;
            }

            $selectedIndex = (int)$choice - 1;

            if (isset($suggestion['matches'][$selectedIndex])) {
                $match = $suggestion['matches'][$selectedIndex];
                $splits[] = [
                    'resolved_artist_id' => $match['id'],
                    'extracted_name' => $suggestion['extracted_name'],
                    'position' => $suggestion['position'],
                    'confidence' => $match['confidence'],
                    'is_verified' => true, // Set to true since user manually verified
                ];
            }

            $this->newLine();
        }

        if (!empty($splits)) {
            $this->splitService->saveSplits($artist, $splits);
            $this->info("✅ Saved {count($splits)} split(s)");
            return 'processed';
        }

        return 'skipped';
    }

    protected function getConfidenceColor(float $confidence): string
    {
        return match (true) {
            $confidence >= 0.95 => 'fg=green',
            $confidence >= 0.85 => 'fg=yellow',
            $confidence >= 0.7 => 'fg=cyan',
            default => 'fg=red',
        };
    }
}
