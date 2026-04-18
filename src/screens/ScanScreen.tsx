import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ScanScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>MCH Scanner</Text>
      <Text style={styles.subtitle}>Golf Simulator Room Scanner</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Results', {
          width: 0,
          length: 0,
          height: 0,
        })}
      >
        <Text style={styles.buttonText}>Start Scan</Text>
      </TouchableOpacity>
      <Text style={styles.note}>LiDAR scanning coming in Session 2</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a4a2e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#a3c4a8',
    marginBottom: 48,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4ade80',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonText: {
    color: '#1a4a2e',
    fontSize: 18,
    fontWeight: '700',
  },
  note: {
    fontSize: 13,
    color: '#6b9e73',
    textAlign: 'center',
  },
});
