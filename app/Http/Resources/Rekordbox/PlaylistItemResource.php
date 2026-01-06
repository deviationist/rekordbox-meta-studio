<?php

namespace App\Http\Resources\Rekordbox;

class PlaylistItemResource extends BaseResource
{
    protected function additionalFields(): array
    {
        return [
            'id' => $this->ID,
            'playlist' => new PlaylistResource($this->playlist),
            'track' => new TrackResource($this->track),
            'trackNumber' => $this->TrackNo,
        ];
    }
}
