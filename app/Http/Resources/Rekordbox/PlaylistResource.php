<?php

namespace App\Http\Resources\Rekordbox;

use App\Http\Resources\Rekordbox\ArtworkMetaResource;

class PlaylistResource extends BaseResource
{
    protected function additionalFields(): array
    {
        return [
            'sequence' => $this->Seq,
            'name' => $this->Name,
            'artwork' => $this->hasArtwork() ? ArtworkMetaResource::make($this->getArtworkMeta())->resolve() : null,
            'itemCount' => count($this->items),
            'attribute' => $this->Attribute,
            'parentId' => $this->parentID,
            'smartList' => $this->SmartList,
        ];
    }
}
