<?php declare(strict_types=1);

namespace App\Models\Rekordbox;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Tag extends BaseModel
{
    protected $table = 'djmdMyTag';
    protected $primaryKey = 'ID';

    public function items(): HasMany
    {
        return $this->hasMany(TagItem::class, 'MyTagId', 'ID');
    }

    public function tracks(): HasManyThrough
    {
        return $this->hasManyThrough(
            Track::class,
            PlaylistItem::class,
            'MyTagId', // Foreign key on TagItem table...
            'ID',         // Foreign key on Track table...
            'ID',         // Local key on Tag table...
            'ContentID'   // Local key on TagItem table...
        );
    }

    public function artists(): HasManyThrough
    {
        return $this->hasManyThrough(
            Artist::class,
            Track::class,
            'ID',         // Foreign key on Track table...
            'ID',         // Foreign key on Artist table...
            'ID',         // Local key on Tag table...
            'ArtistID'    // Local key on Track table...
        );
    }
}
