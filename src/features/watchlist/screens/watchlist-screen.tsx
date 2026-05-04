import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { WatchlistMovie } from '../domain/watchlist-movie';
import { useWatchlist } from '../hooks';
import { MuuviBrandMark, MuuviLinkButton, MuuviText } from '@/src/shared/components';
import { muuviTheme } from '@/src/shared/theme';

export function WatchlistScreen() {
  const { movies, removeMovie } = useWatchlist();

  const renderItem = useCallback<ListRenderItem<WatchlistMovie>>(
    ({ item }) => (
      <WatchlistMovieCard
        movie={item}
        onRemove={() => removeMovie(item.id)}
      />
    ),
    [removeMovie],
  );

  const keyExtractor = useCallback((item: WatchlistMovie) => String(item.id), []);

  return (
    <SafeAreaView style={styles.screen}>
      <FlashList
        data={movies}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={<WatchlistHeader count={movies.length} />}
        ListEmptyComponent={<WatchlistEmptyState />}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={ItemSeparator}
      />
    </SafeAreaView>
  );
}

function WatchlistHeader({ count }: { count: number }) {
  return (
    <View style={styles.header}>
      <MuuviText variant="caption" color="clay">
        Personal collection
      </MuuviText>
      <MuuviText variant="display">Watchlist</MuuviText>
      <MuuviText color="charcoalMuted">
        {count === 1
          ? '1 movie tucked away for later.'
          : `${count} movies tucked away for later.`}
      </MuuviText>
    </View>
  );
}

function WatchlistMovieCard({
  movie,
  onRemove,
}: {
  movie: WatchlistMovie;
  onRemove: () => void;
}) {
  return (
    <View style={styles.card}>
      <Link
        href={{
          pathname: '/movie/[id]',
          params: { id: String(movie.id) },
        }}
        asChild
      >
        <Pressable style={styles.cardLink}>
          <View style={styles.posterFrame}>
            {movie.poster.url ? (
              <Image
                source={{ uri: movie.poster.url }}
                style={styles.poster}
                contentFit="cover"
                transition={120}
              />
            ) : (
              <View style={styles.posterFallback}>
                <MuuviText variant="caption" color="ash">
                  No poster
                </MuuviText>
              </View>
            )}
          </View>
          <View style={styles.cardBody}>
            <MuuviText style={styles.cardTitle} numberOfLines={2}>
              {movie.title}
            </MuuviText>
            <MuuviText variant="caption" color="ash">
              Saved {formatSavedDate(movie.savedAt)}
            </MuuviText>
            {movie.releaseDate ? (
              <MuuviText variant="caption" color="pasture">
                Released {movie.releaseDate.slice(0, 4)}
              </MuuviText>
            ) : null}
          </View>
        </Pressable>
      </Link>
      <Pressable style={styles.removeButton} onPress={onRemove}>
        <MuuviText variant="caption" color="clay" style={styles.removeText}>
          Remove
        </MuuviText>
      </Pressable>
    </View>
  );
}

function WatchlistEmptyState() {
  return (
    <View style={styles.emptyState}>
      <MuuviBrandMark />
      <MuuviText variant="title" style={styles.centerText}>
        Your pasture is quiet
      </MuuviText>
      <MuuviText color="charcoalMuted" style={styles.centerText}>
        Save movies from the feed or a detail page and they will wait here,
        ready even when the signal gets thin.
      </MuuviText>
      <MuuviLinkButton href="/">Explore movies</MuuviLinkButton>
    </View>
  );
}

function ItemSeparator() {
  return <View style={styles.separator} />;
}

function formatSavedDate(savedAt: string) {
  const date = new Date(savedAt);

  if (Number.isNaN(date.getTime())) {
    return 'recently';
  }

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  });
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: muuviTheme.colors.white,
    borderColor: muuviTheme.colors.line,
    borderRadius: muuviTheme.radii.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...muuviTheme.shadows.card,
  },
  cardBody: {
    flex: 1,
    gap: muuviTheme.spacing.sm,
    justifyContent: 'center',
    padding: muuviTheme.spacing.lg,
  },
  cardLink: {
    flexDirection: 'row',
  },
  cardTitle: {
    fontWeight: muuviTheme.typography.weight.bold,
  },
  centerText: {
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    gap: muuviTheme.spacing.md,
    paddingHorizontal: muuviTheme.spacing.xl,
    paddingVertical: muuviTheme.spacing.xxxl,
  },
  header: {
    gap: muuviTheme.spacing.sm,
    paddingBottom: muuviTheme.spacing.xl,
    paddingTop: muuviTheme.spacing.xl,
  },
  listContent: {
    padding: muuviTheme.spacing.xl,
  },
  poster: {
    height: '100%',
    width: '100%',
  },
  posterFallback: {
    alignItems: 'center',
    backgroundColor: muuviTheme.colors.cream,
    flex: 1,
    justifyContent: 'center',
  },
  posterFrame: {
    aspectRatio: 2 / 3,
    backgroundColor: muuviTheme.colors.cream,
    width: 104,
  },
  removeButton: {
    alignItems: 'center',
    backgroundColor: muuviTheme.colors.cream,
    borderTopColor: muuviTheme.colors.line,
    borderTopWidth: 1,
    paddingVertical: muuviTheme.spacing.md,
  },
  removeText: {
    fontWeight: muuviTheme.typography.weight.bold,
  },
  screen: {
    backgroundColor: muuviTheme.colors.milk,
    flex: 1,
  },
  separator: {
    height: muuviTheme.spacing.lg,
  },
});
