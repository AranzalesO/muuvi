import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { MovieId } from '@/src/features/movies/domain/movie';
import type { WatchlistMovie, WatchlistMovieInput, WatchlistState } from '../domain/watchlist-movie';

type WatchlistActions = {
  addMovie: (movie: WatchlistMovieInput, savedAt?: string) => void;
  clearReminderNotificationId: (movieId: MovieId) => void;
  removeMovie: (movieId: MovieId) => void;
  setReminderNotificationId: (movieId: MovieId, notificationId: string) => void;
};

type WatchlistStore = WatchlistState & WatchlistActions;

const initialState: WatchlistState = {
  movieIds: [],
  moviesById: {},
  notificationIdsByMovieId: {},
};

function migrateWatchlistState(persistedState: unknown): WatchlistState {
  if (!persistedState || typeof persistedState !== 'object') {
    return initialState;
  }

  const state = persistedState as Partial<WatchlistState>;

  return {
    movieIds: state.movieIds ?? [],
    moviesById: state.moviesById ?? {},
    notificationIdsByMovieId: state.notificationIdsByMovieId ?? {},
  };
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set) => ({
      ...initialState,
      addMovie: (movie, savedAt = new Date().toISOString()) =>
        set((state) => {
          const existingMovie = state.moviesById[movie.id];
          const nextMovie: WatchlistMovie = {
            ...movie,
            savedAt: existingMovie?.savedAt ?? savedAt,
          };

          return {
            movieIds: existingMovie ? state.movieIds : [movie.id, ...state.movieIds],
            moviesById: {
              ...state.moviesById,
              [movie.id]: nextMovie,
            },
          };
        }),
      clearReminderNotificationId: (movieId) =>
        set((state) => {
          const { [movieId]: _removedNotificationId, ...notificationIdsByMovieId } =
            state.notificationIdsByMovieId;

          return {
            notificationIdsByMovieId,
          };
        }),
      removeMovie: (movieId) =>
        set((state) => {
          const { [movieId]: _removedMovie, ...moviesById } = state.moviesById;
          const { [movieId]: _removedNotificationId, ...notificationIdsByMovieId } =
            state.notificationIdsByMovieId;

          return {
            movieIds: state.movieIds.filter((id) => id !== movieId),
            moviesById,
            notificationIdsByMovieId,
          };
        }),
      setReminderNotificationId: (movieId, notificationId) =>
        set((state) => ({
          notificationIdsByMovieId: {
            ...state.notificationIdsByMovieId,
            [movieId]: notificationId,
          },
        })),
    }),
    {
      migrate: migrateWatchlistState,
      name: 'muuvi-watchlist',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
    },
  ),
);
