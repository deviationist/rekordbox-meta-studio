import { login, logout, register, home } from './routes/index';

import dashboard from './routes/dashboard';

// Import resou rce route modules
import libraries from './routes/libraries';
import tracks from './routes/library/tracks';
import playlists from './routes/library/playlists';
import artists from './routes/library/artists';
import albums from './routes/library/albums';
import genres from './routes/library/genres';
import labels from './routes/library/labels';

// Organized routes object
export const routes = {
    // Top-level routes
    login,
    logout,
    register,
    home,
    dashboard,

    // Resource routes
    libraries,
    tracks,
    playlists,
    artists,
    albums,
    genres,
    labels,
} as const;

// Also export resource modules individually
export { libraries, tracks, playlists, artists, albums, genres, labels, login, logout, register, home, dashboard };
