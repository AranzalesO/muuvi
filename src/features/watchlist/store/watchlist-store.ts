import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { MovieId } from '@/src/features/movies/domain/movie';
import type { WatchlistMovie, WatchlistMovieInput, WatchlistState } from '../domain/watchlist-movie';

type WatchlistActions = {
  addMovie: (movie: WatchlistMovieInput, savedAt?: string) => void;
  removeMovie: (movieId: MovieId) => void;
};

type WatchlistStore = WatchlistState & WatchlistActions;

const initialState: WatchlistState = {
  movieIds: [],
  moviesById: {},
};

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
      removeMovie: (movieId) =>
        set((state) => {
          const { [movieId]: _removedMovie, ...moviesById } = state.moviesById;

          return {
            movieIds: state.movieIds.filter((id) => id !== movieId),
            moviesById,
          };
        }),
    }),
    {
      name: 'muuvi-watchlist',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
