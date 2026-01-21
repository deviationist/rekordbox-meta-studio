<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\ValidationRule;

class BooleanString implements ValidationRule
{
    public function validate(string $attribute, mixed $value, \Closure $fail): void
    {
        $acceptedValues = [true, false, 1, 0, '1', '0', 'true', 'false', 'yes', 'no', 'on', 'off'];

        if (!in_array($value, $acceptedValues, true)) {
            $fail('The :attribute field must be true or false.');
        }
    }
}
