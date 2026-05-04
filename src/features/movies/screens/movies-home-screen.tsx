import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MovieCard, MovieListFooter, MovieListHeader, MovieListLoadingState, MovieListState } from '../components';
import type { Movie } from '../domain/movie';
import { useInfiniteMovies } from '../hooks/use-infinite-movies';
import { useNetworkStatus } from '@/src/shared/network';
import { muuviTheme } from '@/src/shared/theme';

export function MoviesHomeScreen() {
  const [searchValue, setSearchValue] = useState('');
  const { isOffline } = useNetworkStatus();
  const {
    data,
    error,
    fetchNextPage,
    fetchStatus,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteMovies();

  const movies = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data],
  );

  const filteredMovies = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return movies;
    }

    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(normalizedSearch),
    );
  }, [movies, searchValue]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderItem = useCallback<ListRenderItem<Movie>>(
    ({ item }) => (
      <View style={styles.gridItem}>
        <MovieCard movie={item} />
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: Movie) => String(item.id), []);

  if (isOffline && movies.length === 0 && (isLoading || isError || fetchStatus === 'paused')) {
    return (
      <SafeAreaView style={styles.screen}>
        <MovieListHeader
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
        <MovieListState
          title="No saved feed yet"
          copy="Reconnect once to fill the pasture, then Muuvi can show those movies offline."
        />
      </SafeAreaView>
    );
  }

  if (isLoading && movies.length === 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <MovieListHeader
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
        <MovieListLoadingState />
      </SafeAreaView>
    );
  }

  if (isError && movies.length === 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <MovieListHeader
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
        <MovieListState
          title="The reel got stuck"
          copy={error instanceof Error ? error.message : 'Muuvi could not load movies right now.'}
          actionLabel="Try again"
          onActionPress={() => void refetch()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlashList
        data={filteredMovies}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        ListHeaderComponent={
          <MovieListHeader
            searchValue={searchValue}
            onSearchChange={setSearchValue}
          />
        }
        ListEmptyComponent={
          <MovieListState
            title="No titles in this field"
            copy="Try a gentler search or clear the text to see the full pasture."
          />
        }
        ListFooterComponent={
          <MovieListFooter isLoading={isFetchingNextPage} />
        }
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={ItemSeparator}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.7}
      />
    </SafeAreaView>
  );
}

function ItemSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    paddingHorizontal: muuviTheme.spacing.sm,
  },
  listContent: {
    paddingBottom: muuviTheme.spacing.xl,
    paddingHorizontal: muuviTheme.spacing.md,
  },
  screen: {
    backgroundColor: muuviTheme.colors.milk,
    flex: 1,
  },
  separator: {
    height: muuviTheme.spacing.xs,
  },
});
