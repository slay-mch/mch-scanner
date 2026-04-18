import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MCHHeaderProps {
  subtitle?: string;
}

export default function MCHHeader({ subtitle = 'Room Scanner' }: MCHHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>MCH</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#4ade80',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
});