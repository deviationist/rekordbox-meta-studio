<?php

namespace App\Models\Traits;

trait HasRekordboxArtwork
{
    private $validSizes = ['m', 's'];

    public function hasArtwork(): bool
    {
        return $this->ImagePath !== "" && $this->ImagePath !== null;
    }

    private function getRelativePath(): ?string
    {
        if (!$this->ImagePath) {
            return null;
        }

        // Remove leading slash and PIONEER prefix
        $relativePath = ltrim($this->ImagePath, '/');
        return preg_replace('#^PIONEER/Artwork/#', '', $relativePath);
    }

    private function setSize(string $path, ?string $size = null)
    {
        // Add size suffix if requested
        if ($size !== null && in_array($size, $this->validSizes)) {
            $pathInfo = pathinfo($path);
            $path = $pathInfo['dirname'] . '/' .
                           $pathInfo['filename'] . '_' . $size . '.' .
                           $pathInfo['extension'];
        }
        return $path;
    }

    public function getArtworkPath(?string $size = null): ?string
    {
        $relativePath = $this->getRelativePath();
        if (!$relativePath) {
            return null;
        }

        return $this->setSize($relativePath, $size);
    }

    /**
     * Get artwork URL with optional size variant
     *
     * @param string|null $size Size variant: 'm' (medium), 's' (small), or null (original)
     * @return string|null
     */
    public function getArtworkUrl(?string $size = null): ?string
    {
        $relativePath = $this->getArtworkPath($size);
        if (!$relativePath) {
            return null;
        }

        return asset('storage/rekordbox-artwork/' . $relativePath);
    }
}
