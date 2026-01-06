<?php

namespace App\Http\Resources\Rekordbox;

class AlbumResource extends BaseResource
{
    protected function additionalFields(): array
    {
        return [
            'id' => $this->ID,
            'name' => $this->Name,
            'artist' => ArtistResource::make($this->artist)->resolve(),
            'imagePath' => $this->ImagePath,
            'compilation' => $this->Compilation,
            'trackCount' => count($this->tracks),
            //'searchString' => $this->SearchStr,
        ];
    }
}
