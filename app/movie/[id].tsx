import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { MuuviLinkButton, MuuviScreen, MuuviText } from '@/src/shared/components';
import { muuviTheme } from '@/src/shared/theme';

export default function MovieDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <MuuviScreen>
      <Stack.Screen options={{ title: 'Movie detail' }} />
      <View style={{ gap: muuviTheme.spacing.sm }}>
        <MuuviText variant="caption" color="pasture">
          Feature placeholder
        </MuuviText>
        <MuuviText variant="title">Movie detail</MuuviText>
        <MuuviText color="charcoalMuted">Route parameter: {id}</MuuviText>
      </View>
      <View style={{ gap: muuviTheme.spacing.md }}>
        <MuuviLinkButton href="/">Back to movies</MuuviLinkButton>
        <MuuviLinkButton href="/watchlist" variant="secondary">
          Open watchlist
        </MuuviLinkButton>
      </View>
    </MuuviScreen>
  );
}
