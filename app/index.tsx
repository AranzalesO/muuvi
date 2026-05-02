import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeRoute() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Muuvi</Text>
      <Text style={styles.copy}>Base route for the movies feed.</Text>
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
    fontSize: 32,
    fontWeight: '700',
  },
});
