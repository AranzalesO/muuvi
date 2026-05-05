import {
  hasBalancedMainCast,
  hasMinimumGenres,
  isEligibleForBalancedSearch,
  normalizeSearchLetter,
  startsWithLetter,
} from '../balanced-search-rules';
import type { CastMember, Movie, MovieDetail, MovieDetails } from '../movie';

const image = {
  path: null,
  url: null,
};

const createMovie = (overrides: Partial<Movie> = {}): Movie => ({
  backdrop: image,
  genreIds: [12, 18, 35],
  id: 1,
  originalLanguage: 'en',
  originalTitle: 'Sunrise',
  overview: 'A movie',
  popularity: 10,
  poster: image,
  releaseDate: '2026-01-01',
  title: 'Sunrise',
  voteAverage: 8,
  voteCount: 100,
  ...overrides,
});

const createDetails = (overrides: Partial<MovieDetails> = {}): MovieDetails => ({
  ...createMovie(),
  genres: [
    { id: 12, name: 'Adventure' },
    { id: 18, name: 'Drama' },
    { id: 35, name: 'Comedy' },
  ],
  homepage: null,
  imdbId: null,
  runtime: 120,
  status: 'Released',
  tagline: null,
  ...overrides,
});

const createCastMember = (id: number, tmdbGender: number): CastMember => ({
  character: `Character ${id}`,
  gender: tmdbGender === 1 ? 'female' : tmdbGender === 2 ? 'male' : 'unknown',
  id,
  name: `Person ${id}`,
  order: id,
  originalName: `Person ${id}`,
  profile: image,
  tmdbGender,
});

describe('balanced search domain rules', () => {
  it('normalizes the first search letter from whitespace, case and accents', () => {
    expect(normalizeSearchLetter('  Áction')).toBe('a');
    expect(normalizeSearchLetter('')).toBe('');
  });

  it('matches movie titles by the normalized first letter', () => {
    expect(startsWithLetter(createMovie({ title: 'Ámbar' }), 'a')).toBe(true);
    expect(startsWithLetter(createMovie({ title: 'Muuvi' }), 's')).toBe(false);
    expect(startsWithLetter(createMovie({ title: 'Muuvi' }), '')).toBe(false);
  });

  it('validates minimum genres for feed movies and detailed movies', () => {
    expect(hasMinimumGenres(createMovie({ genreIds: [1, 2, 3] }), 3)).toBe(true);
    expect(hasMinimumGenres(createMovie({ genreIds: [1, 2] }), 3)).toBe(false);
    expect(hasMinimumGenres(createDetails(), 3)).toBe(true);
    expect(hasMinimumGenres(createDetails({ genres: [{ id: 1, name: 'Drama' }] }), 3)).toBe(false);
  });

  it('checks gender balance only inside the configured main-cast sample', () => {
    const cast = [
      createCastMember(1, 1),
      createCastMember(2, 1),
      createCastMember(3, 1),
      createCastMember(4, 2),
      createCastMember(5, 2),
      createCastMember(6, 0),
      createCastMember(7, 2),
    ];

    expect(hasBalancedMainCast(cast, { men: 3, sampleSize: 7, women: 3 })).toBe(true);
    expect(hasBalancedMainCast(cast, { men: 3, sampleSize: 6, women: 3 })).toBe(false);
  });

  it('combines title, genre and cast rules for full eligibility', () => {
    const eligibleDetail: MovieDetail = {
      credits: {
        cast: [
          createCastMember(1, 1),
          createCastMember(2, 1),
          createCastMember(3, 1),
          createCastMember(4, 2),
          createCastMember(5, 2),
          createCastMember(6, 2),
        ],
        crew: [],
        movieId: 1,
      },
      movie: createDetails({ title: 'Sunrise' }),
    };

    expect(
      isEligibleForBalancedSearch(eligibleDetail, 's', { men: 3, sampleSize: 15, women: 3 }),
    ).toBe(true);
    expect(
      isEligibleForBalancedSearch(eligibleDetail, 'm', { men: 3, sampleSize: 15, women: 3 }),
    ).toBe(false);
    expect(
      isEligibleForBalancedSearch(
        {
          ...eligibleDetail,
          movie: createDetails({ genres: [{ id: 1, name: 'Drama' }], title: 'Sunrise' }),
        },
        's',
        { men: 3, sampleSize: 15, women: 3 },
      ),
    ).toBe(false);
  });
});
