<?php

namespace App\Http\Controllers\Traits;

use App\Http\Resources\FilterItem;
use App\Models\Rekordbox\BaseModel;
use Illuminate\Http\Request;

trait HasFilterSearch
{
    /**
     * @param class-string<BaseModel> $modelClass
     */
    public function filterSearch(Request $request, string $modelClass)
    {
        $searchField = $modelClass::$filterLabelKey;
        $query = $modelClass::query()->select(['ID', $searchField]);


        if ($request->filled('search')) {
            $query->where(function ($q) use ($request, $searchField) {
                $q->where($searchField, 'like', "%{$request->string('search')}%");
            });
        }

        if ($request->filled('exclude')) {
            $excludeIds = explode(',', $request->string('exclude'));
            $query->whereNotIn('ID', $excludeIds);
        }

        $items = $query->limit(100)->get();

        return response()->json([
            'data' => FilterItem::collection($items)
        ]);
    }
}
