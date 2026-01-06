<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLibraryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->id === $this->route('library')->user_id;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $library = $this->route('library');

        return [
            'name' => ['required', 'string', 'max:255'],
            'file_upload' => ['nullable', 'file', 'mimes:sqlite,sqlite3,db', 'max:512000'],
            'file_path' => ['nullable', 'string', 'max:1024'],
            'is_rekordbox_folder' => ['boolean'],
            'password' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $hasFile = $this->hasFile('file_upload');
            $hasPath = !empty($this->file_path);
            $library = $this->route('library');

            // If updating, allow keeping existing configuration
            $hasExistingFile = !empty($library->stored_file);
            $hasExistingPath = !empty($library->file_path);

            // Must have at least one (new or existing)
            if (!$hasFile && !$hasPath && !$hasExistingFile && !$hasExistingPath) {
                $validator->errors()->add('file_upload', 'You must either upload a database file or specify a file path.');
                $validator->errors()->add('file_path', 'You must either upload a database file or specify a file path.');
            }

            // Cannot have both new file and new path
            if ($hasFile && $hasPath) {
                $validator->errors()->add('file_upload', 'You cannot provide both an uploaded file and a file path.');
                $validator->errors()->add('file_path', 'You cannot provide both an uploaded file and a file path.');
            }

            // Validate file path exists if provided
            if ($hasPath && !file_exists($this->file_path)) {
                $validator->errors()->add('file_path', 'The specified file path does not exist.');
            }

            if ($hasPath && !is_readable($this->file_path)) {
                $validator->errors()->add('file_path', 'The specified file is not readable.');
            }
        });
    }
}
