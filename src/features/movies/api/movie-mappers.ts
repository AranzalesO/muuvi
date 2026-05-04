import type {
  CastMember,
  CrewMember,
  Movie,
  MovieCredits,
  MovieDetail,
  MovieDetails,
  MovieImage,
  PaginatedMovies,
  PersonGender,
} from '../domain/movie';
import type {
  TmdbCastMemberDto,
  TmdbCreditsDto,
  TmdbCrewMemberDto,
  TmdbGenderDto,
  TmdbMovieDetailsDto,
  TmdbMovieDto,
  TmdbPaginatedResponseDto,
} from './tmdb-dtos';

const DEFAULT_TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p';
const POSTER_SIZE = 'w500';
const BACKDROP_SIZE = 'w780';
const PROFILE_SIZE = 'w185';

const getImageBaseUrl = () =>
  process.env.EXPO_PUBLIC_TMDB_IMAGE_URL ?? DEFAULT_TMDB_IMAGE_URL;

const mapImage = (path: string | null, size: string): MovieImage => ({
  path,
  url: path ? `${getImageBaseUrl()}/${size}${path}` : null,
});

const mapGender = (gender: TmdbGenderDto): PersonGender => {
  if (gender === 1) {
    return 'female';
  }

  if (gender === 2) {
    return 'male';
  }

  return 'unknown';
};

export const mapTmdbMovieToMovie = (movie: TmdbMovieDto): Movie => ({
  backdrop: mapImage(movie.backdrop_path, BACKDROP_SIZE),
  genreIds: movie.genre_ids,
  id: movie.id,
  originalLanguage: movie.original_language,
  originalTitle: movie.original_title,
  overview: movie.overview,
  popularity: movie.popularity,
  poster: mapImage(movie.poster_path, POSTER_SIZE),
  releaseDate: movie.release_date || null,
  title: movie.title,
  voteAverage: movie.vote_average,
  voteCount: movie.vote_count,
});

export const mapTmdbMovieDetailsToMovieDetails = (
  movie: TmdbMovieDetailsDto,
): MovieDetails => ({
  backdrop: mapImage(movie.backdrop_path, BACKDROP_SIZE),
  genreIds: movie.genres.map((genre) => genre.id),
  genres: movie.genres.map((genre) => ({
    id: genre.id,
    name: genre.name,
  })),
  homepage: movie.homepage,
  id: movie.id,
  imdbId: movie.imdb_id,
  originalLanguage: movie.original_language,
  originalTitle: movie.original_title,
  overview: movie.overview,
  popularity: movie.popularity,
  poster: mapImage(movie.poster_path, POSTER_SIZE),
  releaseDate: movie.release_date || null,
  runtime: movie.runtime,
  status: movie.status,
  tagline: movie.tagline,
  title: movie.title,
  voteAverage: movie.vote_average,
  voteCount: movie.vote_count,
});

export const mapTmdbPaginatedMoviesToPaginatedMovies = (
  response: TmdbPaginatedResponseDto<TmdbMovieDto>,
): PaginatedMovies => ({
  page: response.page,
  results: response.results.map(mapTmdbMovieToMovie),
  totalPages: response.total_pages,
  totalResults: response.total_results,
});

const mapTmdbCastMemberToCastMember = (
  castMember: TmdbCastMemberDto,
): CastMember => ({
  character: castMember.character,
  gender: mapGender(castMember.gender),
  id: castMember.id,
  name: castMember.name,
  order: castMember.order,
  originalName: castMember.original_name,
  profile: mapImage(castMember.profile_path, PROFILE_SIZE),
  tmdbGender: castMember.gender,
});

const mapTmdbCrewMemberToCrewMember = (
  crewMember: TmdbCrewMemberDto,
): CrewMember => ({
  department: crewMember.department,
  gender: mapGender(crewMember.gender),
  id: crewMember.id,
  job: crewMember.job,
  name: crewMember.name,
  originalName: crewMember.original_name,
  profile: mapImage(crewMember.profile_path, PROFILE_SIZE),
  tmdbGender: crewMember.gender,
});

export const mapTmdbCreditsToMovieCredits = (
  credits: TmdbCreditsDto,
): MovieCredits => ({
  cast: credits.cast.map(mapTmdbCastMemberToCastMember),
  crew: credits.crew.map(mapTmdbCrewMemberToCrewMember),
  movieId: credits.id,
});

export const mapTmdbMovieDetailsWithCreditsToMovieDetail = (
  movie: TmdbMovieDetailsDto,
): MovieDetail => ({
  credits: movie.credits
    ? mapTmdbCreditsToMovieCredits(movie.credits)
    : {
        cast: [],
        crew: [],
        movieId: movie.id,
      },
  movie: mapTmdbMovieDetailsToMovieDetails(movie),
});
