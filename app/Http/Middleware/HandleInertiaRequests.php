<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Library;
use App\Services\EntityCountService;

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

    public function __construct(
        protected EntityCountService $entityCountService
    ) {}

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
        return $this->entityCountService->getCounts();
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
            'defaultLibrary' => fn () => $request->user()
                ? $request->user()->libraries()->getDefault()?->id
                : null,
            'userLibraries' => fn () => $request->user()
                ? $request->user()->libraries()->get(['id', 'name'])
                : null,
        ];
    }
}
