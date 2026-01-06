<?php

namespace App\Http\Resources\Rekordbox;

class TagItemResource extends BaseResource
{
    protected function additionalFields(): array
    {
        return [
            'id' => $this->ID,
            'tag' => new TagResource($this->tag),
            'track' => new TrackResource($this->track),
            'trackNumber' => $this->TrackNo,
        ];
    }
}
