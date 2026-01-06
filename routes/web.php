<?php

use App\Http\Controllers\LibraryController;
use App\Http\Controllers\ArtistController;
use App\Http\Controllers\TrackController;
use App\Http\Controllers\AlbumController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\LabelController;
use App\Http\Controllers\PlaylistController;
use App\Http\Middleware\LoadLibrary;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

    Route::prefix('libraries')->name('libraries.')->group(function () {
        Route::get('/', [LibraryController::class, 'index'])->name('index');
        Route::get('create', [LibraryController::class, 'create'])->name('create');
        Route::post('/', [LibraryController::class, 'store'])->name('store');
        Route::get('{library}/edit', [LibraryController::class, 'edit'])->name('edit');
        Route::put('{library}', [LibraryController::class, 'update'])->name('update');
        Route::delete('{library}', [LibraryController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('library')->name('library.')->group(function () {
        Route::get('/', [LibraryController::class, 'redirect'])->name('redirect');
        Route::get('select', [LibraryController::class, 'select'])->name('select');

        Route::middleware([LoadLibrary::class])->group(function () {
            Route::get('tracks', [TrackController::class, 'index'])->name('tracks.index');
            Route::get('tracks/{track}', [TrackController::class, 'show'])->name('tracks.show');

            Route::get('playlists', [PlaylistController::class, 'index'])->name('playlists.index');
            Route::get('playlists/{playlist}', [PlaylistController::class, 'show'])->name('playlists.show');

            Route::get('artists', [ArtistController::class, 'index'])->name('artists.index');
            Route::get('artists/{artist}', [ArtistController::class, 'show'])->name('artists.show');

            Route::get('albums', [AlbumController::class, 'index'])->name('albums.index');
            Route::get('albums/{album}', [AlbumController::class, 'show'])->name('albums.show');

            Route::get('genres', [GenreController::class, 'index'])->name('genres.index');
            Route::get('genres/{genre}', [GenreController::class, 'show'])->name('genres.show');

            Route::get('labels', [LabelController::class, 'index'])->name('labels.index');
            Route::get('labels/{label}', [LabelController::class, 'show'])->name('labels.show');

            Route::prefix('{library}')->name('named.')->group(function () {
                Route::get('tracks', [TrackController::class, 'index'])->name('tracks.index');
                Route::get('tracks/{track}', [TrackController::class, 'show'])->name('tracks.show');

                Route::get('playlists', [PlaylistController::class, 'index'])->name('playlists.index');
                Route::get('playlists/{playlist}', [PlaylistController::class, 'show'])->name('playlists.show');

                Route::get('artists', [ArtistController::class, 'index'])->name('artists.index');
                Route::get('artists/{artist}', [ArtistController::class, 'show'])->name('artists.show');

                Route::get('albums', [AlbumController::class, 'index'])->name('albums.index');
                Route::get('albums/{album}', [AlbumController::class, 'show'])->name('albums.show');

                Route::get('genres', [GenreController::class, 'index'])->name('genres.index');
                Route::get('genres/{genre}', [GenreController::class, 'show'])->name('genres.show');

                Route::get('labels', [LabelController::class, 'index'])->name('labels.index');
                Route::get('labels/{label}', [LabelController::class, 'show'])->name('labels.show');
            });
        });
    });
});

require __DIR__.'/settings.php';
