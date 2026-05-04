import { tmdbClient } from '@/src/shared/api/tmdb-client';

import type { MovieCredits, MovieDetails, MovieId, PaginatedMovies } from '../domain/movie';
import {
  mapTmdbCreditsToMovieCredits,
  mapTmdbMovieDetailsToMovieDetails,
  mapTmdbPaginatedMoviesToPaginatedMovies,
} from './movie-mappers';
import type {
  TmdbCreditsDto,
  TmdbMovieDetailsDto,
  TmdbMovieDto,
  TmdbPaginatedResponseDto,
} from './tmdb-dtos';

export type MovieRepository = {
  getMovieCredits(movieId: MovieId): Promise<MovieCredits>;
  getMovieDetails(movieId: MovieId): Promise<MovieDetails>;
  getPopularMovies(page?: number): Promise<PaginatedMovies>;
  searchMovies(query: string, page?: number): Promise<PaginatedMovies>;
};

export const movieRepository: MovieRepository = {
  async getPopularMovies(page = 1) {
    const response = await tmdbClient.get<TmdbPaginatedResponseDto<TmdbMovieDto>>(
      '/movie/popular',
      { page },
    );

    return mapTmdbPaginatedMoviesToPaginatedMovies(response);
  },

  async getMovieDetails(movieId) {
    const response = await tmdbClient.get<TmdbMovieDetailsDto>(
      `/movie/${movieId}`,
    );

    return mapTmdbMovieDetailsToMovieDetails(response);
  },

  async getMovieCredits(movieId) {
    const response = await tmdbClient.get<TmdbCreditsDto>(
      `/movie/${movieId}/credits`,
    );

    return mapTmdbCreditsToMovieCredits(response);
  },

  async searchMovies(query, page = 1) {
    const response = await tmdbClient.get<TmdbPaginatedResponseDto<TmdbMovieDto>>(
      '/search/movie',
      {
        page,
        query: query.trim(),
      },
    );

    return mapTmdbPaginatedMoviesToPaginatedMovies(response);
  },
};
