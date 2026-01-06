<?php

namespace App\Models\Traits;

trait HasRekordboxArtwork
{
    /**
     * Get artwork URL with optional size variant
     *
     * @param string|null $size Size variant: 'm' (medium), 's' (small), or null (original)
     * @return string|null
     */
    public function getArtworkUrl(?string $size = null): ?string
    {
        if (!$this->ImagePath) {
            return null;
        }

        // Remove leading slash and PIONEER prefix
        $relativePath = ltrim($this->ImagePath, '/');
        $relativePath = preg_replace('#^PIONEER/Artwork/#', '', $relativePath);

        // Add size suffix if requested
        if ($size !== null && in_array($size, ['m', 's'])) {
            $pathInfo = pathinfo($relativePath);
            $relativePath = $pathInfo['dirname'] . '/' .
                           $pathInfo['filename'] . '_' . $size . '.' .
                           $pathInfo['extension'];
        }

        return asset('storage/rekordbox-artwork/' . $relativePath);
    }
}
