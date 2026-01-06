<?php

namespace App\Http\Resources\Rekordbox;

class ArtistResource extends BaseResource
{
    protected function additionalFields(): array
    {
        return [
            'id' => $this->ID,
            'name' => $this->Name,
            'trackCount' => count($this->tracks),
            'albumCount' => count($this->albums),
            //'searchString' => $this->SearchStr,
        ];
    }
}
