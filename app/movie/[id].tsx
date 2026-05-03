import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function MovieDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Movie detail' }} />
      <Text style={styles.title}>Movie detail</Text>
      <Text style={styles.copy}>Route parameter: {id}</Text>
      <Link href="/" style={styles.link}>
        Back to movies
      </Link>
      <Link href="/watchlist" style={styles.link}>
        Open watchlist
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 24,
  },
  copy: {
    color: '#4b5563',
    fontSize: 16,
  },
  link: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
});
