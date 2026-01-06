<?php

namespace App\Models\Rekordbox\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class ExcludeStreamingFilesScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $builder->where('rb_file_id', '!=', 0);
    }
}
