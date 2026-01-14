<?php

namespace App\Models\Rekordbox;

class PlaylistItem extends BaseModel
{
    protected $table = 'djmdSongPlaylist';
    protected $primaryKey = 'ID';

    public function playlist()
    {
        return $this->belongsTo(Playlist::class, 'PlaylistID', 'ID');
    }

    public function track()
    {
        return $this->belongsTo(Track::class, 'ContentID', 'ID');
    }
}
