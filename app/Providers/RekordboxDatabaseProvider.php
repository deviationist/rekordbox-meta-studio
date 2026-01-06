<?php declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;
use App\Database\SqlCipherConnection;

class RekordboxDatabaseProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Register the sqlcipher driver
        DB::extend('sqlcipher', function ($config) {
            // Use SQLite connector to create the PDO connection
            $connector = new \Illuminate\Database\Connectors\SQLiteConnector();
            $connection = $connector->connect($config);

            // Return our custom connection class
            return new SqlCipherConnection(
                $connection,
                $config['database'],
                $config['prefix'] ?? '',
                $config
            );
        });
    }
}
