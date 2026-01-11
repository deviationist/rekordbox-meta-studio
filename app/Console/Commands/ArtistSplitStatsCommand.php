<?php declare(strict_types=1);

namespace App\Console\Commands;

use App\Console\Commands\Concerns\HandlesLibrarySelection;
use App\Services\ArtistSplitService;
use Illuminate\Console\Command;

class ArtistSplitStatsCommand extends Command
{
    use HandlesLibrarySelection;

    protected $signature = 'artists:split-stats
                          {--library= : Library ID (UUID) to use}';

    protected $description = 'Display statistics about artist splits';

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
        $this->info('📊 Artist Split Statistics');
        $this->newLine();

        // Show library info
        $this->displayLibraryInfo($library);
        $this->newLine();

        $stats = $this->splitService->getStatistics();

        $this->table(
            ['Metric', 'Count', 'Percentage'],
            [
                [
                    'Total Compound Artists',
                    $stats['total_compound'],
                    '100%'
                ],
                [
                    'Resolved',
                    $stats['resolved'],
                    $this->calculatePercentage($stats['resolved'], $stats['total_compound'])
                ],
                [
                    'Unresolved',
                    $stats['unresolved'],
                    $this->calculatePercentage($stats['unresolved'], $stats['total_compound'])
                ],
                [
                    'Verified',
                    $stats['verified'],
                    $this->calculatePercentage($stats['verified'], $stats['total_compound'])
                ],
            ]
        );

        return self::SUCCESS;
    }

    protected function calculatePercentage(int $part, int $total): string
    {
        if ($total === 0) {
            return '0%';
        }

        return round(($part / $total) * 100, 1) . '%';
    }
}
