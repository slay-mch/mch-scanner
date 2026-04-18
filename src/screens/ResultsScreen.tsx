import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Linking,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RoomDimensions } from '../../modules/room-plan/index';
import FloorPlanSVG from '../components/FloorPlanSVG';
import Room3DView from '../components/Room3DView';

type ViewTab = '2D Plan' | '3D View';

export default function ResultsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const dimensions: RoomDimensions = route.params?.dimensions || {
    widthFt: 0,
    lengthFt: 0,
    heightFt: 0,
  };

  const [activeTab, setActiveTab] = useState<ViewTab>('2D Plan');
  const [sending, setSending] = useState(false);

  const sendToMCH = async () => {
    setSending(true);
    try {
      const formData = new FormData();
      formData.append('width_ft', String(dimensions.widthFt));
      formData.append('length_ft', String(dimensions.lengthFt));
      formData.append('height_ft', String(dimensions.heightFt));

      // Attach .usdz if available
      if (dimensions.usdzPath) {
        formData.append('usdz_file', {
          uri: `file://${dimensions.usdzPath}`,
          type: 'model/vnd.usdz+zip',
          name: 'room.usdz',
        } as any);
      }

      const res = await fetch('https://mch-agent-platform.vercel.app/api/room-scan', {
        method: 'POST',
        body: formData,
      });

      const { scan_id } = await res.json();

      // Build deep link URL — Session 6 will have the app open to quiz step 1
      const url = `https://mch-agent-platform.vercel.app/quiz?source=scanner&scan_id=${scan_id}&width=${dimensions.widthFt}&length=${dimensions.lengthFt}&height=${dimensions.heightFt}`;
      await Linking.openURL(url);
    } catch (err) {
      alert('Could not send scan. Please try again.');
    } finally {
      setSending(false);
    }
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

        {/* 2D / 3D tab toggle */}
        <View style={styles.tabBar}>
          {(['2D Plan', '3D View'] as ViewTab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === tab && styles.tabButtonTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Floor plan card */}
        <View style={styles.floorPlanWrapper}>
          {activeTab === '2D Plan' ? (
            <FloorPlanSVG
              widthFt={dimensions.widthFt}
              lengthFt={dimensions.lengthFt}
            />
          ) : (
            <Room3DView
              widthFt={dimensions.widthFt}
              lengthFt={dimensions.lengthFt}
              heightFt={dimensions.heightFt}
              style={{ width: '100%', height: 280 }}
            />
          )}
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
        <TouchableOpacity
          style={[styles.primaryButton, sending && { opacity: 0.6 }]}
          onPress={sendToMCH}
          disabled={sending}
        >
          <Text style={styles.primaryButtonText}>
            {sending ? 'Sending\u2026' : 'Send to MyClubHaus \u2192'}
          </Text>
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
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#f9fafb', marginBottom: 16 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#111f16',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f3a26',
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#4ade80',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  tabButtonTextActive: {
    color: '#0f1f14',
  },
  floorPlanWrapper: {
    backgroundColor: '#0a1a0f',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f3a26',
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
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
