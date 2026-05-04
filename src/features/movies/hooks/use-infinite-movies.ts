import { useInfiniteQuery } from '@tanstack/react-query';

import { movieRepository } from '../api';

export const moviesQueryKeys = {
  all: ['movies'] as const,
  popular: () => [...moviesQueryKeys.all, 'popular'] as const,
};

export function useInfiniteMovies() {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) => movieRepository.getPopularMovies(pageParam),
    queryKey: moviesQueryKeys.popular(),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;

      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
  });
}
