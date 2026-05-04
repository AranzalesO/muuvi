import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { movieRepository } from '@/src/features/movies/api';
import type { Movie, MovieId } from '@/src/features/movies/domain/movie';
import { movieDetailQueryKeys } from '@/src/features/movies/hooks/use-movie-detail';
import type { WatchlistMovieInput } from '../domain/watchlist-movie';
import { useWatchlistStore } from '../store/watchlist-store';

const DETAIL_PREFETCH_STALE_TIME = 1000 * 60 * 60;

const toWatchlistMovieInput = (movie: WatchlistMovieInput): WatchlistMovieInput => ({
  id: movie.id,
  poster: movie.poster,
  releaseDate: movie.releaseDate,
  title: movie.title,
});

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
      addMovieToStore(toWatchlistMovieInput(movie));
      void prefetchMovieDetail(movie.id).catch(() => {
        // Prefetch is opportunistic; the watchlist should still work offline with saved metadata.
      });
    },
    [addMovieToStore, prefetchMovieDetail],
  );

  const removeMovie = useCallback(
    (movieId: MovieId) => {
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
    addMovieToStore(toWatchlistMovieInput(movie));
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
