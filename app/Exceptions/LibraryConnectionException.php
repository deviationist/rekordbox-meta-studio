<?php

namespace App\Exceptions;

use Exception;
use Inertia\Inertia;
use App\Http\Middleware\HandleInertiaRequests;

class LibraryConnectionException extends Exception
{
    public static function handle(LibraryConnectionException $e, $request) {
        if ($request->routeIs('libraries.*')) {
            return null; // Let the route handle it
        }
        dd('hehe');

        if ($request->wantsJson()) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
        $inertiaMiddleware = app(HandleInertiaRequests::class);
        $sharedData = $inertiaMiddleware->share($request);

        return Inertia::render('errors/library-connection', ['message' => $e->getMessage()])
            ->with($sharedData)
            ->toResponse($request)
            ->setStatusCode(500);
    }
}
