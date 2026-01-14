<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\HasArtwork;
use App\Http\Resources\Rekordbox\TrackResource;
use App\Models\Library;
use App\Models\Rekordbox\Track;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Response;

class TrackController extends Controller
{
    use HasArtwork;
    //private $filters = [];

    public function index(Request $request): Response
    {
        $perPage = $request->integer('per_page', 50);

        $query = Track::query()
            ->with(['artist', 'album', 'genre', 'label', 'remixer', 'originalArtist', 'key', 'composer']);

        $this->applyFilters($request, $query);
        $this->applySorting($request, $query);

        $tracks = $query->paginate($perPage);

        return inertia('tracks/index', [
            'data' => TrackResource::collection($tracks),
            'filters' => $this->getFilters($request),
        ]);
    }

    private function getFilters(Request $request): array
    {
        return request()->only(['search', 'genre', 'min_bpm', 'max_bpm', 'key', 'min_rating']);
        /*$filters = [];
        return [
            'search' => $request->string('search', ''),
            'genre' => $request->string('genre', ''),
            'min_bpm' => $request->integer('min_bpm', null),
            'max_bpm' => $request->integer('max_bpm', null),
            'key' => $request->string('key', ''),
            'min_rating' => $request->integer('min_rating'),
        ];*/
    }

    private function applySorting(Request $request, Builder $query)
    {
        $sortBy = $request->string('sort_by', 'title');
        $sortDir = $request->string('sort_dir', 'asc');
        $query->orderBy($sortBy, $sortDir);
    }

    private function applyFilters(Request $request, Builder $query)
    {
        if ($request->filled('search')) {
            $search = $request->string('search');
            //$filters['search'] = $search;
            $query->where(function ($q) use ($search) {
                $q->where('Title', 'like', "%{$search}%")
                ->orWhereHas('artist', function ($artistQuery) use ($search) {
                    $artistQuery->where('Title', 'like', "%{$search}%");
                })
                ->orWhereHas('album', function ($albumQuery) use ($search) {
                    $albumQuery->where('Name', 'like', "%{$search}%");
                });
            });
        }

        if ($request->filled('genre')) {
            $genreName = $request->string('genre');
            //$filters['genre'] = $genreName;
            $query->whereHas('genre', function ($genreQuery) use ($genreName) {
                $genreQuery->whereRaw('LOWER(Name) = ?', [strtolower($genreName)]);
            });
        }

        if ($request->filled('min_bpm')) {
            $query->where('BPM', '>=', $request->integer('min_bpm'));
        }

        if ($request->filled('max_bpm')) {
            $query->where('BPM', '<=', $request->integer('max_bpm'));
        }

        if ($request->filled('key')) {
            $keyName = $request->string('key');
            $query->whereHas('key', function ($keyQuery) use ($keyName) {
                $keyQuery->where('ScaleName', $keyName);
            });
        }

        if ($request->filled('min_rating')) {
            $query->where('Rating', '>=', $request->integer('min_rating'));
        }

        if ($request->filled('max_rating')) {
            $query->where('Rating', '<=', $request->integer('max_rating'));
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
