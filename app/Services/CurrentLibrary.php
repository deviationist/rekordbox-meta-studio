<?php

namespace App\Services;

use App\Models\Library;
use Illuminate\Support\Facades\Auth;

class CurrentLibrary
{
    protected ?Library $library = null;

    public function get(): ?Library
    {
        if ($this->library) {
            return $this->library;
        }

        // Get user's default/last used library
        $user = Auth::user();

        if (!$user) {
            return null;
        }

        // Get default library
        if (!$this->library) {
            $this->library = $user->libraries()->getDefault()->first();
        }

        // Configure connection if library found
        if ($this->library) {
            $this->library->configureRekordboxConnection();
        }

        return $this->library;
    }

    public function set(Library $library): void
    {
        $this->library = $library;
        $library->configureRekordboxConnection();
    }
}
