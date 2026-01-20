<?php

namespace App\Enums\Traits;

interface HasUnknownCase
{
    public static function unknown(): self;
}

trait HasEnumHelpers
{
    public static function tryFromName(string $name): ?static
    {
        return array_find(self::cases(), fn($case) => $case->name === $name);
    }

    public static function fromValue(int $value): self
    {
        if (!method_exists(self::class, 'unknown')) {
            throw new \LogicException('Enum must implement HasUnknownCase interface');
        }

        return self::tryFrom($value) ?? self::unknown();
    }
}
