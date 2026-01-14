<?php

namespace App\Http\Resources\Rekordbox;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArtworkMetaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'title' => $this['title'],
            'alt' => $this['alt'],
            'src' => $this['src'],
            'srcOriginal' => $this['src_original'],
        ];
    }
}
