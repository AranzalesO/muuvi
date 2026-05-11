import { Link } from 'expo-router';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';

import { MuuviBrandMark, MuuviText } from '@/src/shared/components';
import { muuviTheme } from '@/src/shared/theme';
import { useWatchlistStore } from '@/src/features/watchlist/store';

type MovieListHeaderProps = {
  isSearching?: boolean;
  searchValue: string;
  resultCount?: number;
  onSearchChange: (value: string) => void;
};

export function MovieListHeader({
  isSearching = false,
  onSearchChange,
  resultCount,
  searchValue,
}: MovieListHeaderProps) {
  const savedCount = useWatchlistStore((state) => state.movieIds.length);
  const isSearchActive = searchValue.trim().length > 0;

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
        onChangeText={(value) => onSearchChange(value.slice(0, 1))}
        placeholder="Type one letter"
        placeholderTextColor={muuviTheme.colors.ash}
        style={[styles.searchInput, isSearchActive && styles.searchInputActive]}
        autoCorrect={false}
        autoCapitalize="characters"
        maxLength={1}
        returnKeyType="search"
      />
      <View style={styles.searchFeedback}>
        <MuuviText variant="caption" color={isSearchActive ? 'pasture' : 'ash'}>
          {isSearchActive
            ? 'Balanced search: title, genres and main cast'
            : 'Enter a letter to search eligible titles across TMDB'}
        </MuuviText>
        {isSearching ? (
          <View style={styles.searchingPill}>
            <ActivityIndicator color={muuviTheme.colors.pasture} size="small" />
            <MuuviText variant="caption" color="pasture">
              Checking eligible titles
            </MuuviText>
          </View>
        ) : null}
        {isSearchActive && !isSearching && resultCount !== undefined ? (
          <MuuviText variant="caption" color="clay">
            {resultCount} eligible {resultCount === 1 ? 'movie' : 'movies'}
          </MuuviText>
        ) : null}
      </View>
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
  searchFeedback: {
    gap: muuviTheme.spacing.sm,
  },
  searchInputActive: {
    borderColor: muuviTheme.colors.pasture,
    borderWidth: 2,
  },
  searchingPill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: muuviTheme.colors.sage,
    borderRadius: muuviTheme.radii.round,
    flexDirection: 'row',
    gap: muuviTheme.spacing.sm,
    paddingHorizontal: muuviTheme.spacing.md,
    paddingVertical: muuviTheme.spacing.sm,
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
