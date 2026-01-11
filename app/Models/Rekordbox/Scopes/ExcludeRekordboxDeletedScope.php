<?php

namespace App\Models\Rekordbox\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class ExcludeRekordboxDeletedScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     *
     * @param  Builder<Model>  $builder
     * @param  Model  $model
     */
    public function apply(Builder $builder, Model $model): void
    {
        $table = $model->getTable();

        $builder->where("{$table}.rb_data_status", 0)
                ->where("{$table}.rb_local_data_status", 0)
                ->where("{$table}.rb_local_deleted", 0);
    }
}
