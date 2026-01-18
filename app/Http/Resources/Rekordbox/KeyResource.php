<?php

namespace App\Http\Resources\Rekordbox;

class KeyResource extends BaseResource
{
    protected function additionalFields(): array
    {
        return [
            'scaleName' => $this->ScaleName,
            'sequence' => $this->seq,
        ];
    }
}
