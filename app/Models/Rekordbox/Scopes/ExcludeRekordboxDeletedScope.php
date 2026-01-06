<?php

namespace App\Models\Rekordbox\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class ExcludeRekordboxDeletedScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $builder->where('rb_data_status', 0)
                ->where('rb_local_data_status', 0)
                ->where('rb_local_deleted', 0);
    }
}
