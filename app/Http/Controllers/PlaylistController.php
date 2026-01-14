<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\HasArtwork;
use App\Http\Resources\Rekordbox\PlaylistResource;
use App\Models\Library;
use App\Models\Rekordbox\Playlist;
use Illuminate\Http\Request;
use Inertia\Response;

class PlaylistController extends Controller
{
    use HasArtwork;

    public function index(Request $request): Response
    {
        $perPage = $request->integer('per_page', 50);

        $query = Playlist::query()
            ->with(['items']);

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('Name', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        $sortBy = $request->string('sort_by', 'title');
        $sortDir = $request->string('sort_dir', 'asc');
        $query->orderBy($sortBy, $sortDir);

        $playlists = $query->paginate($perPage);

        return inertia('playlists/index', [
            'data' => PlaylistResource::collection($playlists),
            'filters' => [
                'search' => $request->string('search', ''),
            ],
        ]);
    }

    public function artwork(Request $request, Library $library, Playlist $playlist)
    {
        return $this->resolveArtwork(
            $library,
            $playlist->getArtworkPath($request->query('size'))
        );
    }

    public function show(Playlist $playlist)
    {
        return inertia('playlists/show', compact('playlist'));
    }
}
