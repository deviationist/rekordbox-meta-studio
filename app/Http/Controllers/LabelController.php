<?php

namespace App\Http\Controllers;

use App\Http\Resources\Rekordbox\LabelResource;
use App\Models\Rekordbox\Label;
use Illuminate\Http\Request;
use Inertia\Response;

class LabelController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->integer('per_page', 50);

        $query = Label::query();

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

        $labels = $query->paginate($perPage);

        return inertia('labels/index', [
            'data' => LabelResource::collection($labels),
            'filters' => [
                'search' => $request->string('search', ''),
            ],
        ]);
    }

    public function show(Label $label)
    {
        return inertia('labels/show', compact('label'));
    }
}
