import { useQuery } from '@tanstack/react-query';

import { movieRepository } from '../api';
import type { MovieId } from '../domain/movie';

export const movieDetailQueryKeys = {
  detail: (movieId: MovieId) => ['movies', 'detail', movieId] as const,
};

export function useMovieDetail(movieId: MovieId | null) {
  return useQuery({
    enabled: movieId !== null,
    queryFn: () => {
      if (movieId === null) {
        throw new Error('Movie id is required.');
      }

      return movieRepository.getMovieDetail(movieId);
    },
    queryKey:
      movieId === null
        ? ['movies', 'detail', 'missing']
        : movieDetailQueryKeys.detail(movieId),
  });
}
