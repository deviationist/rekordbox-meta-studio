<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Inertia\Inertia;
use Throwable;

class Handler extends ExceptionHandler
{
    // ... existing code ...

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->renderable(function (LibraryConnectionException $e, $request) {
            if ($request->wantsJson()) {
                return response()->json([
                    'message' => $e->getMessage(),
                ], 500);
            }

            return Inertia::render('Errors/LibraryConnection', [
                'message' => $e->getMessage(),
            ])->toResponse($request)->setStatusCode(500);
        });
    }
}
