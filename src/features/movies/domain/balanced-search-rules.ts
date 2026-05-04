import type { CastMember, Movie, MovieDetail, MovieDetails } from './movie';

export type BalancedCastRequirement = {
  men: number;
  sampleSize: number;
  women: number;
};

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleLowerCase();

export const normalizeSearchLetter = (value: string) =>
  normalizeText(value).charAt(0);

export const startsWithLetter = (
  movie: Pick<Movie, 'title'>,
  letter: string,
) => {
  const normalizedLetter = normalizeSearchLetter(letter);

  if (!normalizedLetter) {
    return false;
  }

  return normalizeText(movie.title).startsWith(normalizedLetter);
};

export const hasMinimumGenres = (
  movie: Pick<Movie, 'genreIds'> | Pick<MovieDetails, 'genres'>,
  minimumGenres: number,
) => {
  if ('genres' in movie) {
    return movie.genres.length >= minimumGenres;
  }

  return movie.genreIds.length >= minimumGenres;
};

export const hasBalancedMainCast = (
  cast: CastMember[],
  requirement: BalancedCastRequirement,
) => {
  const mainCast = cast.slice(0, requirement.sampleSize);
  const women = mainCast.filter((person) => person.tmdbGender === 1).length;
  const men = mainCast.filter((person) => person.tmdbGender === 2).length;

  return women >= requirement.women && men >= requirement.men;
};

export const isEligibleForBalancedSearch = (
  detail: MovieDetail,
  letter: string,
  requirement: BalancedCastRequirement,
) =>
  startsWithLetter(detail.movie, letter) &&
  hasMinimumGenres(detail.movie, 3) &&
  hasBalancedMainCast(detail.credits.cast, requirement);
