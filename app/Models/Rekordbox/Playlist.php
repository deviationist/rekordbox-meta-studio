<?php

namespace App\Models\Rekordbox;

use App\Models\Traits\HasReadonlyTimestamps;
use App\Models\Traits\HasRekordboxArtwork;
use App\Models\Traits\HasRekordboxDeletion;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Playlist extends Model
{
    use HasReadonlyTimestamps, HasRekordboxDeletion, HasRekordboxArtwork;

    protected $connection = 'rekordbox';
    protected $table = 'djmdPlaylist';
    protected $primaryKey = 'ID';
    public $timestamps = false;

    public function items(): HasMany
    {
        return $this->hasMany(PlaylistItem::class, 'PlaylistID', 'ID');
    }

    public function tracks(): HasManyThrough
    {
        return $this->hasManyThrough(
            Track::class,
            PlaylistItem::class,
            'PlaylistID', // Foreign key on PlaylistItem table...
            'ID',         // Foreign key on Track table...
            'ID',         // Local key on Playlist table...
            'ContentID'   // Local key on PlaylistItem table...
        );
    }

    public function artists(): HasManyThrough
    {
        return $this->hasManyThrough(
            Artist::class,
            Track::class,
            'ID',         // Foreign key on Track table...
            'ID',         // Foreign key on Artist table...
            'ID',         // Local key on Playlist table...
            'ArtistID'    // Local key on Track table...
        );
    }
}
