<?php declare(strict_types=1);

namespace App\Models\Rekordbox;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Genre extends BaseModel
{
    protected $table = 'djmdGenre';
    protected $primaryKey = 'ID';

    public function artists(): HasManyThrough
    {
        return $this->hasManyThrough(
            Artist::class,
            Track::class,
            'GenreID',
            'ID',
            'ID',
            'ArtistId',
        );
    }

    public function tracks(): HasMany
    {
        return $this->hasMany(Track::class, 'GenreID', 'ID');
    }
}
