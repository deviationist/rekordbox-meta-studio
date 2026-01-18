<?php declare(strict_types=1);

namespace App\Models\Rekordbox;

class Key extends BaseModel
{
    protected $table = 'djmdKey';
    protected $primaryKey = 'ID';
    public static $filterIdentificationKey = 'ScaleName';
    public static $filterLabelKey = 'ScaleName';
}
