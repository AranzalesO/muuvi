import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';

import { movieRepository } from '@/src/features/movies/api';
import type { Movie, MovieId } from '@/src/features/movies/domain/movie';
import { movieDetailQueryKeys } from '@/src/features/movies/hooks/use-movie-detail';
import {
  cancelWatchlistReminder,
  scheduleWatchlistReminder,
} from '@/src/features/notifications/services';
import {
  getNextReminderRequestVersion,
  shouldCancelReminderOnMovieOpen,
  shouldReplaceExistingReminder,
  shouldStoreScheduledReminder,
} from '@/src/features/notifications/domain/watchlist-reminder-rules';
import type { WatchlistMovieInput } from '../domain/watchlist-movie';
import { useWatchlistStore } from '../store/watchlist-store';

const DETAIL_PREFETCH_STALE_TIME = 1000 * 60 * 60;
const reminderRequestVersionsByMovieId = new Map<MovieId, number>();

const toWatchlistMovieInput = (movie: WatchlistMovieInput): WatchlistMovieInput => ({
  id: movie.id,
  poster: movie.poster,
  releaseDate: movie.releaseDate,
  title: movie.title,
});

const bumpReminderRequestVersion = (movieId: MovieId) => {
  const nextVersion = getNextReminderRequestVersion(reminderRequestVersionsByMovieId, movieId);
  reminderRequestVersionsByMovieId.set(movieId, nextVersion);

  return nextVersion;
};

const scheduleReminderForMovie = (movie: WatchlistMovieInput) => {
  const requestVersion = bumpReminderRequestVersion(movie.id);
  const existingNotificationId =
    useWatchlistStore.getState().notificationIdsByMovieId[movie.id];

  if (shouldReplaceExistingReminder(existingNotificationId)) {
    useWatchlistStore.getState().clearReminderNotificationId(movie.id);
    void cancelWatchlistReminder(existingNotificationId).catch(() => {});
  }

  void scheduleWatchlistReminder({
    movieId: movie.id,
    movieTitle: movie.title,
  })
    .then((notificationId) => {
      if (!notificationId) {
        return;
      }

      const state = useWatchlistStore.getState();

      if (
        shouldStoreScheduledReminder({
          currentRequestVersion: reminderRequestVersionsByMovieId.get(movie.id),
          isMovieSaved: Boolean(state.moviesById[movie.id]),
          notificationId,
          requestVersion,
        })
      ) {
        state.setReminderNotificationId(movie.id, notificationId);
        return;
      }

      void cancelWatchlistReminder(notificationId).catch(() => {});
    })
    .catch(() => {
      if (reminderRequestVersionsByMovieId.get(movie.id) === requestVersion) {
        useWatchlistStore.getState().clearReminderNotificationId(movie.id);
      }
    });
};

const cancelStoredReminderForMovie = (movieId: MovieId) => {
  bumpReminderRequestVersion(movieId);

  const notificationId = useWatchlistStore.getState().notificationIdsByMovieId[movieId];
  useWatchlistStore.getState().clearReminderNotificationId(movieId);

  if (notificationId) {
    void cancelWatchlistReminder(notificationId).catch(() => {});
  }
};

export function useWatchlist() {
  const queryClient = useQueryClient();
  const movieIds = useWatchlistStore((state) => state.movieIds);
  const moviesById = useWatchlistStore((state) => state.moviesById);
  const addMovieToStore = useWatchlistStore((state) => state.addMovie);
  const removeMovieFromStore = useWatchlistStore((state) => state.removeMovie);

  const movies = useMemo(
    () => movieIds.map((movieId) => moviesById[movieId]).filter(Boolean),
    [movieIds, moviesById],
  );

  const prefetchMovieDetail = useCallback(
    async (movieId: MovieId) => {
      await queryClient.prefetchQuery({
        gcTime: DETAIL_PREFETCH_STALE_TIME,
        queryFn: () => movieRepository.getMovieDetail(movieId),
        queryKey: movieDetailQueryKeys.detail(movieId),
        staleTime: DETAIL_PREFETCH_STALE_TIME,
      });
    },
    [queryClient],
  );

  const addMovie = useCallback(
    (movie: WatchlistMovieInput) => {
      const watchlistMovie = toWatchlistMovieInput(movie);
      addMovieToStore(watchlistMovie);
      scheduleReminderForMovie(watchlistMovie);
      void prefetchMovieDetail(movie.id).catch(() => {
        // Prefetch is opportunistic; the watchlist should still work offline with saved metadata.
      });
    },
    [addMovieToStore, prefetchMovieDetail],
  );

  const removeMovie = useCallback(
    (movieId: MovieId) => {
      cancelStoredReminderForMovie(movieId);
      removeMovieFromStore(movieId);
    },
    [removeMovieFromStore],
  );

  const toggleMovie = useCallback(
    (movie: Movie) => {
      if (moviesById[movie.id]) {
        removeMovie(movie.id);
        return;
      }

      addMovie(movie);
    },
    [addMovie, moviesById, removeMovie],
  );

  const isMovieSaved = useCallback(
    (movieId: MovieId) => Boolean(moviesById[movieId]),
    [moviesById],
  );

  return {
    addMovie,
    isMovieSaved,
    movieIds,
    movies,
    moviesById,
    removeMovie,
    toggleMovie,
  };
}

export function useWatchlistItem(movieId: MovieId) {
  return useWatchlistStore((state) => state.moviesById[movieId]);
}

export function useWatchlistMovieControls(movie: WatchlistMovieInput) {
  const queryClient = useQueryClient();
  const savedMovie = useWatchlistItem(movie.id);
  const addMovieToStore = useWatchlistStore((state) => state.addMovie);
  const removeMovieFromStore = useWatchlistStore((state) => state.removeMovie);

  const addMovie = useCallback(() => {
    const watchlistMovie = toWatchlistMovieInput(movie);
    addMovieToStore(watchlistMovie);
    scheduleReminderForMovie(watchlistMovie);
    void queryClient
      .prefetchQuery({
        gcTime: DETAIL_PREFETCH_STALE_TIME,
        queryFn: () => movieRepository.getMovieDetail(movie.id),
        queryKey: movieDetailQueryKeys.detail(movie.id),
        staleTime: DETAIL_PREFETCH_STALE_TIME,
      })
      .catch(() => {
        // Prefetch is opportunistic; saved metadata is enough for the watchlist list.
      });
  }, [addMovieToStore, movie, queryClient]);

  const removeMovie = useCallback(() => {
    cancelStoredReminderForMovie(movie.id);
    removeMovieFromStore(movie.id);
  }, [movie.id, removeMovieFromStore]);

  const toggleMovie = useCallback(() => {
    if (savedMovie) {
      removeMovie();
      return;
    }

    addMovie();
  }, [addMovie, removeMovie, savedMovie]);

  return {
    isSaved: Boolean(savedMovie),
    savedMovie,
    toggleMovie,
  };
}

export function useCancelWatchlistReminderOnMovieOpen(movieId: MovieId | null) {
  const notificationId = useWatchlistStore((state) =>
    movieId === null ? undefined : state.notificationIdsByMovieId[movieId],
  );

  useEffect(() => {
    if (!shouldCancelReminderOnMovieOpen(movieId, notificationId)) {
      return;
    }

    cancelStoredReminderForMovie(movieId);
  }, [movieId, notificationId]);
}
