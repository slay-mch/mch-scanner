import React, { useEffect, useRef } from 'react';
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

export default function ScanScreen() {
  const navigation = useNavigation<any>();
  const listenerRef = useRef<any>(null);
  const errorListenerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      // Cleanup listeners on unmount
    };
  }, []);

  const startScan = () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('iOS Only', 'Room scanning requires an iPhone with LiDAR.');
      return;
    }

    // Listen for scan completion
    const completeListener = RoomPlanModule.addListener('onScanComplete', (dims: RoomDimensions) => {
      completeListener?.remove?.();
      errorListener?.remove?.();
      navigation.navigate('Results', { dimensions: dims });
    });

    const errorListener = RoomPlanModule.addListener('onScanError', (event: { message: string }) => {
      completeListener?.remove?.();
      errorListener?.remove?.();
      if (event.message !== 'cancelled') {
        Alert.alert('Scan Error', event.message || 'Something went wrong. Please try again.');
      }
    });

    RoomPlanModule.startScan();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.logo}>MCH</Text>
        <Text style={styles.tagline}>Room Scanner</Text>
      </View>

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
});
