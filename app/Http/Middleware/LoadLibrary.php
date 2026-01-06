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

    private function getExplicitLibrary(Request $request): Library | null
    {
        if ($library = $request->route('library')) {
            return $library;
        }

        $libraryFromHeader = $request->header('X-Library-Id');
        if ($libraryFromHeader) {
            $userId = Auth::id();
            if ($library = Library::forUser($userId)->where('id', $libraryFromHeader)->get()) {
                return $library;
            }
        }

        return null;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return $next($request);
        }

        $library = $this->getExplicitLibrary($request);

        if (!$library) {
            // Fallback to default library
            $userId = Auth::id();

            // Get user's libraries
            $libraries = Library::forUser($userId)->get();

            if ($libraries->isEmpty()) {
                // No libraries - redirect to library creation
                return redirect()->route('libraries.create');
            }

            $library = Library::forUser($userId)->getDefault();
        }

        // Configure the rekordbox connection
        $this->connectionManager->configureConnection($library);

        return $next($request);
    }
}
