<?php

namespace App\Models;

use App\Services\LibraryConnectionManager;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Crypt;

class Library extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'name',
        'file_path',
        'stored_file',
        'is_rekordbox_folder',
        'password',
    ];

    protected $casts = [
        'is_rekordbox_folder' => 'boolean',
    ];

    protected $hidden = [
        'password',
    ];

    /**
     * Get the default library (first by name)
     */
    public function scopeGetDefault($query)
    {
        return $query->orderBy('name', 'asc')->first();
    }

    public function configureRekordboxConnection(): void
    {
        LibraryConnectionManager::configureConnection($this);
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($library) {
            // Clean up stored file when library is deleted
            if ($library->stored_file && Storage::exists($library->stored_file)) {
                Storage::delete($library->stored_file);
            }
        });
    }

    /**
     * Get the absolute path to the SQLite database file
     */
    public function getDatabasePath(): string
    {
        if ($this->stored_file) {
            return Storage::path($this->stored_file);
        }

        if ($this->file_path) {
            return $this->file_path;
        }

        throw new \RuntimeException("Library {$this->name} has no database file configured.");
    }

    // Query scope for artwork-capable libraries
    public function scopeWithArtworkSupport($query)
    {
        return $query->where('is_rekordbox_folder', true);
    }

    // Explicit check method
    public function supportsArtwork(): bool
    {
        return $this->is_rekordbox_folder === true;
    }

    // Path builder with null safety
    public function getArtworkBasePath(): ?string
    {
        if (!$this->supportsArtwork()) {
            return null;
        }

        $libraryDir = dirname($this->file_path);
        return Arr::join([$libraryDir, 'share', 'PIONEER', 'Artwork'], DIRECTORY_SEPARATOR);
    }

    // Optional: Attribute accessor for cleaner access
    protected function artworkBasePath(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getArtworkBasePath(),
        );
    }

    /**
     * Get the decryption password (or default)
     */
    public function getDecryptionPassword(): string
    {
        if ($this->password) {
            try {
                return Crypt::decryptString($this->password);
            } catch (\Exception $e) {
                // Fallback to default if decryption fails
                return config('rekordbox.default_password');
            }
        }

        return config('rekordbox.default_password');
    }

    /**
     * Set encrypted password
     */
    public function setPasswordAttribute(?string $value): void
    {
        if ($value) {
            $this->attributes['password'] = Crypt::encryptString($value);
        } else {
            $this->attributes['password'] = null;
        }
    }

    /**
     * Check if the database file exists and is accessible
     */
    public function isDatabaseAccessible(): bool
    {
        try {
            $path = $this->getDatabasePath();
            return file_exists($path) && is_readable($path);
        } catch (\Exception $e) {
            return false;
        }
    }

    public function artistSplits(): HasMany
    {
        return $this->hasMany(ArtistSplit::class, 'id', 'library_id');
    }

    /**
     * Relationship: Library belongs to a user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
