<?php declare(strict_types=1);

namespace App\Models\Rekordbox;

use Carbon\CarbonInterval;
use App\Casts\OnOffBoolean;
use App\Enums\Rekordbox\FileType;
use App\Models\Rekordbox\Scopes\ExcludeStreamingFilesScope;
use App\Models\Traits\HasRekordboxArtwork;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Track extends BaseModel
{
    use HasRekordboxArtwork;

    protected $table = 'djmdContent';
    protected $primaryKey = 'ID';
    protected $appends = ['file_type_label'];

    protected static function booted()
    {
        static::addGlobalScope(new ExcludeStreamingFilesScope);
    }

    protected function casts(): array
    {
        return [
            'StockDate' => 'date',
            'ReleaseDate' => 'date',
            'DateCreated' => 'date',
            'FileType' => FileType::class,
            'HotCueAutoLoad' => OnOffBoolean::class,
        ];
    }

    protected function fileTypeLabel(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->FileType?->label() ?? 'Unknown',
        );
    }

    protected function lengthHuman(): Attribute
    {
        return Attribute::get(function () {
            return CarbonInterval::seconds($this->Length)
                ->cascade()
                ->format($this->Length >= 3600 ? '%H:%I:%S' : '%I:%S');
        });
    }

    public function getArtworkMeta($size = 'm')
    {
        if (!$this->hasArtwork()) {
            return false;
        }
        $library = $this->library;
        return [
            'title' => '',
            'alt' => '',
            'src' => route('library.tracks.artwork.show', ['size' => $size, 'library' => $library, 'track' => $this]),
            'src_original' => route('library.tracks.artwork.show', ['size' => $size, 'library' => $library, 'track' => $this]),
        ];
    }

    // Relationships
    public function playlists(): HasManyThrough
    {
        return $this->hasManyThrough(
            Playlist::class,
            PlaylistItem::class,
            'ContentID', // Foreign key on PlaylistItem table...
            'ID',        // Foreign key on Playlist table...
            'ID',        // Local key on Track table...
            'PlaylistID' // Local key on PlaylistItem table...
        );
    }

    /*
    public function tags(): HasManyThrough
    {
        return $this->hasManyThrough(
            Playlist::class,
            PlaylistItem::class,
            'ContentID', // Foreign key on PlaylistItem table...
            'ID',        // Foreign key on Playlist table...
            'ID',        // Local key on Track table...
            'PlaylistID' // Local key on PlaylistItem table...
        );
    }
    */

    public function label(): BelongsTo
    {
        return $this->belongsTo(Label::class, 'LabelID', 'ID');
    }

    public function key(): HasOne
    {
        return $this->hasOne(Key::class, 'ID', 'KeyID');
    }

    public function artist(): BelongsTo
    {
        return $this->belongsTo(Artist::class, 'ArtistID', 'ID');
    }

    public function originalArtist(): BelongsTo
    {
        return $this->belongsTo(Artist::class, 'OrgArtistID', 'ID');
    }

    public function remixer(): BelongsTo
    {
        return $this->belongsTo(Artist::class, 'RemixerID', 'ID');
    }

    public function composer(): BelongsTo
    {
        return $this->belongsTo(Artist::class, 'ComposerID', 'ID');
    }

    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class, 'AlbumID', 'ID');
    }

    public function genre(): BelongsTo
    {
        return $this->belongsTo(Genre::class, 'GenreID', 'ID');
    }
}
