import cancelScheduledNotificationAsync from 'expo-notifications/build/cancelScheduledNotificationAsync';
import getAllScheduledNotificationsAsync from 'expo-notifications/build/getAllScheduledNotificationsAsync';
import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
import { getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import scheduleNotificationAsync from 'expo-notifications/build/scheduleNotificationAsync';
import setNotificationChannelAsync from 'expo-notifications/build/setNotificationChannelAsync';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import {
  AndroidNotificationPriority,
  SchedulableTriggerInputTypes,
  type NotificationResponse,
} from 'expo-notifications/build/Notifications.types';
import { Platform } from 'react-native';

import type { MovieId } from '@/src/features/movies/domain/movie';

const watchlistReminderChannelId = 'muuvi-watchlist-reminders';
const watchlistReminderDelaySeconds = 3 * 60;

type ScheduleWatchlistReminderParams = {
  movieId: MovieId;
  movieTitle: string;
};

export function configureWatchlistReminderPresentation() {
  setNotificationHandler({
    handleNotification: async () => ({
      priority: AndroidNotificationPriority.DEFAULT,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function scheduleWatchlistReminder({
  movieId,
  movieTitle,
}: ScheduleWatchlistReminderParams) {
  const hasPermission = await ensureWatchlistReminderPermissions();

  if (!hasPermission) {
    if (__DEV__) {
      console.warn('[Muuvi reminders] Notification permission was not granted.');
    }

    return null;
  }

  const notificationId = await scheduleNotificationAsync({
    content: {
      body: `¿Listo para ver ${movieTitle}?`,
      color: '#4F7942',
      data: {
        movieId,
        route: 'movie-detail',
      },
      priority: AndroidNotificationPriority.DEFAULT,
      sound: false,
      title: 'Muuvi',
    },
    trigger: {
      channelId: watchlistReminderChannelId,
      repeats: false,
      seconds: watchlistReminderDelaySeconds,
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
    },
  });

  if (__DEV__) {
    const scheduledNotifications = await getAllScheduledNotificationsAsync();

    console.info(
      `[Muuvi reminders] Scheduled reminder ${notificationId} for movie ${movieId}. Pending scheduled notifications: ${scheduledNotifications.length}.`,
    );
  }

  return notificationId;
}

export async function cancelWatchlistReminder(notificationId: string | null | undefined) {
  if (!notificationId) {
    return;
  }

  await cancelScheduledNotificationAsync(notificationId);

  if (__DEV__) {
    console.info(`[Muuvi reminders] Canceled reminder ${notificationId}.`);
  }
}

export function getMovieIdFromNotificationResponse(
  response: NotificationResponse | null | undefined,
) {
  const rawMovieId = response?.notification.request.content.data.movieId;
  const movieId = typeof rawMovieId === 'number' ? rawMovieId : Number(rawMovieId);

  return Number.isInteger(movieId) && movieId > 0 ? movieId : null;
}

async function ensureWatchlistReminderPermissions() {
  await ensureAndroidChannel();

  const existingPermissions = await getPermissionsAsync();

  if (existingPermissions.granted) {
    return true;
  }

  const requestedPermissions = await requestPermissionsAsync({
    android: {},
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: false,
    },
  });

  return requestedPermissions.granted;
}

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') {
    return;
  }

  await setNotificationChannelAsync(watchlistReminderChannelId, {
    description: 'Gentle Muuvi reminders for saved movies.',
    importance: AndroidImportance.DEFAULT,
    name: 'Muuvi watchlist',
    showBadge: false,
  });
}
