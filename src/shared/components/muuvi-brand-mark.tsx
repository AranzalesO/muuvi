import { StyleSheet, View } from 'react-native';

import { muuviTheme } from '../theme';

export function MuuviBrandMark() {
  return (
    <View accessibilityLabel="Muuvi brand mark" style={styles.mark}>
      <View style={[styles.spot, styles.largeSpot]} />
      <View style={[styles.spot, styles.smallSpot]} />
      <View style={[styles.spot, styles.warmSpot]} />
    </View>
  );
}

const styles = StyleSheet.create({
  largeSpot: {
    height: 28,
    left: 13,
    top: 9,
    transform: [{ rotate: '-18deg' }],
    width: 36,
  },
  mark: {
    backgroundColor: muuviTheme.colors.milk,
    borderColor: muuviTheme.colors.line,
    borderRadius: muuviTheme.radii.lg,
    borderWidth: 1,
    height: 56,
    overflow: 'hidden',
    width: 56,
  },
  smallSpot: {
    height: 14,
    right: 6,
    top: 5,
    transform: [{ rotate: '22deg' }],
    width: 18,
  },
  spot: {
    backgroundColor: muuviTheme.colors.spot,
    borderRadius: muuviTheme.radii.round,
    opacity: 0.9,
    position: 'absolute',
  },
  warmSpot: {
    backgroundColor: muuviTheme.colors.hay,
    bottom: 7,
    height: 12,
    right: 14,
    width: 20,
  },
});
