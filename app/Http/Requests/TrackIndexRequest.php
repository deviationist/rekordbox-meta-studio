<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrackIndexRequest extends FormRequest
{
    private const ALLOWED_SORT_FIELDS = ['title', 'artist', 'album', 'albumArtist', 'bpm', 'bitRate', 'bitDepth', 'sampleRate', 'originalArtist', 'remixer', 'year', 'releaseDate', 'composer', 'lyricist', 'genre', 'key', 'duration', 'rating', 'fileSize', 'fileType', 'fileName', 'playCount', 'dateCreated', 'color', 'comment', 'filePath'];

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'genre' => ['nullable', 'string', 'max:100'],
            'minBpm' => ['nullable', 'integer', 'min:0', 'max:300'],
            'maxBpm' => ['nullable', 'integer', 'min:0', 'max:300', 'gte:min_bpm'],
            'key' => ['nullable', 'string', 'max:10'],
            'minRating' => ['nullable', 'integer', 'min:0', 'max:5'],
            'maxRating' => ['nullable', 'integer', 'min:0', 'max:5', 'gte:min_rating'],
            'sortBy' => ['nullable', 'string', 'in:' . implode(',', self::ALLOWED_SORT_FIELDS)],
            'sortOrder' => ['nullable', 'string', 'in:asc,desc'],
        ];
    }
}
