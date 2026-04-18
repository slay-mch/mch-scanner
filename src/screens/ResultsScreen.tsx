import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function ResultsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Scan Complete</Text>
      <Text style={styles.subtitle}>Results will appear here in Session 2.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1f14', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#f9fafb' },
  subtitle: { fontSize: 15, color: '#6b7280', marginTop: 8 },
});