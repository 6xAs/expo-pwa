import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>CHECKPOINT 2</Text>
      <Text style={styles.title}>Expo PWA</Text>
      <Text style={styles.description}>
        React + Expo + TypeScript executando na Web.
      </Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Ambiente pronto para o próximo checkpoint</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f7f5ff',
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#7257d5',
    marginBottom: 12,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#211a35',
    marginBottom: 12,
  },
  description: {
    fontSize: 18,
    color: '#625a73',
    textAlign: 'center',
    marginBottom: 24,
  },
  badge: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#e9e2ff',
  },
  badgeText: {
    color: '#553aa8',
    fontWeight: '600',
  },
});
