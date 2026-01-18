<?php

namespace App\Http\Controllers\Traits;

use App\Http\Requests\TrackIndexRequest;
use App\Http\Resources\FilterItem;
use App\Models\Rekordbox\Album;
use App\Models\Rekordbox\Artist;
use App\Models\Rekordbox\Genre;
use App\Models\Rekordbox\Label;
use App\Models\Rekordbox\Track;
use App\Models\Rekordbox\Key;
use App\Models\Rekordbox\Tag;
use App\Models\Rekordbox\Playlist;

trait ResolvesFilters
{
    private $resolvableFilters = [
        'artist' => Artist::class,
        'album' => Album::class,
        'albumArtist' => Artist::class,
        'genre' => Genre::class,
        'label' => Label::class,
        'remixer' => Artist::class,
        'originalArtist' => Artist::class,
        'key' => Key::class,
        'composer' => Artist::class,
        'playlist' => Playlist::class,
        'tag' => Tag::class,
        'track' => Track::class,
    ];

    private function activeFiltersFromRequest(TrackIndexRequest $request): array
    {
        $filters = $request->validated();
        foreach ($this->resolvableFilters as $key => $model) {
            if (isset($filters[$key])) {
                $filters[$key] = FilterItem::collection(
                    $model::select(['ID', $model::$filterLabelKey])
                        ->whereIn($model::$filterIdentificationKey, $filters[$key])
                        ->get()
                )->resolve();
            }
        }

        return $filters;
    }
}
