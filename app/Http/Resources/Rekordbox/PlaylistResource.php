<?php

namespace App\Http\Resources\Rekordbox;

class PlaylistResource extends BaseResource
{
    protected function additionalFields(): array
    {
        return [
            'id' => $this->ID,
            'sequence' => $this->Seq,
            'name' => $this->Name,
            'hasArtwork' => $this->hasArtwork(),
            //'artworkUrl' => $this->getArtworkUrl('m'),
            //'imagePath' => $this->ImagePath,
            'itemCount' => count($this->items),
            'attribute' => $this->Attribute,
            'parentId' => $this->parentID,
            'smartList' => $this->SmartList,
        ];
    }
}
