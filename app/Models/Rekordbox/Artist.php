<?php declare(strict_types=1);

namespace App\Models\Rekordbox;

use App\Models\Traits\HasArtistSplitting;
use App\Models\Traits\HasReadonlyTimestamps;
use App\Models\Traits\HasRekordboxDeletion;
use Illuminate\Database\Eloquent\Model;

class Artist extends Model
{
    use HasReadonlyTimestamps, HasRekordboxDeletion, HasArtistSplitting;

    protected $connection = 'rekordbox';
    protected $table = 'djmdArtist';
    protected $primaryKey = 'ID';
    public $timestamps = false;

    public function tracks()
    {
        return $this->hasMany(Track::class, 'ArtistID', 'ID');
    }

    public function albums()
    {
        return $this->hasMany(Album::class, 'AlbumArtistID', 'ID');
    }
}
