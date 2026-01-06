<?php

namespace App\Http\Controllers;

use App\Http\Resources\Rekordbox\ArtistResource;
use App\Models\Rekordbox\Artist;
use Illuminate\Http\Request;
use Inertia\Response;

class ArtistController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->integer('per_page', 50);

        $query = Artist::query();

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

        $artists = $query->paginate($perPage);

        return inertia('artists/index', [
            'data' => ArtistResource::collection($artists),
            'filters' => [
                'search' => $request->string('search', ''),
            ],
        ]);
    }

    public function show(Artist $artist)
    {
        return inertia('artists/show', compact('artist'));
    }
}
