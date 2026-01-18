<?php

namespace App\Http\Controllers\Rekordbox;

use App\Http\Controllers\Traits\HasFilterSearch;
use App\Http\Resources\Rekordbox\LabelResource;
use App\Models\Rekordbox\Label;
use Illuminate\Http\Request;
use Inertia\Response;

class LabelController extends BaseController
{
    use HasFilterSearch;

    public function search(Request $request)
    {
        return $this->filterSearch($request, Label::class);
    }

    public function index(Request $request): Response
    {
        $query = Label::query()
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

        $labels = $query->paginate(self::DEFAULT_PER_PAGE);

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
