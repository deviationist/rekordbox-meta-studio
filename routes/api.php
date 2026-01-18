<?php

use App\Http\Controllers\Rekordbox\AlbumController;
use App\Http\Controllers\Rekordbox\ArtistController;
use App\Http\Controllers\Rekordbox\GenreController;
use App\Http\Controllers\Rekordbox\KeyController;
use App\Http\Controllers\Rekordbox\LabelController;
use App\Http\Controllers\Rekordbox\PlaylistController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:web'])->name('api.')->group(function () {
    Route::prefix('library/{library}')->middleware(['rekordbox-connection'])->name('library.')->group(function () {
        Route::get('artists', [ArtistController::class, 'search'])->name('artist.search');
        Route::get('album', [AlbumController::class, 'search'])->name('album.search');
        Route::get('genre', [GenreController::class, 'search'])->name('genre.search');
        Route::get('label', [LabelController::class, 'search'])->name('label.search');
        Route::get('key', [KeyController::class, 'search'])->name('key.search');
        Route::get('playlist', [PlaylistController::class, 'search'])->name('playlist.search');
    });
});
