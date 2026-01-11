<?php

namespace App\Http\Controllers\Traits;

use App\Models\Library;
use Illuminate\Support\Facades\File;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

trait HasArtwork {
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
    ];

    private const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    protected function resolveArtwork(Library $library, string $path)
    {
        if (!$library->supportsArtwork()) {
            abort(404, 'Library does not support artwork');
        }

        $artworkBaseDir = realpath($library->artwork_base_path);

        if (!$artworkBaseDir || !is_dir($artworkBaseDir)) {
            abort(404, 'Artwork directory not found');
        }

        $imagePath = $this->buildSafePath($artworkBaseDir, $path);

        if ($artworkBaseDir === false || !is_dir($artworkBaseDir)) {
            throw new NotFoundHttpException('Artwork directory not found');
        }

        // Validate and build the full image path
        $imagePath = $this->buildSafePath($artworkBaseDir, $path);

        if (!File::exists($imagePath)) {
            throw new NotFoundHttpException('Image not found');
        }

        // Verify it's actually an image
        $mimeType = File::mimeType($imagePath);
        if (!in_array($mimeType, self::ALLOWED_MIME_TYPES)) {
            throw new NotFoundHttpException('Invalid file type');
        }

        // Stream the file
        return new StreamedResponse(function () use ($imagePath) {
            $stream = fopen($imagePath, 'rb');
            fpassthru($stream);
            fclose($stream);
        }, 200, [
            'Content-Type' => $mimeType,
            'Content-Length' => File::size($imagePath),
            'Cache-Control' => 'public, max-age=31536000',
            'Content-Disposition' => 'inline',
        ]);
    }

    private function buildSafePath(string $baseDir, string $requestedPath): string
    {
        // Validate extension first
        $extension = strtolower(pathinfo($requestedPath, PATHINFO_EXTENSION));
        if (!in_array($extension, self::ALLOWED_EXTENSIONS)) {
            throw new NotFoundHttpException('Invalid file extension');
        }

        // Build the full path
        $fullPath = $baseDir . DIRECTORY_SEPARATOR . $requestedPath;

        // Normalize the path to resolve . and .. components
        $realPath = realpath($fullPath);

        // If realpath returns false, file doesn't exist or path is invalid
        if ($realPath === false) {
            throw new NotFoundHttpException('Invalid path');
        }

        // Ensure the resolved path is within the base directory (prevent traversal)
        if (strpos($realPath, $baseDir . DIRECTORY_SEPARATOR) !== 0) {
            throw new NotFoundHttpException('Path outside allowed directory');
        }

        return $realPath;
    }
}
