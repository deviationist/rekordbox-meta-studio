<?php

namespace App\Http\Resources\Rekordbox;

class KeyResource extends BaseResource
{
    protected function additionalFields(): array
    {
        return [
            'id' => $this->ID,
            'scaleName' => $this->ScaleName,
            'sequence' => $this->seq,
        ];
    }
}
