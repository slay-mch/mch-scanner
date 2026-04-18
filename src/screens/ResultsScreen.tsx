import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ResultsScreen({ route, navigation }: any) {
  const { width = 0, length = 0, height = 0 } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Room Dimensions</Text>
      <View style={styles.card}>
        <DimRow label="Width" value={width} />
        <DimRow label="Length" value={length} />
        <DimRow label="Height" value={height} />
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Send to MyClubHaus →</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.secondaryButtonText}>Scan Again</Text>
      </TouchableOpacity>
    </View>
  );
}

function DimRow({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value > 0 ? `${value} ft` : '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a4a2e',
    padding: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#2d6b42',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3d8b56',
  },
  label: {
    fontSize: 16,
    color: '#a3c4a8',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#4ade80',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#1a4a2e',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: '#a3c4a8',
    fontSize: 16,
  },
});
