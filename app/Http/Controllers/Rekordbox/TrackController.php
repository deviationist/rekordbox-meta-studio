<?php

namespace App\Http\Controllers\Rekordbox;

use App\Http\Controllers\Traits\HasArtwork;
use App\Http\Requests\TrackIndexRequest;
use App\Http\Resources\Rekordbox\TrackResource;
use App\Models\Library;
use App\Models\Rekordbox\Track;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Response;

class TrackController extends BaseController
{
    use HasArtwork;

    public function index(TrackIndexRequest $request): Response
    {

        //$validated = $this->validateFilters($request);

        $query = Track::query()
            ->with([
                'artist',
                'album',
                'genre',
                'label',
                'remixer',
                'originalArtist',
                'key',
                'composer'
            ]);

        $this->applyFilters($query, $request);
        $this->applySorting($query, $request);

        $tracks = $query->paginate(self::DEFAULT_PER_PAGE);

        return inertia('tracks/index', [
            'data' => TrackResource::collection($tracks),
            'meta' => [
                'total' => $tracks->total(),
                'per_page' => $tracks->perPage(),
                'current_page' => $tracks->currentPage(),
                'last_page' => $tracks->lastPage(),
            ],
        ]);
    }

    private function applySorting(Builder $query, TrackIndexRequest $request): void
    {
        if ($request->has('sortBy')) {
            $query->orderBy($request->get('sortBy'), $request->get('sortOrder', 'asc'));
        }
    }

    private function applyFilters(Builder $query, TrackIndexRequest $request): void
    {
        // Search filter
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function (Builder $q) use ($search) {
                $q->where('Title', 'like', "%{$search}%")
                    ->orWhereHas('artist', fn(Builder $artistQuery) =>
                        $artistQuery->where('Name', 'like', "%{$search}%")
                    )
                    ->orWhereHas('album', fn(Builder $albumQuery) =>
                        $albumQuery->where('Name', 'like', "%{$search}%")
                    );
            });
        }

        // Genre filter
        if ($request->has('genre')) {
            $query->whereHas('genre', fn(Builder $genreQuery) =>
                $genreQuery->whereRaw('LOWER(Name) = ?', [strtolower($request->get('genre'))])
            );
        }

        // BPM range filters
        if ($request->has('minBpm')) {
            $query->where('BPM', '>=', $request->get('minBpm'));
        }
        if ($request->has('maxBpm')) {
            $query->where('BPM', '>=', $request->get('maxBpm'));
        }

        // Key filter
        if ($request->has('key')) {
            $query->whereHas('key', fn(Builder $keyQuery) =>
                $keyQuery->where('ScaleName', $request->get('key'))
            );
        }

        // Rating range filters
        if ($request->has('minRating')) {
            $query->where('Rating', '>=', $request->get('minRating'));
        }

        if ($request->get('maxRating')) {
            $query->where('Rating', '<=', $request->get('maxRating'));
        }
    }

    public function artwork(Request $request, Library $library, Track $track)
    {
        return $this->resolveArtwork(
            $library,
            $track->getArtworkPath($request->query('size')),
        );
    }

    public function show(Track $track)
    {
        $track->load(['artist', 'album', 'genre']);

        return inertia('tracks/show', [
            'track' => TrackResource::make($track)->resolve(),
        ]);
    }
}
