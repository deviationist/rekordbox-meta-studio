<?php

namespace App\Policies;

use App\Models\Library;
use App\Models\User;

class LibraryPolicy
{
    /**
     * Determine if the user can view the library.
     */
    public function view(User $user, Library $library): bool
    {
        return $user->id === $library->user_id;
    }
    /**
     * Determine if the user can delete the library.
     */
    public function update(User $user, Library $library): bool
    {
        return $user->id === $library->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Library $library): bool
    {
        return $user->id === $library->user_id;
    }
}
