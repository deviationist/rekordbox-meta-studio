<?php declare(strict_types=1);

namespace App\Models\Rekordbox;

use App\Models\Traits\HasReadonlyTimestamps;
use App\Models\Traits\HasRekordboxDeletion;
use Illuminate\Database\Eloquent\Model;

class TagItem extends Model
{
    use HasReadonlyTimestamps, HasRekordboxDeletion;

    protected $connection = 'rekordbox';
    protected $table = 'djmdSongMyTag';
    protected $primaryKey = 'ID';
    public $timestamps = false;

    public function tag()
    {
        return $this->belongsTo(Playlist::class, 'MyTagID', 'ID');
    }

    public function track()
    {
        return $this->belongsTo(Track::class, 'ContentID', 'ID');
    }
}
