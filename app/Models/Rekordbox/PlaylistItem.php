<?php

namespace App\Models\Rekordbox;

use App\Models\Traits\HasReadonlyTimestamps;
use App\Models\Traits\HasRekordboxDeletion;
use Illuminate\Database\Eloquent\Model;

class PlaylistItem extends Model
{
    use HasReadonlyTimestamps, HasRekordboxDeletion;

    protected $connection = 'rekordbox';
    protected $table = 'djmdSongPlaylist';
    protected $primaryKey = 'ID';
    public $timestamps = false;

    public function playlist()
    {
        return $this->belongsTo(Playlist::class, 'PlaylistID', 'ID');
    }

    public function track()
    {
        return $this->belongsTo(Track::class, 'ContentID', 'ID');
    }
}
