<?php

namespace App\Http\Controllers;

use App\Models\Library;
use App\Http\Requests\UpdateLibraryRequest;
use App\Http\Resources\LibraryIndexResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LibraryController extends Controller
{
    use AuthorizesRequests;

    private $defaultLibraryRoute = 'library.tracks.index';

    /**
     * Display a listing of the user's libraries.
     */
    public function index(Request $request)
    {
        $libraries = $request->user()->libraries;

        return Inertia::render('libraries/index', [
            'data' => LibraryIndexResource::collection($libraries),
        ]);
    }

    public function redirectToDefaultLibrary()
    {
        $library = Library::getDefault();
        if (!$library) {
            return abort(404);
        }
        return $this->redirectToDefaultLibraryRoute($library);

    }

    public function redirectToDefaultLibraryRoute(Library $library)
    {
        return redirect()->route($this->defaultLibraryRoute, compact('library'));
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
    public function store(Request $request)
    {
        //$data = $request->validated();
        $data = $request->toArray();

        // Handle file upload
        if ($request->hasFile('file_upload')) {
            $file = $request->file('file_upload');
            $path = $file->store(config('rekordbox.storage_path'));
            $data['stored_file'] = $path;
            $data['file_path'] = null;
            $data['is_rekordbox_folder'] = false;
        } else {
            $data['stored_file'] = null;
        }

        $request->user()->libraries()->create($data);

        return redirect()->route('libraries.index')->with('success', 'Library created successfully.');
    }

    /**
     * Show the form for editing the specified library.
     */
    public function edit(Library $library)
    {
        $this->authorize('update', $library);

        return Inertia::render('libraries/edit', [
            'library' => LibraryIndexResource::make($library)->resolve(),
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
    public function redirectToIndex()
    {
        return redirect()->route('libraries.index');
    }
}
