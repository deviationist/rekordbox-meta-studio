<?php

namespace App\Http\Controllers;

use App\Http\Resources\Rekordbox\GenreResource;
use App\Models\Rekordbox\Genre;
use Illuminate\Http\Request;
use Inertia\Response;

class GenreController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->integer('per_page', 50);

        $query = Genre::query();

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

        $genres = $query->paginate($perPage);

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
