import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function ScanScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>MCH</Text>
        <Text style={styles.tagline}>Room Scanner</Text>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <View style={styles.scanFrame}>
          <Text style={styles.scanIcon}>📐</Text>
          <Text style={styles.scanTitle}>Ready to Scan</Text>
          <Text style={styles.scanDescription}>
            Point your phone around the room. LiDAR will map your walls, ceiling, and floor automatically.
          </Text>
        </View>
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.scanButton} onPress={() => {}}>
          <Text style={styles.scanButtonText}>Start Scanning</Text>
        </TouchableOpacity>
        <Text style={styles.disclaimer}>
          Requires iPhone 12 Pro or later with LiDAR sensor
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1f14',
  },
  header: {
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
  tagline: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  scanFrame: {
    alignItems: 'center',
    padding: 32,
    borderWidth: 1,
    borderColor: '#1f3a26',
    borderRadius: 16,
    backgroundColor: '#111f16',
    width: '100%',
  },
  scanIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  scanTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 12,
  },
  scanDescription: {
    fontSize: 15,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  scanButton: {
    backgroundColor: '#4ade80',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  scanButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f1f14',
  },
  disclaimer: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});