<?php

namespace App\Services;

use App\Models\Rekordbox\Album;
use App\Models\Rekordbox\Artist;
use App\Models\Rekordbox\Genre;
use App\Models\Rekordbox\Label;
use App\Models\Rekordbox\Playlist;
use App\Models\Rekordbox\Track;

class EntityCountService
{
    /**
     * Get counts for all entity types.
     */
    public function getCounts(): array
    {
        return [
            'tracks' => Track::count(),
            'playlists' => Playlist::count(),
            'artists' => Artist::count(),
            'albums' => Album::count(),
            'genres' => Genre::count(),
            'labels' => Label::count(),
        ];
    }

    /**
     * Get count for a specific entity type.
     */
    public function getCount(string $entityType): ?int
    {
        return match ($entityType) {
            'tracks' => Track::count(),
            'playlists' => Playlist::count(),
            'artists' => Artist::count(),
            'albums' => Album::count(),
            'genres' => Genre::count(),
            'labels' => Label::count(),
            default => null,
        };
    }
}
