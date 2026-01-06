<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class OnOffBoolean implements CastsAttributes
{
    public function get($model, string $key, $value, array $attributes)
    {
        return $value === 'on';
    }

    public function set($model, string $key, $value, array $attributes)
    {
        return $value ? 'on' : 'off';
    }
}
