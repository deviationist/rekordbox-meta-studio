<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Library;
use App\Services\LibraryConnectionManager;
use Illuminate\Support\Facades\Auth;

class LoadLibrary
{
    public function __construct(
        protected LibraryConnectionManager $connectionManager
    ) {}

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return $next($request);
        }

        $userId = Auth::id();
        $slug = $request->route('library');

        // Get user's libraries
        $libraries = Library::forUser($userId)->get();

        if ($libraries->isEmpty()) {
            // No libraries - redirect to library creation
            return redirect()->route('libraries.create');
        }

        // Determine which library to use
        if ($slug) {
            // Specific library requested
            $library = $libraries->firstWhere('slug', $slug);

            if (!$library) {
                abort(404, 'Library not found');
            }
        } else {
            // No slug - use first library (single library scenario)
            if ($libraries->count() > 1) {
                // Multiple libraries but no slug - redirect to library selector
                return redirect()->route('library.select');
            }

            $library = $libraries->first();
        }

        // Configure the rekordbox connection
        $this->connectionManager->configureConnection($library);

        // Share library data with Inertia
        $request->merge(['currentLibrary' => $library]);

        return $next($request);
    }
}
