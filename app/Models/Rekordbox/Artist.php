<?php declare(strict_types=1);

namespace App\Models\Rekordbox;

use App\Models\Traits\HasArtistSplitting;

class Artist extends BaseModel
{
    use HasArtistSplitting;

    protected $table = 'djmdArtist';
    protected $primaryKey = 'ID';

    public function tracks()
    {
        return $this->hasMany(Track::class, 'ArtistID', 'ID');
    }

    public function albums()
    {
        return $this->hasMany(Album::class, 'AlbumArtistID', 'ID');
    }
}
