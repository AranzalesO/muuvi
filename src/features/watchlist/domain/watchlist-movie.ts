import type { Movie, MovieId } from '@/src/features/movies/domain/movie';

export type WatchlistMovie = Pick<Movie, 'id' | 'poster' | 'releaseDate' | 'title'> & {
  savedAt: string;
};

export type WatchlistMovieInput = Pick<Movie, 'id' | 'poster' | 'releaseDate' | 'title'>;

export type WatchlistState = {
  moviesById: Record<MovieId, WatchlistMovie>;
  movieIds: MovieId[];
};
