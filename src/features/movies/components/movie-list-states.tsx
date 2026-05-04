import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { MuuviBrandMark, MuuviText } from '@/src/shared/components';
import { muuviTheme } from '@/src/shared/theme';

type MovieListStateProps = {
  actionLabel?: string;
  copy: string;
  onActionPress?: () => void;
  title: string;
};

export function MovieListState({
  actionLabel,
  copy,
  onActionPress,
  title,
}: MovieListStateProps) {
  return (
    <View style={styles.state}>
      <MuuviBrandMark />
      <MuuviText variant="title" style={styles.centerText}>
        {title}
      </MuuviText>
      <MuuviText color="charcoalMuted" style={styles.centerText}>
        {copy}
      </MuuviText>
      {actionLabel && onActionPress ? (
        <Pressable style={styles.action} onPress={onActionPress}>
          <MuuviText color="milk" style={styles.actionText}>
            {actionLabel}
          </MuuviText>
        </Pressable>
      ) : null}
    </View>
  );
}

export function MovieListLoadingState() {
  return (
    <View style={styles.loadingWrap}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={index} style={styles.skeletonCard}>
          <View style={styles.skeletonPoster} />
          <View style={styles.skeletonLine} />
          <View style={styles.skeletonShortLine} />
        </View>
      ))}
    </View>
  );
}

export function MovieListFooter({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) {
    return null;
  }

  return (
    <View style={styles.footer}>
      <ActivityIndicator color={muuviTheme.colors.pasture} />
      <MuuviText variant="caption" color="ash">
        Bringing in more titles
      </MuuviText>
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    backgroundColor: muuviTheme.colors.charcoal,
    borderRadius: muuviTheme.radii.md,
    paddingHorizontal: muuviTheme.spacing.lg,
    paddingVertical: muuviTheme.spacing.md,
  },
  actionText: {
    fontWeight: muuviTheme.typography.weight.medium,
  },
  centerText: {
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    gap: muuviTheme.spacing.sm,
    paddingBottom: muuviTheme.spacing.xl,
    paddingTop: muuviTheme.spacing.md,
  },
  loadingWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: muuviTheme.spacing.lg,
    padding: muuviTheme.spacing.xl,
  },
  skeletonCard: {
    backgroundColor: muuviTheme.colors.white,
    borderColor: muuviTheme.colors.line,
    borderRadius: muuviTheme.radii.lg,
    borderWidth: 1,
    flexBasis: '47%',
    gap: muuviTheme.spacing.sm,
    padding: muuviTheme.spacing.sm,
  },
  skeletonLine: {
    backgroundColor: muuviTheme.colors.cream,
    borderRadius: muuviTheme.radii.round,
    height: 14,
    width: '88%',
  },
  skeletonPoster: {
    aspectRatio: 2 / 3,
    backgroundColor: muuviTheme.colors.sage,
    borderRadius: muuviTheme.radii.md,
    opacity: 0.55,
  },
  skeletonShortLine: {
    backgroundColor: muuviTheme.colors.cream,
    borderRadius: muuviTheme.radii.round,
    height: 12,
    width: '48%',
  },
  state: {
    alignItems: 'center',
    flex: 1,
    gap: muuviTheme.spacing.md,
    justifyContent: 'center',
    padding: muuviTheme.spacing.xl,
  },
});
