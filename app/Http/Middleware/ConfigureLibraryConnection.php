<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Library;
use Illuminate\Http\Request;

class ConfigureLibraryConnection
{
    public function handle(Request $request, Closure $next)
    {
        $library = $request->route()->parameter('library') ?? $this->getDefaultLibrary($request);
        if ($library) {
            $library->configureRekordboxConnection();
        } else {
            abort(404, 'No library available');
        }

        return $next($request);
    }

    private function getDefaultLibrary(Request $request): Library
    {
        return $request->user()->libraries()->getDefault();
    }
}
