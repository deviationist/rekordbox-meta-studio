<?php

// Old config:
/*
return [
    'folder_path' => env('REKORDBOX_FOLDER_PATH'),
    'database_path' => env('REKORDBOX_DB_PATH'),
    'database_key' => env('REKORDBOX_DB_KEY'),
];
*/

return [
    /*
    |--------------------------------------------------------------------------
    | Default Rekordbox Database Password
    |--------------------------------------------------------------------------
    |
    | The default encryption key for Rekordbox SQLite databases.
    | This is used when no custom password is provided.
    |
    */
    'default_password' => env('REKORDBOX_DEFAULT_PASSWORD', '402fd482c38817c35ffa8ffb8c7d93143b749e7d315df7a81732a1ff43608497'),

    /*
    |--------------------------------------------------------------------------
    | Library Storage Path
    |--------------------------------------------------------------------------
    |
    | Where uploaded library database files should be stored.
    |
    */
    'storage_path' => 'libraries',
];
