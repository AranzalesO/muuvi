import { View } from 'react-native';

import { MuuviBrandMark, MuuviLinkButton, MuuviScreen, MuuviText } from '@/src/shared/components';
import { muuviTheme } from '@/src/shared/theme';

export default function HomeRoute() {
  return (
    <MuuviScreen>
      <MuuviBrandMark />
      <View style={{ gap: muuviTheme.spacing.sm }}>
        <MuuviText variant="caption" color="pasture">
          Fresh from the pasture
        </MuuviText>
        <MuuviText variant="display">Muuvi</MuuviText>
        <MuuviText variant="lead" color="charcoalMuted">
          A clean movie experience with a warm farm-house edge.
        </MuuviText>
      </View>
      <View style={{ gap: muuviTheme.spacing.md }}>
        <MuuviLinkButton href="/movie/1">Open movie placeholder</MuuviLinkButton>
        <MuuviLinkButton href="/watchlist" variant="secondary">
          Open watchlist
        </MuuviLinkButton>
      </View>
    </MuuviScreen>
  );
}
