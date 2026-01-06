<?php

namespace App\Http\Controllers;

use App\Models\Library;
use App\Http\Requests\StoreLibraryRequest;
use App\Http\Requests\UpdateLibraryRequest;
use App\Http\Resources\LibraryResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LibraryController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the user's libraries.
     */
    public function index()
    {
        $libraries = Library::forUser(Auth::id())->get();

        return Inertia::render('libraries/index', [
            'libraries' => LibraryResource::collection($libraries),
        ]);
    }

    /**
     * Show the form for creating a new library.
     */
    public function create()
    {
        return Inertia::render('libraries/create');
    }

    /**
     * Store a newly created library.
     */
    public function store(StoreLibraryRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = Auth::id();

        // Handle file upload
        if ($request->hasFile('file_upload')) {
            $file = $request->file('file_upload');
            $path = $file->store(config('rekordbox.storage_path'));
            $data['stored_file'] = $path;
            $data['file_path'] = null;

            // File uploads don't have rekordbox folder access
            $data['is_rekordbox_folder'] = false;
        } else {
            $data['stored_file'] = null;
        }

        Library::create($data);

        return redirect()->route('libraries.index')->with('success', 'Library created successfully.');
    }

    /**
     * Show the form for editing the specified library.
     */
    public function edit(Library $library)
    {
        //$this->authorize('update', $library);

        return Inertia::render('libraries/edit', [
            'library' => LibraryResource::make($library)->resolve(),
        ]);
    }

    /**
     * Update the specified library.
     */
    public function update(UpdateLibraryRequest $request, Library $library)
    {
        $this->authorize('update', $library);

        $data = $request->validated();

        // Handle file upload (replace existing)
        if ($request->hasFile('file_upload')) {
            // Delete old file if exists
            if ($library->stored_file && Storage::exists($library->stored_file)) {
                Storage::delete($library->stored_file);
            }

            $file = $request->file('file_upload');
            $path = $file->store(config('rekordbox.storage_path'));
            $data['stored_file'] = $path;
            $data['file_path'] = null;
            $data['is_rekordbox_folder'] = false;
        } elseif (!empty($data['file_path'])) {
            // Switch to path - delete uploaded file if exists
            if ($library->stored_file && Storage::exists($library->stored_file)) {
                Storage::delete($library->stored_file);
            }
            $data['stored_file'] = null;
        }

        $library->update($data);

        return redirect()->route('libraries.index')->with('success', 'Library updated successfully.');
    }

    /**
     * Remove the specified library.
     */
    public function destroy(Library $library)
    {
        $this->authorize('delete', $library);

        $library->delete();

        return redirect()->route('libraries.index')->with('success', 'Library deleted successfully.');
    }

    /**
     * Show library selector page
     */
    public function select()
    {
        $libraries = Library::forUser(Auth::id())->get();

        if ($libraries->count() === 1) {
            return redirect()->route('library.tracks', ['library' => $libraries->first()]);
        }

        return Inertia::render('libraries/select', [
            'libraries' => LibraryResource::collection($libraries),
        ]);
    }
}
