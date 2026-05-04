import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  getLastNotificationResponseAsync,
} from 'expo-notifications/build/NotificationsEmitter';
import type { NotificationResponse } from 'expo-notifications/build/Notifications.types';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';

import { getMovieIdFromNotificationResponse } from '../services/watchlist-reminder-service';

export function WatchlistReminderNotificationHandler() {
  const router = useRouter();
  const handledNotificationIdRef = useRef<string | null>(null);

  const openMovieFromNotification = useCallback(
    (response: NotificationResponse | null | undefined) => {
      const notificationId = response?.notification.request.identifier;
      const movieId = getMovieIdFromNotificationResponse(response);

      if (!movieId || notificationId === handledNotificationIdRef.current) {
        return;
      }

      handledNotificationIdRef.current = notificationId ?? null;
      router.push({
        pathname: '/movie/[id]',
        params: {
          id: String(movieId),
        },
      });
    },
    [router],
  );

  useEffect(() => {
    const receivedSubscription = addNotificationReceivedListener((notification) => {
      if (__DEV__) {
        console.info(
          `[Muuvi reminders] Received notification ${notification.request.identifier}.`,
        );
      }
    });
    const subscription = addNotificationResponseReceivedListener(
      openMovieFromNotification,
    );

    void getLastNotificationResponseAsync().then(openMovieFromNotification);

    return () => {
      receivedSubscription.remove();
      subscription.remove();
    };
  }, [openMovieFromNotification]);

  return null;
}
