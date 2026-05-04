import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Movie } from '../domain/movie';
import { MuuviText } from '@/src/shared/components';
import { muuviTheme } from '@/src/shared/theme';

type MovieCardProps = {
  movie: Movie;
};

function MovieCardComponent({ movie }: MovieCardProps) {
  return (
    <Link
      href={{
        pathname: '/movie/[id]',
        params: { id: String(movie.id) },
      }}
      asChild
    >
      <Pressable style={styles.card}>
        <View style={styles.posterFrame}>
          {movie.poster.url ? (
            <Image
              source={{ uri: movie.poster.url }}
              style={styles.poster}
              contentFit="cover"
              transition={120}
              recyclingKey={String(movie.id)}
            />
          ) : (
            <View style={styles.posterFallback}>
              <View style={styles.fallbackSpot} />
              <MuuviText variant="caption" color="ash">
                No poster
              </MuuviText>
            </View>
          )}
        </View>
        <View style={styles.meta}>
          <MuuviText style={styles.title} numberOfLines={2}>
            {movie.title}
          </MuuviText>
          <MuuviText variant="caption" color="ash">
            {movie.releaseDate?.slice(0, 4) ?? 'Coming soon'}
          </MuuviText>
        </View>
      </Pressable>
    </Link>
  );
}

export const MovieCard = memo(MovieCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: muuviTheme.colors.white,
    borderColor: muuviTheme.colors.line,
    borderRadius: muuviTheme.radii.lg,
    borderWidth: 1,
    marginBottom: muuviTheme.spacing.lg,
    overflow: 'hidden',
    ...muuviTheme.shadows.card,
  },
  fallbackSpot: {
    backgroundColor: muuviTheme.colors.spot,
    borderRadius: muuviTheme.radii.round,
    height: 54,
    opacity: 0.08,
    position: 'absolute',
    right: 14,
    top: 18,
    transform: [{ rotate: '-18deg' }],
    width: 74,
  },
  meta: {
    gap: muuviTheme.spacing.xs,
    padding: muuviTheme.spacing.md,
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
  },
  title: {
    minHeight: 46,
  },
});
