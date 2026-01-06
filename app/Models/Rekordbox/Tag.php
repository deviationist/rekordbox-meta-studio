<?php declare(strict_types=1);

namespace App\Models\Rekordbox;

use App\Models\Traits\HasReadonlyTimestamps;
use App\Models\Traits\HasRekordboxDeletion;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Tag extends Model
{
    use HasReadonlyTimestamps, HasRekordboxDeletion;

    protected $connection = 'rekordbox';
    protected $table = 'djmdMyTag';
    protected $primaryKey = 'ID';
    public $timestamps = false;

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
