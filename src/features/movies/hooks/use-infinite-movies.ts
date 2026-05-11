import { useInfiniteQuery } from '@tanstack/react-query';

import { movieRepository } from '../api';

export const moviesQueryKeys = {
  all: ['movies'] as const,
  popular: () => [...moviesQueryKeys.all, 'popular'] as const,
};

export function useInfiniteMovies() {
  return useInfiniteQuery({
    gcTime: 1000 * 60 * 60,
    queryFn: ({ pageParam }) => movieRepository.getPopularMovies(pageParam),
    queryKey: moviesQueryKeys.popular(),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;

      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000),
    staleTime: 1000 * 60 * 5,
  });
}
