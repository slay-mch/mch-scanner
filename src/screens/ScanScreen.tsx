import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RoomPlanModule, { RoomDimensions } from '../../modules/room-plan/index';

const LONG_SCAN_THRESHOLD_MS = 3 * 60 * 1000; // 3 minutes

export default function ScanScreen() {
  const navigation = useNavigation<any>();
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [showSlowBanner, setShowSlowBanner] = useState(false);
  const slowScanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (slowScanTimer.current) clearTimeout(slowScanTimer.current);
    };
  }, []);

  const startScan = () => {
    setSessionError(null);
    setShowSlowBanner(false);

    if (Platform.OS !== 'ios') {
      Alert.alert('iOS Only', 'Room scanning requires an iPhone with LiDAR.');
      return;
    }

    if (!RoomPlanModule) {
      setSessionError('LiDAR not available on this device. Requires iPhone 12 Pro or later.');
      return;
    }

    const completeListener = RoomPlanModule.addListener('onScanComplete', (dims: RoomDimensions) => {
      if (slowScanTimer.current) clearTimeout(slowScanTimer.current);
      completeListener?.remove?.();
      errorListener?.remove?.();
      setShowSlowBanner(false);
      navigation.navigate('Results', { dimensions: dims });
    });

    const errorListener = RoomPlanModule.addListener('onScanError', (event: { message: string }) => {
      if (slowScanTimer.current) clearTimeout(slowScanTimer.current);
      completeListener?.remove?.();
      errorListener?.remove?.();
      setShowSlowBanner(false);
      if (event.message === 'lidar_unavailable') {
        setSessionError('LiDAR not available on this device. Requires iPhone 12 Pro or later.');
      } else if (event.message !== 'cancelled') {
        Alert.alert('Scan Error', event.message || 'Something went wrong. Please try again.');
      }
    });

    // Start slow-scan timer
    slowScanTimer.current = setTimeout(() => {
      setShowSlowBanner(true);
    }, LONG_SCAN_THRESHOLD_MS);

    RoomPlanModule.startScan();
  };

  // Full-screen error state (session failed to start)
  if (sessionError) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.errorState}>
          <Text style={styles.errorStateIcon}>📵</Text>
          <Text style={styles.errorStateTitle}>Device Not Supported</Text>
          <Text style={styles.errorStateBody}>{sessionError}</Text>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => setSessionError(null)}
          >
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.logo}>MCH</Text>
        <Text style={styles.tagline}>Room Scanner</Text>
      </View>

      {!RoomPlanModule && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>⚠️ RoomPlanModule not registered — tap Start to see error details</Text>
        </View>
      )}

      {showSlowBanner && (
        <View style={styles.slowBanner}>
          <Text style={styles.slowBannerText}>
            ⏱ Scan taking longer than usual — try moving closer to walls
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.scanFrame}>
          <Text style={styles.scanIcon}>📐</Text>
          <Text style={styles.scanTitle}>Ready to Scan</Text>
          <Text style={styles.scanDescription}>
            Point your phone around the room. LiDAR will map your walls, ceiling, and floor automatically.
          </Text>
          <Text style={styles.scanTip}>
            Slowly sweep the phone across all 4 walls and the ceiling. Takes about 60 seconds.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.scanButton} onPress={startScan}>
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
  container: { flex: 1, backgroundColor: '#0f1f14' },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  logo: { fontSize: 28, fontWeight: '800', color: '#4ade80', letterSpacing: 2 },
  tagline: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  warningBanner: { backgroundColor: '#7c2d12', marginHorizontal: 16, borderRadius: 8, padding: 12, marginBottom: 8 },
  warningText: { color: '#fca5a5', fontSize: 12, textAlign: 'center' },
  slowBanner: {
    backgroundColor: '#78350f',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  slowBannerText: { color: '#fde68a', fontSize: 13, textAlign: 'center' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  scanFrame: {
    alignItems: 'center',
    padding: 32,
    borderWidth: 1,
    borderColor: '#1f3a26',
    borderRadius: 16,
    backgroundColor: '#111f16',
    width: '100%',
  },
  scanIcon: { fontSize: 48, marginBottom: 16 },
  scanTitle: { fontSize: 22, fontWeight: '700', color: '#f9fafb', marginBottom: 12 },
  scanDescription: { fontSize: 15, color: '#9ca3af', textAlign: 'center', lineHeight: 22 },
  scanTip: { fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 20, marginTop: 12 },
  footer: { paddingHorizontal: 24, paddingBottom: 32 },
  scanButton: {
    backgroundColor: '#4ade80',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  scanButtonText: { fontSize: 17, fontWeight: '700', color: '#0f1f14' },
  disclaimer: { fontSize: 12, color: '#6b7280', textAlign: 'center' },
  // Error state
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorStateIcon: { fontSize: 64, marginBottom: 24 },
  errorStateTitle: { fontSize: 22, fontWeight: '700', color: '#f9fafb', marginBottom: 16, textAlign: 'center' },
  errorStateBody: { fontSize: 15, color: '#9ca3af', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  goBackButton: {
    backgroundColor: '#1f3a26',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  goBackButtonText: { fontSize: 16, fontWeight: '600', color: '#4ade80' },
});
