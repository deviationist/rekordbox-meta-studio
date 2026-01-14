<?php

namespace App\Models\Traits;

trait HasReadonlyTimestamps
{
    public $timestamps = false;

    public function initializeHasReadonlyTimestamps(): void
    {
        $this->casts = array_merge($this->casts, [
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
        ]);

        $this->guarded = array_merge($this->guarded, [
            'created_at',
            'updated_at',
        ]);
    }
}
