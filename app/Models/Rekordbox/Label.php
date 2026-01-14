<?php declare(strict_types=1);

namespace App\Models\Rekordbox;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Label extends BaseModel
{
    protected $table = 'djmdLabel';
    protected $primaryKey = 'ID';

    public function tracks(): HasMany
    {
        return $this->hasMany(Track::class, 'LabelID', 'ID');
    }

    public function artists(): HasManyThrough
    {
        return $this->hasManyThrough(
            Artist::class,
            Track::class,
            'LabelID',
            'ID',
            'ID',
            'ArtistId',
        );
    }
}
