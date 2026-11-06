import { StyleSheet, View } from 'react-native';

import { Kaw } from '@/features/kaw';

export default function LabScreen() {
  return (
    <View style={styles.container}>
      <Kaw pose="cheering" size={320} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF6E6',
  },
});
