<?php

namespace App\Http\Resources\Rekordbox;

class TrackResource extends BaseResource
{
    protected function additionalFields(): array
    {
        return [
            'title' => $this->Title,
        ];
    }
}
