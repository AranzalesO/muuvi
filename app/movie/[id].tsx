import { useLocalSearchParams } from 'expo-router';

import { MovieDetailScreen } from '@/src/features/movies/screens/movie-detail-screen';

export default function MovieDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = id ? Number(id) : null;

  return <MovieDetailScreen movieId={Number.isFinite(movieId) ? movieId : null} />;
}
