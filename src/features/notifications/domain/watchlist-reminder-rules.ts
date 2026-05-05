import type { MovieId } from '@/src/features/movies/domain/movie';

export type ReminderRequestVersions = Map<MovieId, number>;

type ShouldStoreScheduledReminderParams = {
  currentRequestVersion: number | undefined;
  isMovieSaved: boolean;
  notificationId: string | null;
  requestVersion: number;
};

export const getNextReminderRequestVersion = (
  versions: ReminderRequestVersions,
  movieId: MovieId,
) => (versions.get(movieId) ?? 0) + 1;

export const shouldReplaceExistingReminder = (notificationId: string | null | undefined) =>
  Boolean(notificationId);

export const shouldStoreScheduledReminder = ({
  currentRequestVersion,
  isMovieSaved,
  notificationId,
  requestVersion,
}: ShouldStoreScheduledReminderParams) =>
  Boolean(notificationId) && isMovieSaved && currentRequestVersion === requestVersion;

export const shouldCancelReminderOnMovieOpen = (
  movieId: MovieId | null,
  notificationId: string | null | undefined,
): movieId is MovieId => movieId !== null && Boolean(notificationId);
