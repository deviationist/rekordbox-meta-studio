<?php

namespace App\Http\Resources\Rekordbox;

class LabelResource extends BaseResource
{
    protected function additionalFields(): array
    {
        return [
            'name' => $this->Name,
            'artistCount' => count($this->artists),
            'trackCount' => count($this->tracks),
        ];
    }
}
