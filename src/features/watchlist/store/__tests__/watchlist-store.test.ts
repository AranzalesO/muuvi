import { useWatchlistStore } from '../watchlist-store';

const resetWatchlistStore = () => {
  useWatchlistStore.setState({
    movieIds: [],
    moviesById: {},
    notificationIdsByMovieId: {},
  });
};

const movie = {
  id: 10,
  poster: {
    path: null,
    url: null,
  },
  releaseDate: '2026-01-01',
  title: 'Sunrise',
};

describe('watchlist store', () => {
  beforeEach(() => {
    resetWatchlistStore();
  });

  it('adds movies to the front and keeps minimal offline metadata', () => {
    useWatchlistStore.getState().addMovie(movie, '2026-05-05T10:00:00.000Z');
    useWatchlistStore.getState().addMovie({ ...movie, id: 11, title: 'Moonrise' });

    expect(useWatchlistStore.getState().movieIds).toEqual([11, 10]);
    expect(useWatchlistStore.getState().moviesById[10]).toEqual({
      ...movie,
      savedAt: '2026-05-05T10:00:00.000Z',
    });
  });

  it('deduplicates movies and preserves the first saved date', () => {
    useWatchlistStore.getState().addMovie(movie, '2026-05-05T10:00:00.000Z');
    useWatchlistStore.getState().addMovie(
      { ...movie, title: 'Updated Sunrise' },
      '2026-05-05T10:05:00.000Z',
    );

    expect(useWatchlistStore.getState().movieIds).toEqual([10]);
    expect(useWatchlistStore.getState().moviesById[10]).toMatchObject({
      savedAt: '2026-05-05T10:00:00.000Z',
      title: 'Updated Sunrise',
    });
  });

  it('stores and clears reminder notification ids with movie removal', () => {
    useWatchlistStore.getState().addMovie(movie);
    useWatchlistStore.getState().setReminderNotificationId(movie.id, 'notification-10');

    expect(useWatchlistStore.getState().notificationIdsByMovieId[10]).toBe('notification-10');

    useWatchlistStore.getState().removeMovie(movie.id);

    expect(useWatchlistStore.getState().movieIds).toEqual([]);
    expect(useWatchlistStore.getState().moviesById[10]).toBeUndefined();
    expect(useWatchlistStore.getState().notificationIdsByMovieId[10]).toBeUndefined();
  });
});
