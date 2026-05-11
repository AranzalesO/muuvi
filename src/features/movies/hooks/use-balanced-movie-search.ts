import { useQuery, useQueryClient } from '@tanstack/react-query';

import { movieRepository } from '../api';
import type { Movie, MovieDetail, MovieId } from '../domain/movie';
import {
  hasMinimumGenres,
  isEligibleForBalancedSearch,
  normalizeSearchLetter,
  startsWithLetter,
} from '../domain/balanced-search-rules';
import { movieDetailQueryKeys } from './use-movie-detail';

const CAST_REQUIREMENT = {
  men: 3,
  sampleSize: 15,
  women: 3,
};
const DETAIL_CONCURRENCY = 4;
const MAX_CANDIDATES_TO_EVALUATE = 60;
const MAX_ELIGIBLE_RESULTS = 24;
const TMDB_SEARCH_PAGE_LIMIT = 8;

type EligibilityCacheEntry =
  | {
      eligible: false;
      movie: null;
    }
  | {
      eligible: true;
      movie: Movie;
    };

const eligibilityCache = new Map<string, EligibilityCacheEntry>();

export const balancedMovieSearchQueryKeys = {
  byLetter: (letter: string) => ['movies', 'balanced-search', letter] as const,
};

const getEligibilityCacheKey = (movieId: MovieId, letter: string) =>
  `${letter}:${movieId}`;

const collectEligibleCandidates = (
  movies: Movie[],
  letter: string,
  dedupedMovies: Map<MovieId, Movie>,
) => {
  movies
    .filter((movie) => startsWithLetter(movie, letter))
    .filter((movie) => hasMinimumGenres(movie, 3))
    .forEach((movie) => {
      if (dedupedMovies.size < MAX_CANDIDATES_TO_EVALUATE) {
        dedupedMovies.set(movie.id, movie);
      }
    });
};

const runWithConcurrency = async <TInput, TOutput>(
  inputs: TInput[],
  concurrency: number,
  worker: (input: TInput) => Promise<TOutput>,
) => {
  const results: TOutput[] = [];
  let currentIndex = 0;

  async function runWorker() {
    while (currentIndex < inputs.length) {
      const input = inputs[currentIndex];
      currentIndex += 1;
      results.push(await worker(input));
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, inputs.length) }, runWorker),
  );

  return results;
};

const getSearchCandidates = async (letter: string) => {
  const firstPage = await movieRepository.searchMovies(letter, 1);
  const totalPages = Math.min(firstPage.totalPages, TMDB_SEARCH_PAGE_LIMIT);
  const dedupedMovies = new Map<MovieId, Movie>();

  collectEligibleCandidates(firstPage.results, letter, dedupedMovies);

  for (
    let page = 2;
    page <= totalPages && dedupedMovies.size < MAX_CANDIDATES_TO_EVALUATE;
    page += 1
  ) {
    const nextPage = await movieRepository.searchMovies(letter, page);
    collectEligibleCandidates(nextPage.results, letter, dedupedMovies);
  }

  return Array.from(dedupedMovies.values());
};

export function useBalancedMovieSearch(searchValue: string) {
  const queryClient = useQueryClient();
  const letter = normalizeSearchLetter(searchValue);

  return useQuery({
    enabled: Boolean(letter),
    queryFn: async () => {
      const candidates = await getSearchCandidates(letter);
      const entries = await runWithConcurrency(
        candidates,
        DETAIL_CONCURRENCY,
        async (candidate) => {
          const cacheKey = getEligibilityCacheKey(candidate.id, letter);
          const cachedEligibility = eligibilityCache.get(cacheKey);

          if (cachedEligibility) {
            return cachedEligibility;
          }

          const detail = await queryClient.fetchQuery<MovieDetail>({
            queryFn: () => movieRepository.getMovieDetail(candidate.id),
            queryKey: movieDetailQueryKeys.detail(candidate.id),
            staleTime: 1000 * 60 * 60,
          });
          const eligible = isEligibleForBalancedSearch(
            detail,
            letter,
            CAST_REQUIREMENT,
          );
          const entry: EligibilityCacheEntry = eligible
            ? {
                eligible: true,
                movie: detail.movie,
              }
            : {
                eligible: false,
                movie: null,
              };

          eligibilityCache.set(cacheKey, entry);

          return entry;
        },
      );

      return entries
        .filter((entry): entry is Extract<EligibilityCacheEntry, { eligible: true }> => entry.eligible)
        .map((entry) => entry.movie)
        .slice(0, MAX_ELIGIBLE_RESULTS);
    },
    queryKey: balancedMovieSearchQueryKeys.byLetter(letter || 'empty'),
    retry: 1,
    staleTime: 1000 * 60 * 30,
  });
}
