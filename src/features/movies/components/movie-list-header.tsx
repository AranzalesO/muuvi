import { Link } from 'expo-router';
import { StyleSheet, TextInput, View } from 'react-native';

import { MuuviBrandMark, MuuviText } from '@/src/shared/components';
import { muuviTheme } from '@/src/shared/theme';
import { useWatchlistStore } from '@/src/features/watchlist/store';

type MovieListHeaderProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
};

export function MovieListHeader({
  onSearchChange,
  searchValue,
}: MovieListHeaderProps) {
  const savedCount = useWatchlistStore((state) => state.movieIds.length);

  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <MuuviBrandMark />
        <View style={styles.titleGroup}>
          <MuuviText variant="caption" color="pasture">
            Movie pasture
          </MuuviText>
          <MuuviText variant="display">Muuvi</MuuviText>
        </View>
        <Link href="/watchlist" style={styles.watchlistLink}>
          My list{savedCount > 0 ? ` (${savedCount})` : ''}
        </Link>
      </View>
      <TextInput
        value={searchValue}
        onChangeText={onSearchChange}
        placeholder="Search loaded movies"
        placeholderTextColor={muuviTheme.colors.ash}
        style={styles.searchInput}
        autoCorrect={false}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: muuviTheme.spacing.md,
  },
  header: {
    gap: muuviTheme.spacing.lg,
    paddingBottom: muuviTheme.spacing.lg,
    paddingHorizontal: muuviTheme.spacing.xl,
    paddingTop: muuviTheme.spacing.xl,
  },
  searchInput: {
    backgroundColor: muuviTheme.colors.white,
    borderColor: muuviTheme.colors.line,
    borderRadius: muuviTheme.radii.md,
    borderWidth: 1,
    color: muuviTheme.colors.charcoal,
    fontSize: muuviTheme.typography.size.body,
    lineHeight: muuviTheme.typography.lineHeight.body,
    paddingHorizontal: muuviTheme.spacing.lg,
    paddingVertical: muuviTheme.spacing.md,
  },
  titleGroup: {
    flex: 1,
  },
  watchlistLink: {
    backgroundColor: muuviTheme.colors.charcoal,
    borderRadius: muuviTheme.radii.md,
    color: muuviTheme.colors.milk,
    fontSize: muuviTheme.typography.size.caption,
    fontWeight: muuviTheme.typography.weight.bold,
    lineHeight: muuviTheme.typography.lineHeight.caption,
    overflow: 'hidden',
    paddingHorizontal: muuviTheme.spacing.md,
    paddingVertical: muuviTheme.spacing.sm,
    textAlign: 'center',
  },
});
