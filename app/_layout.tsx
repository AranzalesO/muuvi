import { ThemeProvider } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  configureWatchlistReminderPresentation,
  WatchlistReminderNotificationHandler,
} from '@/src/features/notifications';
import { OfflineBanner } from '@/src/shared/components';
import { configureOnlineManager } from '@/src/shared/network';
import { darkNavigationTheme, lightNavigationTheme } from '@/src/shared/theme/navigation-theme';

const queryCacheMaxAge = 1000 * 60 * 60 * 24;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: queryCacheMaxAge,
            staleTime: 1000 * 60,
            retry: 1,
          },
        },
      }),
  );
  const [persister] = useState(() =>
    createAsyncStoragePersister({
      key: 'muuvi-query-cache',
      storage: AsyncStorage,
    }),
  );

  useEffect(() => {
    configureWatchlistReminderPresentation();
    return configureOnlineManager();
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        maxAge: queryCacheMaxAge,
        persister,
      }}
    >
      <ThemeProvider value={colorScheme === 'dark' ? darkNavigationTheme : lightNavigationTheme}>
        <WatchlistReminderNotificationHandler />
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Muuvi' }} />
          <Stack.Screen name="movie/[id]" options={{ title: 'Detalle' }} />
          <Stack.Screen name="watchlist" options={{ title: 'Watchlist' }} />
        </Stack>
        <OfflineBanner />
        <StatusBar style="auto" />
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}
