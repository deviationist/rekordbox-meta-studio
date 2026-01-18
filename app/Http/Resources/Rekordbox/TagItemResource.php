<?php

namespace App\Http\Resources\Rekordbox;

class TagItemResource extends BaseResource
{
    protected function additionalFields(): array
    {
        return [
            'tag' => TagResource::make($this->tag)->resolve(),
            'track' => TrackResource::make($this->track)->resolve(),
            'trackNumber' => $this->TrackNo,
        ];
    }
}
