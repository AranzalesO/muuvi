import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function WatchlistRoute() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Watchlist</Text>
      <Text style={styles.copy}>Base route for saved movies.</Text>
      <Link href="/" style={styles.link}>
        Back to movies
      </Link>
      <Link href="/movie/1" style={styles.link}>
        Open movie placeholder
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
