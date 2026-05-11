import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MovieCard, MovieListFooter, MovieListHeader, MovieListLoadingState, MovieListState } from '../components';
import { normalizeSearchLetter } from '../domain/balanced-search-rules';
import type { Movie } from '../domain/movie';
import { useBalancedMovieSearch } from '../hooks/use-balanced-movie-search';
import { useInfiniteMovies } from '../hooks/use-infinite-movies';
import { useNetworkStatus } from '@/src/shared/network';
import { muuviTheme } from '@/src/shared/theme';

export function MoviesHomeScreen() {
  const [searchValue, setSearchValue] = useState('');
  const { isOffline } = useNetworkStatus();
  const searchLetter = normalizeSearchLetter(searchValue);
  const isSearchActive = Boolean(searchLetter);
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
  const {
    data: balancedSearchResults = [],
    error: balancedSearchError,
    fetchStatus: balancedSearchFetchStatus,
    isError: isBalancedSearchError,
    isFetching: isBalancedSearchFetching,
    isLoading: isBalancedSearchLoading,
    refetch: refetchBalancedSearch,
  } = useBalancedMovieSearch(searchValue);

  const movies = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data],
  );

  const visibleMovies = isSearchActive ? balancedSearchResults : movies;

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
          isSearching={isSearchActive && isBalancedSearchFetching}
          searchValue={searchValue}
          resultCount={isSearchActive ? balancedSearchResults.length : undefined}
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
          isSearching={isSearchActive && isBalancedSearchFetching}
          searchValue={searchValue}
          resultCount={isSearchActive ? balancedSearchResults.length : undefined}
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
          isSearching={isSearchActive && isBalancedSearchFetching}
          searchValue={searchValue}
          resultCount={isSearchActive ? balancedSearchResults.length : undefined}
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

  if (
    isSearchActive &&
    isOffline &&
    balancedSearchResults.length === 0 &&
    (isBalancedSearchLoading || isBalancedSearchError || balancedSearchFetchStatus === 'paused')
  ) {
    return (
      <SafeAreaView style={styles.screen}>
        <MovieListHeader
          isSearching={false}
          searchValue={searchValue}
          resultCount={0}
          onSearchChange={setSearchValue}
        />
        <MovieListState
          title="No saved balanced search"
          copy="This letter needs an online pass before Muuvi can reuse its filtered results offline."
        />
      </SafeAreaView>
    );
  }

  if (isSearchActive && isBalancedSearchLoading && balancedSearchResults.length === 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <MovieListHeader
          isSearching
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
        <MovieListLoadingState />
      </SafeAreaView>
    );
  }

  if (isSearchActive && isBalancedSearchError && balancedSearchResults.length === 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <MovieListHeader
          isSearching={false}
          searchValue={searchValue}
          resultCount={0}
          onSearchChange={setSearchValue}
        />
        <MovieListState
          title="The balanced search stalled"
          copy={balancedSearchError instanceof Error ? balancedSearchError.message : 'Muuvi could not evaluate this letter right now.'}
          actionLabel="Try again"
          onActionPress={() => void refetchBalancedSearch()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlashList
        data={visibleMovies}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        ListHeaderComponent={
          <MovieListHeader
            isSearching={isSearchActive && isBalancedSearchFetching}
            searchValue={searchValue}
            resultCount={isSearchActive ? balancedSearchResults.length : undefined}
            onSearchChange={setSearchValue}
          />
        }
        ListEmptyComponent={
          <MovieListState
            title={isSearchActive ? 'No balanced matches' : 'No titles in this field'}
            copy={
              isSearchActive
                ? 'No movies in this search pass met the title, genre and main-cast balance rules.'
                : 'Try a gentler search or clear the text to see the full pasture.'
            }
          />
        }
        ListFooterComponent={
          <MovieListFooter isLoading={!isSearchActive && isFetchingNextPage} />
        }
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={ItemSeparator}
        onEndReached={isSearchActive ? undefined : handleEndReached}
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
