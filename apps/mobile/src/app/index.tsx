import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useServerHealth, type ServerHealth } from '@/features/health';
import { APP_LANGUAGES, LANGUAGE_NAMES, useLanguage } from '@/platform/language';

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

/** Temporary (M3d): try the three app languages. Moves to the parent area in M11. */
function LanguageSwitch() {
  const { language, texts, changeLanguage } = useLanguage();

  return (
    <View
      style={styles.links}
      accessibilityRole="radiogroup"
      accessibilityLabel={texts.common.language}
    >
      {APP_LANGUAGES.map((option) => {
        const chosen = option === language;
        return (
          <Pressable
            key={option}
            onPress={() => {
              if (!chosen) changeLanguage(option);
            }}
            accessibilityRole="radio"
            accessibilityState={{ checked: chosen }}
            style={[styles.languageOption, chosen && styles.languageChosen]}
          >
            <Text style={[styles.languageName, chosen && styles.languageNameChosen]}>
              {LANGUAGE_NAMES[option]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function HomeScreen() {
  const serverHealth = useServerHealth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kaw</Text>
      <Text style={styles.status}>{statusLabel(serverHealth)}</Text>
      <LanguageSwitch />
      <View style={styles.links}>
        <Link href="/lab" style={styles.link}>
          Open Kaw lab
        </Link>
        <Link href="/map-lab" style={styles.link}>
          Open map lab
        </Link>
        <Link href="/words-lab" style={styles.link}>
          Open words lab
        </Link>
        <Link href="/lesson-lab" style={styles.link}>
          Open lesson lab
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
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
  },
  languageOption: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#4A3F35',
  },
  languageChosen: { backgroundColor: '#4A3F35' },
  languageName: { fontSize: 16, fontWeight: '700', color: '#4A3F35' },
  languageNameChosen: { color: '#FFF6E6' },
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
