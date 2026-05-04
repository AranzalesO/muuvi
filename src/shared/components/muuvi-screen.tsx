import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { muuviTheme } from '../theme';

type MuuviScreenProps = PropsWithChildren<{
  contentStyle?: ViewStyle;
}>;

export function MuuviScreen({ children, contentStyle }: MuuviScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundSpot} />
      <View style={[styles.content, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundSpot: {
    backgroundColor: muuviTheme.colors.sage,
    borderRadius: muuviTheme.radii.round,
    height: 180,
    opacity: 0.35,
    position: 'absolute',
    right: -72,
    top: -64,
    transform: [{ scaleX: 1.35 }, { rotate: '-12deg' }],
    width: 132,
  },
  content: {
    flex: 1,
    gap: muuviTheme.spacing.lg,
    justifyContent: 'center',
    padding: muuviTheme.spacing.xl,
  },
  safeArea: {
    backgroundColor: muuviTheme.colors.milk,
    flex: 1,
  },
});
