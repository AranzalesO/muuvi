import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';

import { movieRepository } from '@/src/features/movies/api';
import type { MovieDetail } from '@/src/features/movies/domain/movie';
import { cancelWatchlistReminder, scheduleWatchlistReminder } from '@/src/features/notifications/services';
import { useWatchlistStore } from '../../store/watchlist-store';
import { useWatchlist } from '../use-watchlist';

jest.mock('@/src/features/movies/api', () => ({
  movieRepository: {
    getMovieDetail: jest.fn(),
  },
}));

jest.mock('@/src/features/notifications/services', () => ({
  cancelWatchlistReminder: jest.fn(() => Promise.resolve()),
  scheduleWatchlistReminder: jest.fn(() => Promise.resolve('notification-10')),
}));

const movie = {
  id: 10,
  poster: {
    path: null,
    url: null,
  },
  releaseDate: '2026-01-01',
  title: 'Sunrise',
};

const movieDetail: MovieDetail = {
  credits: {
    cast: [],
    crew: [],
    movieId: movie.id,
  },
  movie: {
    ...movie,
    backdrop: movie.poster,
    genreIds: [1, 2, 3],
    genres: [],
    homepage: null,
    imdbId: null,
    originalLanguage: 'en',
    originalTitle: movie.title,
    overview: '',
    popularity: 0,
    runtime: null,
    status: 'Released',
    tagline: null,
    voteAverage: 0,
    voteCount: 0,
  },
};

const resetWatchlistStore = () => {
  useWatchlistStore.setState({
    movieIds: [],
    moviesById: {},
    notificationIdsByMovieId: {},
  });
};

let queryClient: QueryClient;

const createWrapper = () => {
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

describe('useWatchlist', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetWatchlistStore();
    jest.mocked(movieRepository.getMovieDetail).mockResolvedValue(movieDetail);
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('adds a movie, schedules a reminder and prefetches detail', async () => {
    const { result } = renderHook(() => useWatchlist(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.addMovie(movie);
    });

    expect(result.current.isMovieSaved(movie.id)).toBe(true);
    expect(scheduleWatchlistReminder).toHaveBeenCalledWith({
      movieId: movie.id,
      movieTitle: movie.title,
    });

    await waitFor(() => {
      expect(useWatchlistStore.getState().notificationIdsByMovieId[movie.id]).toBe(
        'notification-10',
      );
    });
    await waitFor(() => {
      expect(movieRepository.getMovieDetail).toHaveBeenCalledWith(movie.id);
    });
  });

  it('removes a movie and cancels its stored reminder', () => {
    useWatchlistStore.getState().addMovie(movie);
    useWatchlistStore.getState().setReminderNotificationId(movie.id, 'notification-10');

    const { result } = renderHook(() => useWatchlist(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.removeMovie(movie.id);
    });

    expect(cancelWatchlistReminder).toHaveBeenCalledWith('notification-10');
    expect(result.current.isMovieSaved(movie.id)).toBe(false);
    expect(useWatchlistStore.getState().notificationIdsByMovieId[movie.id]).toBeUndefined();
  });
});
