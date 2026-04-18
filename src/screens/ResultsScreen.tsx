import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RoomDimensions } from '../../modules/room-plan/index';

export default function ResultsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const dimensions: RoomDimensions = route.params?.dimensions || {
    widthFt: 0,
    lengthFt: 0,
    heightFt: 0,
  };

  const sendToMCH = () => {
    // Session 5: Deep link to mch-agent-platform quiz with dimensions pre-filled
    // URL: https://mch-agent-platform.vercel.app/quiz?source=scanner&width=X&length=Y&height=Z
    const url = `https://mch-agent-platform.vercel.app/quiz?source=scanner&width=${dimensions.widthFt}&length=${dimensions.lengthFt}&height=${dimensions.heightFt}`;
    // Linking.openURL(url) — wired in Session 5
    alert(`Ready to send: ${url}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.logo}>MCH</Text>
        <Text style={styles.tagline}>Scan Complete</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Room Dimensions</Text>

        <View style={styles.card}>
          <DimRow label="Width" value={dimensions.widthFt} />
          <View style={styles.divider} />
          <DimRow label="Length" value={dimensions.lengthFt} />
          <View style={styles.divider} />
          <DimRow label="Ceiling Height" value={dimensions.heightFt} />
        </View>

        <Text style={styles.note}>
          ℹ️ These measurements are approximate. Verify with a tape measure before purchasing.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} onPress={sendToMCH}>
          <Text style={styles.primaryButtonText}>Send to MyClubHaus →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>Scan Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function DimRow({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.dimRow}>
      <Text style={styles.dimLabel}>{label}</Text>
      <Text style={styles.dimValue}>{value > 0 ? `${value} ft` : '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1f14' },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  logo: { fontSize: 28, fontWeight: '800', color: '#4ade80', letterSpacing: 2 },
  tagline: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#f9fafb', marginBottom: 20 },
  card: {
    backgroundColor: '#111f16',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f3a26',
    overflow: 'hidden',
  },
  dimRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  dimLabel: { fontSize: 16, color: '#9ca3af' },
  dimValue: { fontSize: 20, fontWeight: '700', color: '#4ade80' },
  divider: { height: 1, backgroundColor: '#1f3a26', marginHorizontal: 20 },
  note: { fontSize: 13, color: '#6b7280', marginTop: 20, lineHeight: 20 },
  footer: { paddingHorizontal: 24, paddingBottom: 32 },
  primaryButton: {
    backgroundColor: '#4ade80',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: { fontSize: 17, fontWeight: '700', color: '#0f1f14' },
  secondaryButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f3a26',
  },
  secondaryButtonText: { fontSize: 16, color: '#9ca3af' },
});
