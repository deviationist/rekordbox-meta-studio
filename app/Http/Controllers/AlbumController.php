<?php

namespace App\Http\Controllers;

use App\Http\Resources\Rekordbox\AlbumResource;
use App\Models\Rekordbox\Album;
use Illuminate\Http\Request;
use Inertia\Response;

class AlbumController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->integer('per_page', 50);

        $query = Album::query()
            ->with(['artist', 'tracks']);

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

        $albums = $query->paginate($perPage);

        return inertia('albums/index', [
            'data' => AlbumResource::collection($albums),
            'filters' => [
                'search' => $request->string('search', ''),
            ],
        ]);
    }

    public function show(Album $album)
    {
        return inertia('albums/show', compact('album'));
    }
}
