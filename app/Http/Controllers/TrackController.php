<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\HasArtwork;
use App\Http\Resources\Rekordbox\TrackResource;
use App\Models\Library;
use App\Models\Rekordbox\Track;
use Illuminate\Http\Request;
use Inertia\Response;

class TrackController extends Controller
{
    use HasArtwork;

    public function index(Request $request, Library $library): Response
    {
        $perPage = $request->integer('per_page', 50);

        $query = Track::query()
            ->with(['artist', 'album', 'genre', 'label', 'remixer', 'originalArtist', 'key', 'composer']);

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('artist', 'like', "%{$search}%")
                  ->orWhere('album', 'like', "%{$search}%");
            });
        }

        if ($request->filled('genre')) {
            $query->where('genre_id', $request->string('genre'));
        }

        if ($request->filled('min_bpm')) {
            $query->where('bpm', '>=', $request->integer('min_bpm'));
        }

        if ($request->filled('max_bpm')) {
            $query->where('bpm', '<=', $request->integer('max_bpm'));
        }

        if ($request->filled('key')) {
            $query->where('key', $request->string('key'));
        }

        if ($request->filled('min_rating')) {
            $query->where('rating', '>=', $request->integer('min_rating'));
        }

        // Apply sorting
        $sortBy = $request->string('sort_by', 'title');
        $sortDir = $request->string('sort_dir', 'asc');
        $query->orderBy($sortBy, $sortDir);

        $tracks = $query->paginate($perPage);

        return inertia('tracks/index', [
            'librarySupportsArtwork' => $library->supportsArtwork(),
            'data' => TrackResource::collection($tracks),
            'filters' => [
                'search' => $request->string('search', ''),
                'genre' => $request->string('genre', ''),
                'min_bpm' => $request->integer('min_bpm'),
                'max_bpm' => $request->integer('max_bpm'),
                'key' => $request->string('key', ''),
                'min_rating' => $request->integer('min_rating'),
            ],
        ]);
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
