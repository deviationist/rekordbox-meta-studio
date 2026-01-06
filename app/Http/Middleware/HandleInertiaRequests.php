<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function entityCount()
    {
        return [
            'tracks' => \App\Models\Rekordbox\Track::count(),
            'playlists' => \App\Models\Rekordbox\Playlist::count(),
            'artists' => \App\Models\Rekordbox\Artist::count(),
            'albums' => \App\Models\Rekordbox\Album::count(),
            'genres' => \App\Models\Rekordbox\Genre::count(),
            'labels' => \App\Models\Rekordbox\Label::count(),
        ];
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'entityCount' => function () use ($request) {
                // Only compute if we have a current library (meaning LoadLibrary ran)
                $currentLibrary = $request->get('currentLibrary');

                if (!$currentLibrary) {
                    return null;
                }

                try {
                    return $this->entityCount();
                } catch (\Exception $e) {
                    // If connection fails, return null instead of breaking the page
                    return null;
                }
            },
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'currentLibrary' => fn () => $request->get('currentLibrary'),
            'userLibraries' => fn () => $request->user()
                ? \App\Models\Library::forUser($request->user()->id)->get(['id', 'name', 'slug'])
                : null,
        ];
    }
}
