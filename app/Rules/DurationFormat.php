<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class DurationFormat implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value)) {
            $fail("The {$attribute} must be a string.");
            return;
        }

        // Check if it matches HH:MM:SS or MM:SS format
        if (preg_match('/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/', $value, $matches)) {
            return; // Valid time format
        }

        // Check if it matches abbreviated format (1d2h30m45s)
        if (preg_match('/^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/', $value, $matches)) {
            // At least one component must be present
            if (strlen($value) > 0 && preg_match('/[dhms]/', $value)) {
                return; // Valid abbreviated format
            }
        }

        $fail("The {$attribute} must be in format HH:MM:SS, MM:SS, or abbreviated (e.g., 1d2h30m45s).");
    }
}
