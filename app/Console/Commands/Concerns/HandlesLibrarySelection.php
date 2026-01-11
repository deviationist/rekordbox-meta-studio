<?php declare(strict_types=1);

namespace App\Console\Commands\Concerns;

use App\Models\Library;
use Illuminate\Support\Collection;

trait HandlesLibrarySelection
{
    protected ?Library $selectedLibrary = null;

    /**
     * Select a library either from argument, auto-select if only one, or prompt user
     */
    protected function selectLibrary(): ?Library
    {
        // Check if library ID was provided as option
        if ($this->hasOption('library') && $libraryId = $this->option('library')) {
            $library = Library::where('id', $libraryId)->first();

            if (!$library) {
                $this->error("Library with ID '{$libraryId}' not found.");
                return null;
            }

            $this->selectedLibrary = $library;
            $this->configureLibraryConnection($library);

            return $library;
        }

        // Get all libraries
        $libraries = Library::all();

        if ($libraries->isEmpty()) {
            $this->error('No libraries found. Please create a library first.');
            return null;
        }

        // Auto-select if only one library
        if ($libraries->count() === 1) {
            $library = $libraries->first();
            $this->info("Auto-selected library: {$library->name}");
            $this->selectedLibrary = $library;
            $this->configureLibraryConnection($library);

            return $library;
        }

        // Multiple libraries - let user choose
        return $this->promptForLibrary($libraries);
    }

    /**
     * Prompt user to select a library from list
     */
    protected function promptForLibrary(Collection $libraries): ?Library
    {
        $this->info('Multiple libraries found:');
        $this->newLine();

        $choices = $libraries->map(function ($library, $index) {
            return sprintf(
                '[%d] %s (ID: %s)',
                $index + 1,
                $library->name,
                substr($library->id, 0, 8) . '...'
            );
        })->toArray();

        foreach ($choices as $choice) {
            $this->line($choice);
        }

        $this->newLine();

        $selection = $this->ask(
            'Select library number',
            '1'
        );

        $selectedIndex = (int)$selection - 1;

        if (!isset($libraries[$selectedIndex])) {
            $this->error('Invalid selection.');
            return null;
        }

        $library = $libraries[$selectedIndex];
        $this->selectedLibrary = $library;
        $this->configureLibraryConnection($library);

        return $library;
    }

    /**
     * Configure the Rekordbox database connection for the selected library
     */
    protected function configureLibraryConnection(Library $library): void
    {
        try {
            $library->configureRekordboxConnection();
            $this->line("<fg=gray>Connected to library: {$library->name}</>");
        } catch (\Exception $e) {
            $this->error("Failed to connect to library: {$e->getMessage()}");
            throw $e;
        }
    }

    /**
     * Display library information
     */
    protected function displayLibraryInfo(Library $library): void
    {
        $this->table(
            ['Property', 'Value'],
            [
                ['ID', $library->id],
                ['Name', $library->name],
                ['Database', $library->getDatabasePath() ?? 'N/A'],
            ]
        );
    }
}
