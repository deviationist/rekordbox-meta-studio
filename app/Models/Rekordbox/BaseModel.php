<?php

namespace App\Models\Rekordbox;

use App\Models\Traits\HasReadonlyTimestamps;
use App\Models\Traits\HasRekordboxDeletion;
use App\Models\Traits\ResolvesFromLibraryDatabase;
use Illuminate\Database\Eloquent\Model;
use App\Models\Library;
use App\Services\LibraryConnectionManager;
use Illuminate\Database\Eloquent\Casts\Attribute;

class BaseModel extends Model {

    use HasReadonlyTimestamps, HasRekordboxDeletion, ResolvesFromLibraryDatabase;

    protected $connection = 'rekordbox';

    protected function library(): Attribute
    {
        return Attribute::make(
            get: function () {
                $config = config(LibraryConnectionManager::$connectionName);
                $libraryId = $config['library'];
                return Library::find($libraryId);
            }
        );
    }
}
