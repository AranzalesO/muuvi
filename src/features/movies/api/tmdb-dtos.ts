export type TmdbGenderDto = 0 | 1 | 2 | 3;

export type TmdbGenreDto = {
  id: number;
  name: string;
};

export type TmdbPaginatedResponseDto<TResult> = {
  page: number;
  results: TResult[];
  total_pages: number;
  total_results: number;
};

export type TmdbMovieDto = {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type TmdbMovieDetailsDto = Omit<TmdbMovieDto, 'genre_ids'> & {
  belongs_to_collection: unknown | null;
  budget: number;
  genres: TmdbGenreDto[];
  homepage: string | null;
  imdb_id: string | null;
  origin_country: string[];
  production_companies: unknown[];
  production_countries: unknown[];
  revenue: number;
  runtime: number | null;
  spoken_languages: unknown[];
  status: string;
  tagline: string | null;
};

export type TmdbCastMemberDto = {
  adult: boolean;
  cast_id: number;
  character: string;
  credit_id: string;
  gender: TmdbGenderDto;
  id: number;
  known_for_department: string;
  name: string;
  order: number;
  original_name: string;
  popularity: number;
  profile_path: string | null;
};

export type TmdbCrewMemberDto = {
  adult: boolean;
  credit_id: string;
  department: string;
  gender: TmdbGenderDto;
  id: number;
  job: string;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
};

export type TmdbCreditsDto = {
  cast: TmdbCastMemberDto[];
  crew: TmdbCrewMemberDto[];
  id: number;
};
