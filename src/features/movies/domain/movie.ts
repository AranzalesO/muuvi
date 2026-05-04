export type MovieId = number;

export type PersonGender = 'female' | 'male' | 'unknown';

export type MovieImage = {
  path: string | null;
  url: string | null;
};

export type Movie = {
  backdrop: MovieImage;
  genreIds: number[];
  id: MovieId;
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  popularity: number;
  poster: MovieImage;
  releaseDate: string | null;
  title: string;
  voteAverage: number;
  voteCount: number;
};

export type MovieGenre = {
  id: number;
  name: string;
};

export type MovieDetails = Movie & {
  genres: MovieGenre[];
  homepage: string | null;
  imdbId: string | null;
  runtime: number | null;
  status: string;
  tagline: string | null;
};

export type CastMember = {
  character: string;
  gender: PersonGender;
  id: number;
  name: string;
  order: number;
  originalName: string;
  profile: MovieImage;
  tmdbGender: number;
};

export type CrewMember = {
  department: string;
  gender: PersonGender;
  id: number;
  job: string;
  name: string;
  originalName: string;
  profile: MovieImage;
  tmdbGender: number;
};

export type MovieCredits = {
  cast: CastMember[];
  crew: CrewMember[];
  movieId: MovieId;
};

export type PaginatedMovies = {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
};
