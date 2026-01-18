<?php

namespace App\Http\Resources\Rekordbox;

class PlaylistItemResource extends BaseResource
{
    protected function additionalFields(): array
    {
        return [
            'playlist' => PlaylistResource::make($this->playlist)->resolve(),
            'track' => TrackResource::make($this->track)->resolve(),
            'trackNumber' => $this->TrackNo,
        ];
    }
}
