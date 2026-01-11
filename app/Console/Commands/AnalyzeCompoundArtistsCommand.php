<?php declare(strict_types=1);

namespace App\Console\Commands;

use App\Console\Commands\Concerns\HandlesLibrarySelection;
use App\Services\ArtistSplitService;
use Illuminate\Console\Command;

class AnalyzeCompoundArtistsCommand extends Command
{
    use HandlesLibrarySelection;

    protected $signature = 'artists:analyze
                          {--library= : Library ID (UUID) to use}
                          {--limit=100 : Number of artists to analyze}
                          {--output=table : Output format (table|json)}';

    protected $description = 'Analyze compound artists and show potential matches';

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

        $limit = (int) $this->option('limit');
        $output = $this->option('output');

        $this->newLine();
        $this->info("Analyzing up to {$limit} compound artists in library: {$library->name}");
        $this->newLine();

        $results = $this->splitService->bulkAnalyze($limit);

        if ($output === 'json') {
            $this->line($results->toJson(JSON_PRETTY_PRINT));
            return self::SUCCESS;
        }

        foreach ($results as $result) {
            $artist = $result['artist'];
            $analysis = $result['analysis'];

            $this->info("Artist: {$artist->Name}");

            foreach ($analysis['suggestions'] as $suggestion) {
                $this->line("  Position {$suggestion['position']}: {$suggestion['extracted_name']}");

                if (empty($suggestion['matches'])) {
                    $this->warn('    No matches found');
                } else {
                    $bestMatch = $suggestion['matches'][0];
                    $this->line(sprintf(
                        "    Best match: %s (%d%% confidence)",
                        $bestMatch['name'],
                        (int)($bestMatch['confidence'] * 100)
                    ));
                }
            }

            $this->newLine();
        }

        return self::SUCCESS;
    }
}
