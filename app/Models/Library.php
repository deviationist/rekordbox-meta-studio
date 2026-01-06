<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Crypt;

class Library extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
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

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($library) {
            if (empty($library->slug)) {
                $library->slug = static::generateUniqueSlug($library->name, $library->user_id);
            }
        });

        static::deleting(function ($library) {
            // Clean up stored file when library is deleted
            if ($library->stored_file && Storage::exists($library->stored_file)) {
                Storage::delete($library->stored_file);
            }
        });
    }

    /**
     * Generate a unique slug from the library name
     */
    protected static function generateUniqueSlug(string $name, int $userId): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while (static::where('user_id', $userId)->where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
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

    /**
     * Relationship: Library belongs to a user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope: Only libraries for the authenticated user
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
