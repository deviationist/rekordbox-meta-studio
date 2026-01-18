<?php

namespace App\Http\Resources\Rekordbox;

class TagResource extends BaseResource
{
    protected function additionalFields(): array
    {
        return [
            'sequence' => $this->Seq,
            'name' => $this->Name,
            'attribute' => $this->Attribute,
            'parentId' => $this->parentID,
            'smartList' => $this->SmartList,
        ];
    }
}
