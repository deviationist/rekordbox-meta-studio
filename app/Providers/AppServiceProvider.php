<?php

namespace App\Providers;

use App\Models\Library;
use App\Policies\LibraryPolicy;
use App\Services\CurrentLibrary;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(CurrentLibrary::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Library::class, LibraryPolicy::class);
    }
}
