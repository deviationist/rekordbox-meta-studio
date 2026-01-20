<?php

namespace App\Helpers;

class DurationConverter
{
    public static function toSeconds(string $duration): int
    {
        // Try HH:MM:SS or MM:SS format first
        if (preg_match('/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/', $duration, $matches)) {
            $hours = isset($matches[3]) ? (int)$matches[1] : 0;
            $minutes = isset($matches[3]) ? (int)$matches[2] : (int)$matches[1];
            $seconds = isset($matches[3]) ? (int)$matches[3] : (int)$matches[2];

            return ($hours * 3600) + ($minutes * 60) + $seconds;
        }

        // Try abbreviated format (1d2h30m45s)
        if (preg_match('/^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/', $duration, $matches)) {
            $days = !empty($matches[1]) ? (int)$matches[1] : 0;
            $hours = !empty($matches[2]) ? (int)$matches[2] : 0;
            $minutes = !empty($matches[3]) ? (int)$matches[3] : 0;
            $seconds = !empty($matches[4]) ? (int)$matches[4] : 0;

            return ($days * 86400) + ($hours * 3600) + ($minutes * 60) + $seconds;
        }

        throw new \InvalidArgumentException("Invalid duration format: {$duration}");
    }
}
