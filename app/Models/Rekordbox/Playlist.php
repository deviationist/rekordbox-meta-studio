<?php

namespace App\Models\Rekordbox;

use App\Models\Traits\HasRekordboxArtwork;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Playlist extends BaseModel
{
    use HasRekordboxArtwork;

    protected $table = 'djmdPlaylist';
    protected $primaryKey = 'ID';

    public function items(): HasMany
    {
        return $this->hasMany(PlaylistItem::class, 'PlaylistID', 'ID');
    }

    public function getArtworkMeta($size = 'm')
    {
        if (!$this->hasArtwork()) {
            return false;
        }
        $library = $this->library;
        return [
            'title' => '',
            'alt' => '',
            'src' => route('library.playlists.artwork.show', ['size' => $size, 'library' => $library, 'track' => $this]),
            'src_original' => route('library.playlists.artwork.show', ['size' => $size, 'library' => $library, 'track' => $this]),
        ];
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
