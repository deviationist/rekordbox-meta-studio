<?php

namespace App\Http\Controllers\Rekordbox;

use App\Enums\Rekordbox\FileType;
use App\Http\Controllers\Traits\HasArtwork;
use App\Http\Controllers\Traits\ResolvesFilters;
use App\Http\Requests\TrackIndexRequest;
use App\Http\Resources\FilterItem;
use App\Http\Resources\Rekordbox\TrackIndexResource;
use App\Models\Rekordbox\Key;
use App\Models\Rekordbox\Playlist;
use App\Models\Rekordbox\PlaylistItem;
use App\Models\Rekordbox\Tag;
use App\Models\Rekordbox\TagItem;
use App\Models\Rekordbox\Track;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Response;

class TrackListController extends BaseController
{
    use HasArtwork, ResolvesFilters;
    private $filterOptions;

    public function __invoke(TrackIndexRequest $request): Response
    {
        $this->filterOptions = $this->filterOptions($request);
        $query = Track::query()
            ->with($this->resolveRelations($request));

        $this->applySorting($query, $request);
        $this->applyModelFilters($query, $request);
        $this->applyFilters($query, $request);

        $tracks = $query->paginate(self::DEFAULT_PER_PAGE);

        return inertia('tracks/index', [
            'data' => TrackIndexResource::collection($tracks),
            'filters' => $this->activeFiltersFromRequest($request),
            'filterOptions' => $this->filterOptions,
        ]);
    }

    private function resolveRelations(TrackIndexRequest $request)
    {
        $relations = [
            'artist',
            'album',
            'genre',
            'label',
            'remixer',
            'originalArtist',
            'key',
            'composer'
        ];
        return $relations;
    }

    private function filterOptions()
    {
        return [
            'keys' => FilterItem::collection(Key::query()
                ->orderBy('Name')
                ->get(['ID', Key::$filterLabelKey]))->resolve(),
            'playlists' => FilterItem::collection(Playlist::query()
                ->orderBy('Name')
                ->get(['ID', Playlist::$filterLabelKey]))->resolve(),
            'tags' => FilterItem::collection(Tag::query()
                ->orderBy('Name')
                ->get(['ID', Tag::$filterLabelKey]))->resolve(),
            'fileTypes' => Track::groupBy('FileType')->select('FileType', DB::raw('count(*) as FileTypeCount'))->get()->map(function ($fileType) {
                return [
                    'id' => $fileType['file_type_label'],
                    'name' => "{$fileType['file_type_label']} ({$fileType['FileTypeCount']})"
                ];
            }),
        ];
    }

    private function mappedSortKey(TrackIndexRequest $request): string
    {
        switch ($request->get('sortBy')) {
            case 'duration':
                return 'Length';
            case 'playCount':
                return 'DJPlayCount';
            default:
                return Str::studly($request->get('sortBy'));
        }
    }

    private function applySorting(Builder $query, TrackIndexRequest $request): void
    {
        if ($request->filled('sortBy') && $key = $this->mappedSortKey($request)) {
            $query->orderBy($key, $request->get('sortOrder', 'asc'));
        }
    }

    private function applyModelFilters(Builder $query, TrackIndexRequest $request): void
    {
        if ($request->filled('artist')) {
            $query->whereIn('ArtistID', $request->get('artist'));
        }

        if ($request->filled('albumArtist')) {
            $query->whereHas('album', function (Builder $query) use($request) {
                $query->whereIn('ArtistID', $request->get('albumArtist'));
            });
        }

        if ($request->filled('album')) {
            $query->whereIn('AlbumID', $request->get('album'));
        }

        if ($request->filled('genre')) {
            $query->whereIn('GenreID', $request->get('genre'));
        }

        if ($request->filled('label')) {
            $query->whereIn('LabelID', $request->get('label'));
        }

        if ($request->filled('remixer')) {
            $query->whereIn('RemixerID', $request->get('remixer'));
        }

        if ($request->filled('originalArtist')) {
            $query->whereIn('OrgArtistID', $request->get('originalArtist'));
        }

        if ($request->filled('key')) {
            $query->whereHas('key', function (Builder $query) use($request) {
                $query->whereIn('ScaleName', $request->get('key'));
            });
        }

        if ($request->filled('composer')) {
            $query->whereIn('ComposerID', $request->get('composer'));
        }

        if ($request->filled('playlist')) {
            $query->whereIn('ID', PlaylistItem::query()->whereIn('PlaylistID', $request->get('playlist'))->pluck('ContentID'));
        }

        if ($request->filled('tag')) {
            $query->whereIn('ID', TagItem::query()->whereIn('MyTagID', $request->get('tag'))->pluck('ContentID'));
        }
    }

    private function applyFilters(Builder $query, TrackIndexRequest $request): void
    {
        if ($request->boolean('hasArtwork')) {
            $query->whereNotNull('ImagePath')
                ->whereNot('ImagePath', '');
        }

        if ($request->filled('fileType')) {
            $fileTypes = collect($request->get('fileType'))->map(function ($fileType) {
                return FileType::tryFromName($fileType)->value;
            })->toArray();
            $query->whereIn('FileType', $fileTypes);
        }

        // Search filter
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function (Builder $q) use ($search) {
                $q->where('Title', 'like', "%{$search}%")
                    ->orWhereHas('artist', fn(Builder $artistQuery) =>
                        $artistQuery->where('Name', 'like', "%{$search}%")
                    )
                    ->orWhereHas('album', fn(Builder $albumQuery) =>
                        $albumQuery->where('Name', 'like', "%{$search}%")
                    );
            });
        }

        // Release year filters
        if ($request->filled('minReleaseYear') && $request->filled('maxReleaseYear')) {
            $query->whereBetween('ReleaseYear', [$request->get('minReleaseYear'), $request->get('maxReleaseYear')]);
        } else if ($request->filled('minReleaseYear')) {
            $query->where('ReleaseYear', '>=', $request->get('minReleaseYear'));
        } else if ($request->filled('maxReleaseYear')) {
            $query->where('ReleaseYear', '<=', $request->get('maxReleaseYear'));
        }

        // Duration filters
        if ($request->filled('minLength') && $request->filled('maxLength')) {
            $query->whereBetween('Length', [$request->getMinLengthInSeconds(), $request->getMaxLengthInSeconds()]);
        } else if ($request->filled('minLength')) {
            $query->where('Length', '>=', $request->getMinLengthInSeconds());
        } else if ($request->filled('maxLength')) {
            $query->where('Length', '<=', $request->getMaxLengthInSeconds());
        }

        // Play count filters
        if ($request->filled('minPlayCount') && $request->filled('maxPlayCount')) {
            $query->whereBetween('DJPlayCount', [$request->get('minPlayCount'), $request->get('maxPlayCount')]);
        } else if ($request->filled('minPlayCount')) {
            $query->where('DJPlayCount', '>=', $request->get('minPlayCount'));
        } else if ($request->filled('maxPlayCount')) {
            $query->where('DJPlayCount', '<=', $request->get('maxPlayCount'));
        }

        // File size range filters
        if ($request->filled('minFileSize') && $request->filled('maxFileSize')) {
            $query->whereBetween('FileSize', [$request->getMinFileSize(), $request->getMaxFileSize()]);
        } else if ($request->filled('minFileSize')) {
            $query->where('FileSize', '>=', $request->getMinFileSize());
        } else if ($request->filled('maxFileSize')) {
            $query->where('FileSize', '<=', $request->getMaxFileSize());
        }

        // BPM range filters
        if ($request->filled('minBpm') && $request->filled('maxBpm')) {
            $query->whereBetween('BPM', [$request->getMinBpm(), $request->getMaxBpm()]);
        } else if ($request->filled('minBpm')) {
            $query->where('BPM', '>=', $request->getMinBpm());
        } else if ($request->filled('maxBpm')) {
            $query->where('BPM', '<=', $request->getMaxBpm());
        }

        // Rating filters
        if ($request->filled('minRating') && $request->filled('maxRating')) {
            $query->whereBetween('Rating', [$request->getMinRating(), $request->getMaxRating()]);
        } else if ($request->filled('minRating')) {
            $query->where('Rating', '>=', $request->getMinRating());
        } else if ($request->filled('maxRating')) {
            $query->where('Rating', '<=', $request->getMaxRating());
        }
    }
}
