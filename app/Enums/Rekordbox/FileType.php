<?php

namespace App\Enums\Rekordbox;

enum FileType: int
{
    case MP3 = 1;
    case AIFF = 12;
    case WAV = 11;
    case UNKNOWN = 0;

    // Optional: Add helper methods
    public function label(): string
    {
        return match($this) {
            self::MP3 => 'MP3',
            self::AIFF => 'AIFF',
            self::WAV => 'WAV',
            self::UNKNOWN => 'Unknown',
        };
    }

    public function extension(): string
    {
        return match($this) {
            self::MP3 => 'mp3',
            self::AIFF => 'aiff',
            self::WAV => 'wav',
            self::UNKNOWN => '',
        };
    }

    // Get enum from integer, fallback to UNKNOWN
    public static function fromValue(int $value): self
    {
        return self::tryFrom($value) ?? self::UNKNOWN;
    }
}
