import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { CastMember, MovieId } from '../domain/movie';
import { useMovieDetail } from '../hooks/use-movie-detail';
import { MuuviBrandMark, MuuviText } from '@/src/shared/components';
import { muuviTheme } from '@/src/shared/theme';

type MovieDetailScreenProps = {
  movieId: MovieId | null;
};

export function MovieDetailScreen({ movieId }: MovieDetailScreenProps) {
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const { data, error, isError, isLoading, refetch } = useMovieDetail(movieId);

  const mainCast = useMemo(
    () => data?.credits.cast.slice(0, 12) ?? [],
    [data?.credits.cast],
  );

  if (movieId === null) {
    return (
      <SafeAreaView style={styles.screen}>
        <Stack.Screen options={{ title: 'Movie detail' }} />
        <CenteredState
          title="No movie selected"
          copy="This gate needs a valid movie before Muuvi can roll the film."
        />
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <Stack.Screen options={{ title: 'Movie detail' }} />
        <View style={styles.loadingState}>
          <ActivityIndicator color={muuviTheme.colors.pasture} size="large" />
          <MuuviText color="charcoalMuted">Warming up the projector</MuuviText>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView style={styles.screen}>
        <Stack.Screen options={{ title: 'Movie detail' }} />
        <CenteredState
          title="The feature slipped away"
          copy={error instanceof Error ? error.message : 'Muuvi could not load this movie right now.'}
          actionLabel="Try again"
          onActionPress={() => void refetch()}
        />
      </SafeAreaView>
    );
  }

  const { movie } = data;
  const heroImage = movie.backdrop.url ?? movie.poster.url;

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <Stack.Screen options={{ title: movie.title }} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          {heroImage ? (
            <Image
              source={{ uri: heroImage }}
              style={styles.backdrop}
              contentFit="cover"
              transition={160}
            />
          ) : (
            <View style={styles.backdropFallback}>
              <MuuviBrandMark />
            </View>
          )}
          <View style={styles.heroScrim} />
        </View>

        <View style={styles.body}>
          <View style={styles.posterRow}>
            <View style={styles.posterFrame}>
              {movie.poster.url ? (
                <Image
                  source={{ uri: movie.poster.url }}
                  style={styles.poster}
                  contentFit="cover"
                  transition={160}
                />
              ) : (
                <View style={styles.posterFallback}>
                  <MuuviText variant="caption" color="ash">
                    No poster
                  </MuuviText>
                </View>
              )}
            </View>
            <View style={styles.titleBlock}>
              <MuuviText variant="caption" color="pasture">
                {movie.releaseDate?.slice(0, 4) ?? 'Muuvi pick'}
              </MuuviText>
              <MuuviText variant="title">{movie.title}</MuuviText>
              {movie.tagline ? (
                <MuuviText color="charcoalMuted">{movie.tagline}</MuuviText>
              ) : null}
            </View>
          </View>

          <Pressable
            style={[styles.watchlistButton, isWatchlisted && styles.watchlistButtonActive]}
            onPress={() => setIsWatchlisted((current) => !current)}
          >
            <MuuviText color={isWatchlisted ? 'charcoal' : 'milk'} style={styles.watchlistText}>
              {isWatchlisted ? 'Saved for later' : 'Add to watchlist'}
            </MuuviText>
          </Pressable>

          <GenreChips genres={movie.genres.map((genre) => genre.name)} />

          <Section title="Overview">
            <MuuviText color="charcoalMuted">
              {movie.overview || 'No description is available for this title yet.'}
            </MuuviText>
          </Section>

          <Section title="Main cast">
            {mainCast.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.castList}
              >
                {mainCast.map((person) => (
                  <CastCard key={`${person.id}-${person.order}`} person={person} />
                ))}
              </ScrollView>
            ) : (
              <MuuviText color="charcoalMuted">
                No cast list has been brought in from the barn yet.
              </MuuviText>
            )}
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function GenreChips({ genres }: { genres: string[] }) {
  if (genres.length === 0) {
    return null;
  }

  return (
    <View style={styles.chips}>
      {genres.map((genre) => (
        <View key={genre} style={styles.chip}>
          <MuuviText variant="caption" color="pasture">
            {genre}
          </MuuviText>
        </View>
      ))}
    </View>
  );
}

function Section({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <View style={styles.section}>
      <MuuviText variant="caption" color="clay">
        {title}
      </MuuviText>
      {children}
    </View>
  );
}

function CastCard({ person }: { person: CastMember }) {
  return (
    <View style={styles.castCard}>
      <View style={styles.castImageFrame}>
        {person.profile.url ? (
          <Image
            source={{ uri: person.profile.url }}
            style={styles.castImage}
            contentFit="cover"
            transition={120}
          />
        ) : (
          <View style={styles.castFallback}>
            <MuuviText variant="caption" color="ash">
              Cast
            </MuuviText>
          </View>
        )}
      </View>
      <MuuviText style={styles.castName} numberOfLines={2}>
        {person.name}
      </MuuviText>
      <MuuviText variant="caption" color="ash" numberOfLines={1}>
        {person.character}
      </MuuviText>
    </View>
  );
}

function CenteredState({
  actionLabel,
  copy,
  onActionPress,
  title,
}: {
  actionLabel?: string;
  copy: string;
  onActionPress?: () => void;
  title: string;
}) {
  return (
    <View style={styles.centeredState}>
      <MuuviBrandMark />
      <MuuviText variant="title" style={styles.centerText}>
        {title}
      </MuuviText>
      <MuuviText color="charcoalMuted" style={styles.centerText}>
        {copy}
      </MuuviText>
      {actionLabel && onActionPress ? (
        <Pressable style={styles.retryButton} onPress={onActionPress}>
          <MuuviText color="milk" style={styles.watchlistText}>
            {actionLabel}
          </MuuviText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    height: '100%',
    width: '100%',
  },
  backdropFallback: {
    alignItems: 'center',
    backgroundColor: muuviTheme.colors.cream,
    flex: 1,
    justifyContent: 'center',
  },
  body: {
    gap: muuviTheme.spacing.xl,
    marginTop: -72,
    padding: muuviTheme.spacing.xl,
  },
  castCard: {
    gap: muuviTheme.spacing.sm,
    width: 112,
  },
  castFallback: {
    alignItems: 'center',
    backgroundColor: muuviTheme.colors.cream,
    flex: 1,
    justifyContent: 'center',
  },
  castImage: {
    height: '100%',
    width: '100%',
  },
  castImageFrame: {
    aspectRatio: 2 / 3,
    backgroundColor: muuviTheme.colors.cream,
    borderColor: muuviTheme.colors.line,
    borderRadius: muuviTheme.radii.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  castList: {
    gap: muuviTheme.spacing.md,
    paddingRight: muuviTheme.spacing.xl,
  },
  castName: {
    fontWeight: muuviTheme.typography.weight.medium,
    minHeight: 46,
  },
  centerText: {
    textAlign: 'center',
  },
  centeredState: {
    alignItems: 'center',
    flex: 1,
    gap: muuviTheme.spacing.md,
    justifyContent: 'center',
    padding: muuviTheme.spacing.xl,
  },
  chip: {
    backgroundColor: muuviTheme.colors.sage,
    borderRadius: muuviTheme.radii.round,
    paddingHorizontal: muuviTheme.spacing.md,
    paddingVertical: muuviTheme.spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: muuviTheme.spacing.sm,
  },
  content: {
    paddingBottom: muuviTheme.spacing.xxl,
  },
  hero: {
    backgroundColor: muuviTheme.colors.charcoal,
    height: 320,
  },
  heroScrim: {
    backgroundColor: 'rgba(23, 23, 23, 0.28)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  loadingState: {
    alignItems: 'center',
    flex: 1,
    gap: muuviTheme.spacing.md,
    justifyContent: 'center',
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
    borderColor: muuviTheme.colors.milk,
    borderRadius: muuviTheme.radii.lg,
    borderWidth: 3,
    overflow: 'hidden',
    width: 124,
    ...muuviTheme.shadows.card,
  },
  posterRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: muuviTheme.spacing.lg,
  },
  retryButton: {
    backgroundColor: muuviTheme.colors.charcoal,
    borderRadius: muuviTheme.radii.md,
    paddingHorizontal: muuviTheme.spacing.lg,
    paddingVertical: muuviTheme.spacing.md,
  },
  screen: {
    backgroundColor: muuviTheme.colors.milk,
    flex: 1,
  },
  section: {
    gap: muuviTheme.spacing.md,
  },
  titleBlock: {
    flex: 1,
    gap: muuviTheme.spacing.sm,
    paddingBottom: muuviTheme.spacing.sm,
  },
  watchlistButton: {
    alignItems: 'center',
    backgroundColor: muuviTheme.colors.charcoal,
    borderRadius: muuviTheme.radii.md,
    paddingHorizontal: muuviTheme.spacing.lg,
    paddingVertical: muuviTheme.spacing.md,
  },
  watchlistButtonActive: {
    backgroundColor: muuviTheme.colors.hay,
  },
  watchlistText: {
    fontWeight: muuviTheme.typography.weight.medium,
  },
});
