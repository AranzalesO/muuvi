import {
  getNextReminderRequestVersion,
  shouldCancelReminderOnMovieOpen,
  shouldReplaceExistingReminder,
  shouldStoreScheduledReminder,
} from '../watchlist-reminder-rules';

describe('watchlist reminder domain rules', () => {
  it('increments request versions per movie', () => {
    const versions = new Map([[10, 2]]);

    expect(getNextReminderRequestVersion(versions, 10)).toBe(3);
    expect(getNextReminderRequestVersion(versions, 99)).toBe(1);
  });

  it('replaces only existing scheduled reminders', () => {
    expect(shouldReplaceExistingReminder('notification-1')).toBe(true);
    expect(shouldReplaceExistingReminder(null)).toBe(false);
    expect(shouldReplaceExistingReminder(undefined)).toBe(false);
  });

  it('stores a scheduled reminder only when the movie is still saved and the request is current', () => {
    expect(
      shouldStoreScheduledReminder({
        currentRequestVersion: 2,
        isMovieSaved: true,
        notificationId: 'notification-2',
        requestVersion: 2,
      }),
    ).toBe(true);
    expect(
      shouldStoreScheduledReminder({
        currentRequestVersion: 3,
        isMovieSaved: true,
        notificationId: 'notification-2',
        requestVersion: 2,
      }),
    ).toBe(false);
    expect(
      shouldStoreScheduledReminder({
        currentRequestVersion: 2,
        isMovieSaved: false,
        notificationId: 'notification-2',
        requestVersion: 2,
      }),
    ).toBe(false);
    expect(
      shouldStoreScheduledReminder({
        currentRequestVersion: 2,
        isMovieSaved: true,
        notificationId: null,
        requestVersion: 2,
      }),
    ).toBe(false);
  });

  it('cancels a reminder when a movie detail opens with a pending notification', () => {
    expect(shouldCancelReminderOnMovieOpen(20, 'notification-20')).toBe(true);
    expect(shouldCancelReminderOnMovieOpen(20, null)).toBe(false);
    expect(shouldCancelReminderOnMovieOpen(null, 'notification-20')).toBe(false);
  });
});
