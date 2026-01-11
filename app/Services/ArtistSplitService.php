<?php declare(strict_types=1);

namespace App\Services;

use App\Models\ArtistSplit;
use App\Models\Rekordbox\Artist;
use App\Services\ArtistSplitting\ArtistMatcher;
use App\Services\ArtistSplitting\ArtistNameExtractor;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ArtistSplitService
{
    public function __construct(
        protected ArtistNameExtractor $extractor,
        protected ArtistMatcher $matcher
    ) {}

    /**
     * Analyze a compound artist and suggest splits
     */
    public function analyzeSplits(Artist $artist): array
    {
        if (!$artist->is_compound) {
            return [
                'is_compound' => false,
                'suggestions' => []
            ];
        }

        $extractedNames = $this->extractor->extract($artist->Name);
        $suggestions = [];

        foreach ($extractedNames as $position => $extractedName) {
            $matches = $this->matcher->findMatches($extractedName, $artist->ID);

            $suggestions[] = [
                'position' => $position,
                'extracted_name' => $extractedName,
                'matches' => $matches->map(fn($match) => [
                    'id' => $match['artist']->ID,
                    'name' => $match['artist']->Name,
                    'confidence' => round($match['confidence'], 2),
                    'confidence_level' => $match['confidence_level'],
                    'track_count' => $match['artist']->tracks()->count(),
                    'album_count' => $match['artist']->albums()->count(),
                ])->toArray()
            ];
        }

        return [
            'is_compound' => true,
            'extracted_count' => count($extractedNames),
            'suggestions' => $suggestions
        ];
    }

    /**
     * Save artist splits
     */
    public function saveSplits(Artist $compoundArtist, array $splits): void
    {
        DB::connection('mysql')->transaction(function () use ($compoundArtist, $splits) {
            // Clear existing splits
            ArtistSplit::where('compound_artist_id', $compoundArtist->ID)->delete();

            // Insert new splits
            foreach ($splits as $split) {
                ArtistSplit::create([
                    'compound_artist_id' => $compoundArtist->ID,
                    'resolved_artist_id' => $split['resolved_artist_id'],
                    'extracted_name' => $split['extracted_name'],
                    'position' => $split['position'],
                    'confidence' => $split['confidence'] ?? 1.0,
                    'is_verified' => $split['is_verified'] ?? false,
                ]);
            }
        });
    }

    /**
     * Bulk analyze all compound artists
     */
    public function bulkAnalyze(int $limit = 100): Collection
    {
        return Artist::query()
            ->whereRaw("Name LIKE '%,%'")
            ->limit($limit)
            ->get()
            ->map(fn($artist) => [
                'artist' => $artist,
                'analysis' => $this->analyzeSplits($artist)
            ]);
    }

    /**
     * Auto-resolve high confidence matches
     */
    public function autoResolveHighConfidence(float $threshold = 0.95): int
    {
        $resolved = 0;

        Artist::query()
            ->whereRaw("Name LIKE '%,%'")
            ->chunk(100, function ($artists) use ($threshold, &$resolved) {
                foreach ($artists as $artist) {
                    // Skip if already resolved
                    if ($artist->hasSplits()) {
                        continue;
                    }

                    $analysis = $this->analyzeSplits($artist);

                    if (!$analysis['is_compound']) {
                        continue;
                    }

                    $splits = [];
                    $canAutoResolve = true;

                    foreach ($analysis['suggestions'] as $suggestion) {
                        $bestMatch = collect($suggestion['matches'])->first();

                        if (!$bestMatch || $bestMatch['confidence'] < $threshold) {
                            $canAutoResolve = false;
                            break;
                        }

                        $splits[] = [
                            'resolved_artist_id' => $bestMatch['id'],
                            'extracted_name' => $suggestion['extracted_name'],
                            'position' => $suggestion['position'],
                            'confidence' => $bestMatch['confidence'],
                            'is_verified' => false,
                        ];
                    }

                    if ($canAutoResolve && count($splits) > 0) {
                        $this->saveSplits($artist, $splits);
                        $resolved++;
                    }
                }
            });

        return $resolved;
    }

    /**
     * Get statistics about artist splits
     */
    public function getStatistics(): array
    {
        // Get all compound artist IDs from Rekordbox
        $compoundArtistIds = Artist::whereRaw("Name LIKE '%,%'")
            ->pluck('ID')
            ->toArray();

        $totalCompound = count($compoundArtistIds);

        if ($totalCompound === 0) {
            return [
                'total_compound' => 0,
                'resolved' => 0,
                'unresolved' => 0,
                'verified' => 0,
            ];
        }

        // Get resolved artist IDs from MySQL
        $resolvedArtistIds = ArtistSplit::whereIn('compound_artist_id', $compoundArtistIds)
            ->distinct('compound_artist_id')
            ->pluck('compound_artist_id')
            ->toArray();

        $resolved = count($resolvedArtistIds);

        // Get verified count
        $verified = ArtistSplit::whereIn('compound_artist_id', $compoundArtistIds)
            ->where('is_verified', true)
            ->distinct('compound_artist_id')
            ->count();

        return [
            'total_compound' => $totalCompound,
            'resolved' => $resolved,
            'unresolved' => $totalCompound - $resolved,
            'verified' => $verified,
        ];
    }
}
