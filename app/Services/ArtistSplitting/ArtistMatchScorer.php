<?php declare(strict_types=1);

namespace App\Services\ArtistSplitting;

class ArtistMatchScorer
{
    /**
     * Calculate match confidence score between two artist names (0-1)
     */
    public function calculateConfidence(string $extracted, string $candidate): float
    {
        $extracted = strtolower(trim($extracted));
        $candidate = strtolower(trim($candidate));

        // Exact match
        if ($extracted === $candidate) {
            return 1.0;
        }

        // Exact match ignoring special characters
        $extractedClean = $this->cleanForComparison($extracted);
        $candidateClean = $this->cleanForComparison($candidate);

        if ($extractedClean === $candidateClean) {
            return 0.95;
        }

        // Starts with (candidate starts with extracted)
        if (str_starts_with($candidate, $extracted)) {
            return 0.85;
        }

        // Contains
        if (str_contains($candidate, $extracted)) {
            return 0.7;
        }

        // Fuzzy match using Levenshtein distance
        return $this->calculateFuzzyScore($extracted, $candidate);
    }

    /**
     * Clean string for comparison (remove special characters)
     */
    protected function cleanForComparison(string $str): string
    {
        return preg_replace('/[^a-z0-9]/', '', strtolower($str));
    }

    /**
     * Calculate fuzzy match score using Levenshtein distance
     */
    protected function calculateFuzzyScore(string $str1, string $str2): float
    {
        $distance = levenshtein($str1, $str2);
        $maxLength = max(strlen($str1), strlen($str2));

        if ($maxLength === 0) {
            return 0.0;
        }

        $similarity = 1 - ($distance / $maxLength);

        // Only consider fuzzy matches above threshold, scaled down
        return $similarity > 0.6 ? $similarity * 0.6 : 0.0;
    }

    /**
     * Categorize confidence level
     */
    public function categorizeConfidence(float $confidence): string
    {
        return match (true) {
            $confidence >= 0.95 => 'excellent',
            $confidence >= 0.85 => 'high',
            $confidence >= 0.7 => 'medium',
            $confidence >= 0.5 => 'low',
            default => 'poor',
        };
    }
}
