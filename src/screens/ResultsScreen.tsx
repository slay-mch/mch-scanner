import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RoomDimensions } from '../../modules/room-plan/index';
import FloorPlanSVG from '../components/FloorPlanSVG';

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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Your Room Dimensions</Text>

        {/* 2D Floor Plan SVG */}
        <View style={styles.floorPlanWrapper}>
          <FloorPlanSVG
            widthFt={dimensions.widthFt}
            lengthFt={dimensions.lengthFt}
          />
        </View>

        {/* Stats chips row */}
        <View style={styles.chipsRow}>
          <StatChip label="Width" value={dimensions.widthFt} />
          <StatChip label="Length" value={dimensions.lengthFt} />
          <StatChip label="Height" value={dimensions.heightFt} />
        </View>

        <Text style={styles.note}>
          \u2139\ufe0f These measurements are approximate. Verify with a tape measure before purchasing.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} onPress={sendToMCH}>
          <Text style={styles.primaryButtonText}>Send to MyClubHaus \u2192</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>Scan Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

interface StatChipProps {
  label: string;
  value: number;
}

function StatChip({ label, value }: StatChipProps) {
  return (
    <View style={chipStyles.chip}>
      <Text style={chipStyles.label}>{label}</Text>
      <Text style={chipStyles.value}>
        {value > 0 ? `${value.toFixed(1)} ft` : '\u2014'}
      </Text>
    </View>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    flex: 1,
    backgroundColor: '#111f16',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f3a26',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  label: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4ade80',
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1f14' },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  logo: { fontSize: 28, fontWeight: '800', color: '#4ade80', letterSpacing: 2 },
  tagline: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#f9fafb', marginBottom: 20 },
  floorPlanWrapper: {
    backgroundColor: '#0a1a0f',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f3a26',
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  chipsRow: {
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: -4,
  },
  note: { fontSize: 13, color: '#6b7280', lineHeight: 20 },
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
