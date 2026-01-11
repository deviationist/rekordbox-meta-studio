<?php declare(strict_types=1);

namespace App\Models\Traits;

use App\Models\ArtistSplit;
use Illuminate\Support\Collection;

trait HasArtistSplitting
{
    /**
     * Get split artists (manual query since cross-database)
     */
    public function getSplitArtistsAttribute(): Collection
    {
        $splits = ArtistSplit::where('compound_artist_id', $this->ID)
            ->orderBy('position')
            ->get();

        // Hydrate with artist objects
        $artistIds = $splits->pluck('resolved_artist_id')->unique();
        $artists = static::whereIn('ID', $artistIds)->get()->keyBy('ID');

        return $splits->map(function ($split) use ($artists) {
            $split->artist = $artists->get($split->resolved_artist_id);
            return $split;
        });
    }

    /**
     * Get compound artists this artist is part of (manual query)
     */
    public function getCompoundArtistsAttribute(): Collection
    {
        $splits = ArtistSplit::where('resolved_artist_id', $this->ID)->get();

        // Hydrate with artist objects
        $artistIds = $splits->pluck('compound_artist_id')->unique();
        $artists = static::whereIn('ID', $artistIds)->get()->keyBy('ID');

        return $splits->map(function ($split) use ($artists) {
            $split->artist = $artists->get($split->compound_artist_id);
            return $split;
        });
    }

    /**
     * Check if this artist has a compound name
     */
    public function getIsCompoundAttribute(): bool
    {
        return str_contains($this->Name ?? '', ',');
    }

    /**
     * Get count of split artists
     */
    public function getSplitCountAttribute(): int
    {
        if (!$this->is_compound) {
            return 0;
        }

        return ArtistSplit::where('compound_artist_id', $this->ID)->count();
    }

    /**
     * Check if splits have been resolved
     */
    public function getHasResolvedSplitsAttribute(): bool
    {
        return $this->is_compound && $this->split_count > 0;
    }

    /**
     * Check if this artist has splits (for queries)
     */
    public function hasSplits(): bool
    {
        return ArtistSplit::where('compound_artist_id', $this->ID)->exists();
    }
}
