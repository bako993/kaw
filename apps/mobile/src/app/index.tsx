import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useServerHealth, type ServerHealth } from '@/features/health';

function statusLabel(serverHealth: ServerHealth): string {
  switch (serverHealth.state) {
    case 'checking':
      return 'Checking server…';
    case 'unreachable':
      return 'Server unreachable';
    case 'reachable':
      return serverHealth.health.database === 'ok'
        ? 'Connected ✓ (database ok)'
        : 'Server ok, database unreachable';
  }
}

export default function HomeScreen() {
  const serverHealth = useServerHealth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kaw</Text>
      <Text style={styles.status}>{statusLabel(serverHealth)}</Text>
      <View style={styles.links}>
        <Link href="/lab" style={styles.link}>
          Open Kaw lab
        </Link>
        <Link href="/map-lab" style={styles.link}>
          Open map lab
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#FFF6E6',
  },
  title: { fontSize: 32, fontWeight: '800', color: '#4A3F35' },
  status: { fontSize: 18, color: '#4A3F35' },
  links: { flexDirection: 'row', gap: 12, marginTop: 12 },
  link: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#4A3F35',
    color: '#FFF6E6',
    fontSize: 16,
    fontWeight: '700',
  },
});
