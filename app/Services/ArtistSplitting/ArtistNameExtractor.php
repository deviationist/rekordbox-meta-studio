<?php declare(strict_types=1);

namespace App\Services\ArtistSplitting;

class ArtistNameExtractor
{
    /**
     * Extract individual artist names from a compound name
     */
    public function extract(string $name): array
    {
        // Split by comma and clean up
        $names = array_map(
            fn($part) => trim($part),
            explode(',', $name)
        );

        return array_filter($names);
    }

    /**
     * Extract and return with metadata
     */
    public function extractWithMetadata(string $name): array
    {
        $names = $this->extract($name);

        return array_map(
            fn($extractedName, $position) => [
                'name' => $extractedName,
                'position' => $position,
                'length' => strlen($extractedName),
            ],
            $names,
            array_keys($names)
        );
    }

    /**
     * Normalize artist name for comparison
     */
    public function normalize(string $name): string
    {
        return strtolower(trim(
            preg_replace('/[^a-z0-9]/', '', strtolower($name))
        ));
    }

    /**
     * Check if a name is likely a compound artist
     */
    public function isCompound(string $name): bool
    {
        return str_contains($name, ',');
    }
}
