<?php

namespace App\Http\Resources\Rekordbox;

use Illuminate\Http\Resources\Json\JsonResource;

abstract class BaseResource extends JsonResource
{
    /**
     * Common fields shared across all track resources
     */
    protected function commonFields(): array
    {
        return [
            'uuid' => $this->UUID,
            //rb_data_status
            //rb_local_data_status
            //rb_local_deleted
            //rb_local_synced
            'usn' => $this->usn,
            //rb_local_usn
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }

    /**
     * Additional fields - override in child classes
     */
    protected function additionalFields(): array
    {
        return [];
    }

    public function toArray($request)
    {
        if (is_null($this->resource)) {
            return null;
        }
        return array_merge(
            $this->commonFields(),
            $this->additionalFields()
        );
    }
}
