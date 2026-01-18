<?php

namespace App\Http\Controllers\Rekordbox;

use App\Http\Controllers\Traits\HasArtwork;
use App\Http\Controllers\Traits\HasFilterSearch;
use App\Http\Resources\Rekordbox\TrackResource;
use App\Models\Library;
use App\Models\Rekordbox\Track;
use Illuminate\Http\Request;

class TrackController extends BaseController
{
    use HasArtwork, HasFilterSearch;

    public function search(Request $request)
    {
        return $this->filterSearch($request, Track::class, 'Title');
    }

    public function artwork(Request $request, Library $library, Track $track)
    {
        return $this->resolveArtwork(
            $library,
            $track->getArtworkPath($request->query('size')),
        );
    }

    public function show(Library $library, Track $track)
    {
        $track->load(['artist', 'album', 'genre']);

        return inertia('tracks/show', [
            'track' => TrackResource::make($track)->resolve(),
        ]);
    }
}
