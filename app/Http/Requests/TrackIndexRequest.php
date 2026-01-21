<?php

namespace App\Http\Requests;

use App\Helpers\DurationConverter;
use App\Rules\BooleanString;
use App\Rules\DurationFormat;
use Illuminate\Foundation\Http\FormRequest;

class TrackIndexRequest extends FormRequest
{
    private const ALLOWED_SORT_FIELDS = ['title', 'artist', 'album', 'albumArtist', 'bpm', 'bitRate', 'bitDepth', 'sampleRate', 'originalArtist', 'remixer', 'releaseYear', 'releaseDate', 'composer', 'lyricist', 'genre', 'key', 'duration', 'rating', 'fileSize', 'fileType', 'fileName', 'playCount', 'dateCreated', 'color', 'comment', 'filePath'];

    public function rules(): array
    {
        return [
            // Relations
            'artist' => ['sometimes', 'array'],
            'genre' => ['sometimes', 'array'],
            'label' => ['sometimes', 'array'],
            'album' => ['sometimes', 'array'],
            'albumArtist' => ['sometimes', 'array'],
            'originalArtist' => ['sometimes', 'array'],
            'remixer' => ['sometimes', 'array'],
            'key' => ['sometimes', 'array'],
            'composer' => ['sometimes', 'array'],
            'playlist' => ['sometimes', 'array'],
            'tag' => ['sometimes', 'array'],
            'fileType' => ['sometimes', 'array'],

            'hasArtwork' => ['nullable', new BooleanString],
            'minReleaseYear' => ['nullable', 'integer', 'min:0'],
            'maxReleaseYear' => ['nullable', 'integer', 'min:0'],
            'search' => ['sometimes', 'string', 'max:255'],
            'minBpm' => ['nullable', 'integer', 'min:0'],
            'maxBpm' => ['nullable', 'integer', 'min:0'],
            'minFileSize' => ['nullable', 'integer', 'min:0'],
            'maxFileSize' => ['nullable', 'integer', 'min:0'],
            'minPlayCount' => ['nullable', 'integer', 'min:0'],
            'maxPlayCount' => ['nullable', 'integer', 'min:0'],
            'minLength' => ['sometimes', 'string', new DurationFormat],
            'maxLength' => ['sometimes', 'string', new DurationFormat],
            'minRating' => ['nullable', 'integer', 'min:0', 'max:5'],
            'maxRating' => ['nullable', 'integer', 'min:0', 'max:5'],
            'sortBy' => ['sometimes', 'string', 'in:' . implode(',', self::ALLOWED_SORT_FIELDS)],
            'sortOrder' => ['sometimes', 'string', 'in:asc,desc'],
        ];
    }

    public function getMinRating(): ?int
    {
        return $this->filled('minRating')
            ? $this->input('minRating')
            : null;
    }

    public function getMaxRating(): ?int
    {
        return $this->filled('maxRating')
            ? $this->input('maxRating')
            : null;
    }

    public function getMinFileSize(): ?int
    {
        return $this->filled('minFileSize')
            ? intval($this->input('minFileSize')) * 1024 * 1024
            : null;
    }

    public function getMaxFileSize(): ?int
    {
        return $this->filled('maxFileSize')
            ? intval($this->input('maxFileSize')) * 1024 * 1024
            : null;
    }

    public function getMinBpm(): ?int
    {
        return $this->filled('minBpm')
            ? $this->input('minBpm') * 100
            : null;
    }

    public function getMaxBpm(): ?int
    {
        return $this->filled('maxBpm')
            ? $this->input('maxBpm') * 100
            : null;
    }

    public function getMinLengthInSeconds(): ?int
    {
        return $this->filled('minLength')
            ? DurationConverter::toSeconds($this->input('minLength'))
            : null;
    }

    public function getMaxLengthInSeconds(): ?int
    {
        return $this->filled('maxLength')
            ? DurationConverter::toSeconds($this->input('maxLength'))
            : null;
    }

    protected function prepareForValidation()
    {
        $commaSeparatedKeys = ['artist', 'genre', 'label', 'album', 'albumArtist', 'remixer', 'key', 'composer', 'playlist', 'tag', 'fileType'];
        foreach ($commaSeparatedKeys as $key) {
            if ($this->has($key) && is_string($this->get($key))) {
                $this->merge([
                    $key => explode(',', $this->get($key)),
                ]);
            }
        }
    }
}
