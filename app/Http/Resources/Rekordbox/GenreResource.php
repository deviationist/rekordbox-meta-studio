<?php

namespace App\Http\Resources\Rekordbox;

class GenreResource extends BaseResource
{
    protected function additionalFields(): array
    {
        return [
            'id' => $this->ID,
            'name' => $this->Name,
            'artistCount' => count($this->artists),
            'trackCount' => count($this->tracks),
        ];
    }
}
