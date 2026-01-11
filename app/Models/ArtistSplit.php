<?php declare(strict_types=1);

namespace App\Models;

use App\Models\Rekordbox\Artist;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArtistSplit extends Model
{
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $connection = 'mysql';

    protected $fillable = [
        'compound_artist_id',
        'resolved_artist_id',
        'extracted_name',
        'position',
        'confidence',
        'is_verified',
    ];

    protected $casts = [
        'position' => 'integer',
        'confidence' => 'float',
        'is_verified' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function library()
    {
        return $this->belongsTo(Library::class, 'id', 'library_id');
    }

    /**
     * Get the compound artist (the one with comma-separated names)
     */
    public function compoundArtist(): BelongsTo
    {
        return $this->belongsTo(Artist::class, 'compound_artist_id', 'ID');
    }

    /**
     * Get the resolved artist (the individual artist matched)
     */
    public function resolvedArtist(): BelongsTo
    {
        return $this->belongsTo(Artist::class, 'resolved_artist_id', 'ID');
    }

    /**
     * Scope to get only verified splits
     */
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    /**
     * Scope to get only unverified splits
     */
    public function scopeUnverified($query)
    {
        return $query->where('is_verified', false);
    }

    /**
     * Scope to get high confidence splits
     */
    public function scopeHighConfidence($query, float $threshold = 0.85)
    {
        return $query->where('confidence', '>=', $threshold);
    }

    /**
     * Scope to get splits ordered by position
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('position');
    }

    /**
     * Check if this split is high confidence
     */
    public function isHighConfidence(float $threshold = 0.85): bool
    {
        return $this->confidence >= $threshold;
    }

    /**
     * Get confidence level category
     */
    public function getConfidenceLevelAttribute(): string
    {
        return match (true) {
            $this->confidence >= 0.95 => 'excellent',
            $this->confidence >= 0.85 => 'high',
            $this->confidence >= 0.7 => 'medium',
            $this->confidence >= 0.5 => 'low',
            default => 'poor',
        };
    }
}
