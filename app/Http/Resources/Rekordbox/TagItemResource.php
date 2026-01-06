<?php

namespace App\Http\Resources\Rekordbox;

class TagItemResource extends BaseResource
{
    protected function additionalFields(): array
    {
        return [
            'id' => $this->ID,
            'tag' => TagResource::make($this->tag)->resolve(),
            'track' => TrackResource::make($this->track)->resolve(),
            'trackNumber' => $this->TrackNo,
        ];
    }
}
