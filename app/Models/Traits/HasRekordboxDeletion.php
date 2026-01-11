<?php

namespace App\Models\Traits;

use App\Models\Rekordbox\Scopes\ExcludeRekordboxDeletedScope;
use Illuminate\Database\Eloquent\Builder;

trait HasRekordboxDeletion
{
    /**
     * Boot the trait and add global scope
     */
    protected static function bootHasRekordboxDeletion(): void
    {
        static::addGlobalScope(new ExcludeRekordboxDeletedScope());
    }

    /**
     * Query only deleted/inactive items
     */
    public function scopeOnlyDeleted(Builder $query): Builder
    {
        $table = $query->getModel()->getTable();

        return $query->withoutGlobalScope(ExcludeRekordboxDeletedScope::class)
                     ->where(function ($q) use ($table) {
                         $q->where("{$table}.rb_data_status", '!=', 0)
                           ->orWhere("{$table}.rb_local_data_status", '!=', 0)
                           ->orWhere("{$table}.rb_local_deleted", '!=', 0);
                     });
    }

    /**
     * Query all items including deleted/inactive
     */
    public function scopeWithDeleted(Builder $query): Builder
    {
        return $query->withoutGlobalScope(ExcludeRekordboxDeletedScope::class);
    }

    /**
     * Check if this item is marked as deleted
     */
    public function isDeleted(): bool
    {
        return $this->rb_data_status != 0
            || $this->rb_local_data_status != 0
            || $this->rb_local_deleted != 0;
    }
}
