<?php declare(strict_types=1);

namespace App\Services\ArtistSplitting;

use App\Models\Rekordbox\Artist;
use Illuminate\Support\Collection;

class ArtistMatcher
{
    public function __construct(
        protected ArtistMatchScorer $scorer
    ) {}

    /**
     * Find potential matches for an extracted artist name
     */
    public function findMatches(
        string $extractedName,
        ?int $excludeId = null,
        int $limit = 5
    ): Collection {
        $query = Artist::query()
            ->where('Name', 'like', "%{$extractedName}%")
            ->where(function ($q) use ($extractedName) {
                // Prioritize better matches
                $q->orWhere('Name', '=', $extractedName)
                  ->orWhere('Name', 'like', "{$extractedName}%")
                  ->orWhere('Name', 'like', "%{$extractedName}%");
            });

        if ($excludeId) {
            $query->where('ID', '!=', $excludeId);
        }

        // Get candidates and calculate confidence scores
        return $query
            ->with(['tracks', 'albums'])
            ->get()
            ->map(function ($artist) use ($extractedName) {
                $confidence = $this->scorer->calculateConfidence(
                    $extractedName,
                    $artist->Name
                );

                return [
                    'artist' => $artist,
                    'confidence' => $confidence,
                    'confidence_level' => $this->scorer->categorizeConfidence($confidence),
                ];
            })
            ->sortByDesc('confidence')
            ->take($limit)
            ->values();
    }

    /**
     * Find the best single match above a threshold
     */
    public function findBestMatch(
        string $extractedName,
        ?int $excludeId = null,
        float $threshold = 0.85
    ): ?array {
        $matches = $this->findMatches($extractedName, $excludeId, 1);

        if ($matches->isEmpty()) {
            return null;
        }

        $bestMatch = $matches->first();

        return $bestMatch['confidence'] >= $threshold ? $bestMatch : null;
    }

    /**
     * Check if an exact match exists
     */
    public function hasExactMatch(string $name, ?int $excludeId = null): bool
    {
        $query = Artist::where('Name', '=', $name);

        if ($excludeId) {
            $query->where('ID', '!=', $excludeId);
        }

        return $query->exists();
    }
}
