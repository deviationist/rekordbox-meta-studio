<?php declare(strict_types=1);

namespace App\Models\Rekordbox;

class Album extends BaseModel
{
    protected $table = 'djmdAlbum';
    protected $primaryKey = 'ID';

    public function tracks()
    {
        return $this->hasMany(Track::class, 'AlbumID', 'ID');
    }

    public function artist()
    {
        return $this->belongsTo(Artist::class, 'ArtistID', 'ID');
    }
}
