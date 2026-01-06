<?php

namespace App\Services;

use App\Models\Library;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use App\Exceptions\LibraryConnectionException;

class LibraryConnectionManager
{
    /**
     * Configure the rekordbox connection for the given library
     */
    public function configureConnection(Library $library): void
    {
        if (!$library->isDatabaseAccessible()) {
            throw new LibraryConnectionException(
                "Cannot access database file for library '{$library->name}'. " .
                "The file may have been moved or deleted."
            );
        }

        $databasePath = $library->getDatabasePath();
        $databaseKey = $library->getDecryptionPassword();

        // Configure the rekordbox connection
        Config::set('database.connections.rekordbox', [
            'driver' => 'sqlcipher',
            'database' => $databasePath,
            'prefix' => '',
            'foreign_key_constraints' => true,
            'pragma' => [
                'key' => $databaseKey,
                'cipher_compatibility' => 4,
            ],
        ]);

        // Purge and reconnect to apply new configuration
        DB::purge('rekordbox');

        // Test the connection
        try {
            DB::connection('rekordbox')->getPdo();
        } catch (\Exception $e) {
            throw new LibraryConnectionException(
                "Failed to connect to library '{$library->name}'. " .
                "The database file may be corrupted or the password may be incorrect.",
                0,
                $e
            );
        }
    }

    /**
     * Disconnect the rekordbox connection
     */
    public function disconnect(): void
    {
        DB::purge('rekordbox');
    }
}
