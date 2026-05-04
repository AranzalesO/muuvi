import { StyleSheet, View } from 'react-native';

import { useNetworkStatus } from '../network';
import { muuviTheme } from '../theme';
import { MuuviText } from './muuvi-text';

export function OfflineBanner() {
  const { isOffline } = useNetworkStatus();

  if (!isOffline) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.wrap}>
      <View style={styles.banner}>
        <View style={styles.dot} />
        <MuuviText variant="caption" color="milk" style={styles.text}>
          Offline - showing saved Muuvi content
        </MuuviText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: muuviTheme.colors.charcoal,
    borderColor: muuviTheme.colors.hay,
    borderRadius: muuviTheme.radii.round,
    borderWidth: 1,
    flexDirection: 'row',
    gap: muuviTheme.spacing.sm,
    maxWidth: 340,
    paddingHorizontal: muuviTheme.spacing.lg,
    paddingVertical: muuviTheme.spacing.sm,
  },
  dot: {
    backgroundColor: muuviTheme.colors.hay,
    borderRadius: muuviTheme.radii.round,
    height: 8,
    width: 8,
  },
  text: {
    flexShrink: 1,
    textAlign: 'center',
  },
  wrap: {
    bottom: 18,
    left: 0,
    paddingHorizontal: muuviTheme.spacing.lg,
    position: 'absolute',
    right: 0,
    zIndex: 20,
  },
});
