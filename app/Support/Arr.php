<?php

namespace App\Support;

use Illuminate\Support\Arr as BaseArr;
use Illuminate\Support\Str;

class Arr extends BaseArr
{
    /**
     * Convert all array keys to camelCaserecursively.
     *
     * @param  array  $data
     * @return array
     */
    public static function toCamelCase(array $data): array
    {
        $result = [];

        foreach ($data as $key => $value) {
            $camelKey = Str::camel($key);
            $result[$camelKey] = is_array($value)
                ? static::toCamelCase($value)
                : $value;
        }

        return $result;
    }


    /**
     * Convert all array keys to StudlyCase (PascalCase) recursively.
     *
     * @param  array  $data
     * @return array
     */
    public static function toStudlyCase(array $data): array
    {
        $result = [];

        foreach ($data as $key => $value) {
            $studlyKey = Str::studly($key);
            $result[$studlyKey] = is_array($value)
                ? static::toStudlyCase($value)
                : $value;
        }

        return $result;
    }

    /**
     * Alias for toStudlyCase.
     *
     * @param  array  $data
     * @return array
     */
    public static function toPascalCase(array $data): array
    {
        return static::toStudlyCase($data);
    }
}
