<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LibraryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EntityController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LibraryStatusController;
use App\Http\Controllers\Rekordbox\ArtistController;
use App\Http\Controllers\Rekordbox\TrackController;
use App\Http\Controllers\Rekordbox\AlbumController;
use App\Http\Controllers\Rekordbox\GenreController;
use App\Http\Controllers\Rekordbox\LabelController;
use App\Http\Controllers\Rekordbox\PlaylistController;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
    Route::prefix('libraries')->name('libraries.')->group(function () {
        Route::get('/', [LibraryController::class, 'index'])->name('index');
        Route::get('create', [LibraryController::class, 'create'])->name('create');
        Route::post('/', [LibraryController::class, 'store'])->name('store');
        Route::get('{library}/status', [LibraryStatusController::class, 'show'])->name('status');
        Route::get('{library}/edit', [LibraryController::class, 'edit'])->name('edit');
        Route::put('{library}', [LibraryController::class, 'update'])->name('update');
        Route::delete('{library}', [LibraryController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('library')->name('library.')->group(function () {
        Route::get('/default', [LibraryController::class, 'redirectToDefaultLibrary'])->name('redirect-to-default-library');
        Route::get('/', [LibraryController::class, 'redirectToIndex'])->name('redirect-to-library-index');

        Route::prefix('{library}')->middleware(['rekordbox-connection'])->group(function () {
            Route::get('/', [LibraryController::class, 'redirectToDefaultLibraryRoute'])->name('redirect-to-default-route');
            Route::get('/entity-count', [EntityController::class, 'index'])->name('entity-count');
            Route::get('tracks', [TrackController::class, 'index'])->name('tracks.index');
            Route::get('tracks/{track}', [TrackController::class, 'show'])->name('tracks.show');
            Route::get('tracks/{track}/artwork', [TrackController::class, 'artwork'])->name('tracks.artwork.show');

            Route::get('playlists', [PlaylistController::class, 'index'])->name('playlists.index');
            Route::get('playlists/{playlist}', [PlaylistController::class, 'show'])->name('playlists.show');
            Route::get('playlists/{playlist}/artwork', [PlaylistController::class, 'artwork'])->name('playlists.artwork.show');

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

require __DIR__.'/settings.php';
