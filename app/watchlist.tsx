import { StyleSheet, Text, View } from 'react-native';

export default function WatchlistRoute() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Watchlist</Text>
      <Text style={styles.copy}>Base route for saved movies.</Text>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
});
