<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LibraryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'userId' => $this->user->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'filePath' => $this->file_path,
            'storedFile' => $this->stored_file,
            'isRekordboxFolder' => $this->is_rekordbox_folder,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'deletedAt' => $this->deleted_at,
        ];
    }
}
