<?php

namespace App\Services;

use App\Models\Library;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use \Illuminate\Database\Connection;
use App\Exceptions\LibraryConnectionException;

class LibraryConnectionManager
{
    /**
     * Configure the rekordbox connection for the given library
     */
    public static function configureConnection(Library $library): Connection
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
        $config = [
            'driver' => 'sqlcipher',
            'database' => $databasePath,
            'prefix' => '',
            'foreign_key_constraints' => true,
            'pragma' => [
                'key' => $databaseKey,
                'cipher_compatibility' => 4,
            ],
        ];
        Config::set('database.connections.rekordbox', $config);

        // Purge and reconnect to apply new configuration
        DB::purge('rekordbox');

        // Test the connection
        try {
            $connection = DB::connection('rekordbox');

            // Ensure connection is okay by running query
            $connection->getPdo();
            $connection->select('SELECT 1');
            return $connection;
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
    public static function disconnect(): void
    {
        DB::purge('rekordbox');
    }
}
