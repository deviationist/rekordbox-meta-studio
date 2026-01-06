<?php declare(strict_types=1);

namespace App\Models\Rekordbox;

use App\Models\Traits\HasReadonlyTimestamps;
use App\Models\Traits\HasRekordboxDeletion;
use Illuminate\Database\Eloquent\Model;

class Key extends Model
{
    use HasReadonlyTimestamps, HasRekordboxDeletion;

    protected $connection = 'rekordbox';
    protected $table = 'djmdKey';
    protected $primaryKey = 'ID';
    public $timestamps = false;
}
