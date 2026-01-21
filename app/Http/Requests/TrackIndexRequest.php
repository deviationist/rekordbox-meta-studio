<?php

namespace App\Http\Requests;

use App\Helpers\DurationConverter;
use App\Rules\DurationFormat;
use Illuminate\Foundation\Http\FormRequest;

class TrackIndexRequest extends FormRequest
{
    private const ALLOWED_SORT_FIELDS = ['title', 'artist', 'album', 'albumArtist', 'bpm', 'bitRate', 'bitDepth', 'sampleRate', 'originalArtist', 'remixer', 'year', 'releaseDate', 'composer', 'lyricist', 'genre', 'key', 'duration', 'rating', 'fileSize', 'fileType', 'fileName', 'playCount', 'dateCreated', 'color', 'comment', 'filePath'];

    public function rules(): array
    {
        return [
            // Relations
            'artist' => ['sometimes', 'array'],
            'genre' => ['sometimes', 'array'],
            'label' => ['sometimes', 'array'],
            'album' => ['sometimes', 'array'],
            'albumArtist' => ['sometimes', 'array'],
            'remixer' => ['sometimes', 'array'],
            'key' => ['sometimes', 'array'],
            'composer' => ['sometimes', 'array'],
            'playlist' => ['sometimes', 'array'],
            'fileType' => ['sometimes', 'array'],

            'search' => ['sometimes', 'string', 'max:255'],
            'minBpm' => ['sometimes', 'integer', 'min:0', 'max:300'],
            'maxBpm' => ['sometimes', 'integer', 'min:0', 'max:300', 'gte:minBpm'],
            'minLength' => ['sometimes', 'string', new DurationFormat],
            'maxLength' => ['sometimes', 'string', new DurationFormat],
            'minRating' => ['sometimes', 'integer', 'min:0', 'max:5'],
            'maxRating' => ['sometimes', 'integer', 'min:0', 'max:5', 'gte:minRating'],
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
        $commaSeparatedKeys = ['artist', 'genre', 'label', 'album', 'albumArtist', 'remixer', 'key', 'composer', 'playlist', 'fileType'];
        foreach ($commaSeparatedKeys as $key) {
            if ($this->has($key) && is_string($this->get($key))) {
                $this->merge([
                    $key => explode(',', $this->get($key)),
                ]);
            }
        }
    }
}
