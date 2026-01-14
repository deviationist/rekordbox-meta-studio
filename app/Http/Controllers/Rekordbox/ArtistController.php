<?php

namespace App\Http\Controllers\Rekordbox;

use App\Http\Resources\Rekordbox\ArtistResource;
use App\Models\Rekordbox\Artist;
use Illuminate\Http\Request;
use Inertia\Response;

class ArtistController extends BaseController
{
    public function index(Request $request): Response
    {
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

        $artists = $query->paginate(self::DEFAULT_PER_PAGE);

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
