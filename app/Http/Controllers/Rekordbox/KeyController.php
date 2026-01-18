<?php

namespace App\Http\Controllers\Rekordbox;

use App\Http\Controllers\Traits\HasFilterSearch;
use App\Models\Rekordbox\Key;
use Illuminate\Http\Request;

class KeyController extends BaseController
{
    use HasFilterSearch;

    public function search(Request $request)
    {
        return $this->filterSearch($request, Key::class);
    }
}
