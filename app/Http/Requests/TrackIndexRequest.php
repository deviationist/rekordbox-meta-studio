<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrackIndexRequest extends FormRequest
{
    private const ALLOWED_SORT_FIELDS = ['title', 'artist', 'album', 'albumArtist', 'bpm', 'bitRate', 'bitDepth', 'sampleRate', 'originalArtist', 'remixer', 'year', 'releaseDate', 'composer', 'lyricist', 'genre', 'key', 'duration', 'rating', 'fileSize', 'fileType', 'fileName', 'playCount', 'dateCreated', 'color', 'comment', 'filePath'];

    public function rules(): array
    {
        return [
            // Relations
            'artist' => ['nullable', 'array'],
            'genre' => ['nullable', 'array'],
            'label' => ['nullable', 'array'],
            'album' => ['nullable', 'array'],
            'albumArtist' => ['nullable', 'array'],
            'remixer' => ['nullable', 'array'],
            'key' => ['nullable', 'array'],
            'composer' => ['nullable', 'array'],
            'playlist' => ['nullable', 'array'],

            'search' => ['nullable', 'string', 'max:255'],
            'minBpm' => ['nullable', 'integer', 'min:0', 'max:300'],
            'maxBpm' => ['nullable', 'integer', 'min:0', 'max:300', 'gte:min_bpm'],
            'minRating' => ['nullable', 'integer', 'min:0', 'max:5'],
            'maxRating' => ['nullable', 'integer', 'min:0', 'max:5', 'gte:min_rating'],
            'sortBy' => ['nullable', 'string', 'in:' . implode(',', self::ALLOWED_SORT_FIELDS)],
            'sortOrder' => ['nullable', 'string', 'in:asc,desc'],
        ];
    }

    protected function prepareForValidation()
    {
        $commaSeparatedKeys = ['artist', 'genre', 'label', 'album', 'albumArtist', 'remixer', 'key', 'composer', 'playlist'];
        foreach ($commaSeparatedKeys as $key) {
            if ($this->has($key) && is_string($this->get($key))) {
                $this->merge([
                    $key => explode(',', $this->get($key)),
                ]);
            }
        }
    }
}
