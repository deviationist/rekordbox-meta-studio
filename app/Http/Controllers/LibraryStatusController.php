<?php

namespace App\Http\Controllers;

use App\Support\Arr;
use App\Models\Library;
use Illuminate\Support\Number;
use Illuminate\Support\Facades\File;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class LibraryStatusController extends Controller
{
    public function show(Library $library)
    {
        $status = $this->getLibraryStatus($library);

        return inertia('libraries/status', [
            'library' => Arr::toCamelCase($library->toArray()),
            'status' => Arr::toCamelCase($status),
        ]);
    }

    private function getLibraryStatus(Library $library): array
    {
        $dbPath = $library->getDatabasePath();

        // File system checks
        $fileExists = File::exists($dbPath);
        $fileSize = $fileExists ? File::size($dbPath) : 0;
        $isWritable = $fileExists ? File::isWritable($dbPath) : false;
        $lastModified = $fileExists ? Carbon::createFromTimestamp(File::lastModified($dbPath)) : null;

        // Connection and table statistics
        $canConnect = false;
        $tables = [];
        $totalRows = 0;

        if ($fileExists) {
            try {
                $connection = $library->configureRekordboxConnection();

                // Get all tables
                $tablesQuery = $connection->select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");

                foreach ($tablesQuery as $table) {
                    $tableName = $table->name;
                    $rowCount = $connection->table($tableName)->count();
                    $totalRows += $rowCount;

                    // Get table info (columns)
                    $columns = $connection->select("PRAGMA table_info({$tableName})");

                    $tables[] = [
                        'name' => $tableName,
                        'row_count' => $rowCount,
                        'column_count' => count($columns),
                        'columns' => collect($columns)->map(fn($col) => [
                            'name' => $col->name,
                            'type' => $col->type,
                            'nullable' => !$col->notnull,
                            'primary_key' => (bool) $col->pk,
                        ])->toArray(),
                    ];
                }

                // Sort tables by row count (descending)
                usort($tables, fn($a, $b) => $b['row_count'] <=> $a['row_count']);
                $canConnect = true;

            } catch (\Exception $e) {
                Log::error('Library connection failed', [
                    'library_id' => $library->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return [
            'file' => [
                'exists' => $fileExists,
                'path' => $dbPath,
                'size' => $fileSize,
                'size_formatted' => Number::fileSize(bytes: $fileSize, maxPrecision: 2),
                'is_writable' => $isWritable,
                'last_modified' => $lastModified?->toIso8601String(),
                'last_modified_formatted' => $lastModified?->format('M j, Y g:i A'),
                'last_modified_human' => $lastModified?->diffForHumans(),
            ],
            'database' => [
                'can_connect' => $canConnect,
                'total_tables' => count($tables),
                'total_rows' => $totalRows,
                'tables' => $tables,
            ],
        ];
    }
}
