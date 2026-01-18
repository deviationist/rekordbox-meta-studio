<?php

namespace App\Http\Controllers\Rekordbox;

use App\Http\Controllers\Traits\HasFilterSearch;
use App\Http\Resources\Rekordbox\AlbumResource;
use App\Models\Rekordbox\Album;
use Illuminate\Http\Request;
use Inertia\Response;

class AlbumController extends BaseController
{
    use HasFilterSearch;

    public function search(Request $request)
    {
        return $this->filterSearch($request, Album::class);
    }

    public function index(Request $request): Response
    {
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

        $albums = $query->paginate(self::DEFAULT_PER_PAGE);

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
