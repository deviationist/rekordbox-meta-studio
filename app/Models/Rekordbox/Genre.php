<?php declare(strict_types=1);

namespace App\Models\Rekordbox;

use App\Models\Traits\HasReadonlyTimestamps;
use App\Models\Traits\HasRekordboxDeletion;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Genre extends Model
{
    use HasReadonlyTimestamps, HasRekordboxDeletion;

    protected $connection = 'rekordbox';
    protected $table = 'djmdGenre';
    protected $primaryKey = 'ID';
    public $timestamps = false;

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
