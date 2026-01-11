<?php

namespace App\Providers;

use App\Models\Library;
use App\Services\CurrentLibrary;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->configureRouteModelBindings();
    }

    /**
     * Configure route model bindings.
     */
    protected function configureRouteModelBindings(): void
    {
        Route::bind('library', function (?string $value = null) {
            // If value is provided in URL, use explicit binding
            if ($value !== null) {
                $library = Library::findOrFail($value);
                $library->configureRekordboxConnection();
                return $library;
            }

            // Otherwise, get current library
            $currentLibrary = app(CurrentLibrary::class);
            $library = $currentLibrary->get();

            if (!$library) {
                abort(404, 'No library available');
            }

            return $library;
        });
    }
}
