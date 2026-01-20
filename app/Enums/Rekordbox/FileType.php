<?php

namespace App\Enums\Rekordbox;

use App\Enums\Traits\HasEnumHelpers;

enum FileType: int
{
    use HasEnumHelpers;

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

    public static function unknown(): self
    {
        return self::UNKNOWN;
    }
}
