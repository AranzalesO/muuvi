import { View } from 'react-native';

import { MuuviLinkButton, MuuviScreen, MuuviText } from '@/src/shared/components';
import { muuviTheme } from '@/src/shared/theme';

export default function WatchlistRoute() {
  return (
    <MuuviScreen>
      <View style={{ gap: muuviTheme.spacing.sm }}>
        <MuuviText variant="caption" color="clay">
          Saved for later
        </MuuviText>
        <MuuviText variant="title">Watchlist</MuuviText>
        <MuuviText color="charcoalMuted">
          Your quiet corner for movies worth coming back to.
        </MuuviText>
      </View>
      <View style={{ gap: muuviTheme.spacing.md }}>
        <MuuviLinkButton href="/">Back to movies</MuuviLinkButton>
        <MuuviLinkButton href="/movie/1" variant="secondary">
          Open movie placeholder
        </MuuviLinkButton>
      </View>
    </MuuviScreen>
  );
}
