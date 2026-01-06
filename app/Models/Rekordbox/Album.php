<?php declare(strict_types=1);

namespace App\Models\Rekordbox;

use App\Models\Traits\HasReadonlyTimestamps;
use App\Models\Traits\HasRekordboxDeletion;
use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    use HasReadonlyTimestamps, HasRekordboxDeletion;

    protected $connection = 'rekordbox';
    protected $table = 'djmdAlbum';
    protected $primaryKey = 'ID';
    public $timestamps = false;

    public function tracks()
    {
        return $this->hasMany(Track::class, 'AlbumID', 'ID');
    }

    public function artist()
    {
        return $this->belongsTo(Artist::class, 'ArtistID', 'ID');
    }
}
