<?php

namespace App\Models\Traits;

use App\Models\Library;

trait ResolvesFromLibraryDatabase
{
    public function resolveRouteBinding($value, $field = null)
    {
        $library = request()->route('library');

        if (!$library instanceof Library) {
            abort(404, 'Library not found in route');
        }

        // Configure connection (idempotent on this Library instance)
        $library->configureRekordboxConnection();

        // Resolve the model
        return static::on('rekordbox')
            ->where($field ?? $this->getRouteKeyName(), $value)
            ->firstOrFail();
    }
}
