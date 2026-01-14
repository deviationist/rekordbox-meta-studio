<?php declare(strict_types=1);

namespace App\Models\Rekordbox;

class TagItem extends BaseModel
{
    protected $table = 'djmdSongMyTag';
    protected $primaryKey = 'ID';

    public function tag()
    {
        return $this->belongsTo(Playlist::class, 'MyTagID', 'ID');
    }

    public function track()
    {
        return $this->belongsTo(Track::class, 'ContentID', 'ID');
    }
}
