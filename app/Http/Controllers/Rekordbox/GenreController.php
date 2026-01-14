<?php

namespace App\Http\Controllers\Rekordbox;

use App\Http\Resources\Rekordbox\GenreResource;
use App\Models\Rekordbox\Genre;
use Illuminate\Http\Request;
use Inertia\Response;

class GenreController extends BaseController
{
    public function index(Request $request): Response
    {
        $query = Genre::query()
            ->with(['tracks', 'artists']);

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

        $genres = $query->paginate(self::DEFAULT_PER_PAGE);

        return inertia('genres/index', [
            'data' => GenreResource::collection($genres),
            'filters' => [
                'search' => $request->string('search', ''),
            ],
        ]);
    }

    public function show(Genre $genre)
    {
        return inertia('genres/show', compact('genre'));
    }
}
