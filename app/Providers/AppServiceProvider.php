<?php

namespace App\Providers;

use App\Models\Library;
use App\Policies\LibraryPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Library::class, LibraryPolicy::class);

        Route::bind('library', function (string $value) {
            return Library::findOrFail($value);
        });
    }
}
