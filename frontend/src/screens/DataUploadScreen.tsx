import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const C = {
  primary: '#32170d', primaryContainer: '#4b2c20', onPrimary: '#ffffff',
  onPrimaryContainer: '#bf9282', onTertiaryContainer: '#6ba98a',
  tertiaryFixed: '#b1f0ce', onTertiaryFixedVariant: '#0e5138',
  error: '#ba1a1a', errorContainer: '#ffdad6',
  secondary: '#605e5b', secondaryContainer: '#e6e2de',
  surface: '#f8f9ff', surfaceContainerLow: '#eff4ff',
  surfaceContainerLowest: '#ffffff', surfaceContainerHighest: '#d9e3f6',
  onSurface: '#121c2a', onSurfaceVariant: '#504440',
  outlineVariant: '#d5c3bd', amber: '#ffb300', background: '#F5F1ED',
};

const DATA_SOURCES = [
  { icon: 'receipt-outline' as const, tag: 'SALES', tagColor: C.onTertiaryFixedVariant, tagBg: C.tertiaryFixed, title: 'POS Sales Data', desc: 'Upload daily sales CSV from your point-of-sale system.', btnText: 'Upload CSV' },
  { icon: 'chatbubble-outline' as const, tag: 'REVIEWS', tagColor: '#4285F4', tagBg: '#e8f0fe', title: 'Customer Reviews', desc: 'Sync reviews from Google, Zomato, and Swiggy.', btnText: 'Connect API' },
  { icon: 'cube-outline' as const, tag: 'STOCK', tagColor: C.amber, tagBg: '#fff8e1', title: 'Inventory Stock', desc: 'Upload ingredient and stock level data.', btnText: 'Upload Sheet' },
  { icon: 'people-outline' as const, tag: 'FEEDBACK', tagColor: C.error, tagBg: C.errorContainer, title: 'Staff Feedback', desc: 'Internal feedback forms and shift reports.', btnText: 'Upload Form' },
];

const PIPELINE_STEPS = [
  { label: 'Cleaning Data', sublabel: 'Completed', status: 'done', opacity: 1 },
  { label: 'Sarvam AI', sublabel: 'Processing...', status: 'processing', opacity: 1 },
  { label: 'Neo4j Mapping', sublabel: 'Queued', status: 'queued', opacity: 0.6 },
  { label: 'Dashboard', sublabel: 'Pending', status: 'pending', opacity: 0.4 },
];

const CONNECTED_SOURCES = [
  { icon: 'receipt-outline' as const, title: 'POS Sales Feed', meta: 'Last sync: 10 min ago · 46 records', badgeText: 'SYNCED', badgeColor: C.onTertiaryFixedVariant, badgeBg: C.tertiaryFixed },
  { icon: 'star-outline' as const, title: 'Google Reviews', meta: 'Live · 10 reviews today', badgeText: 'LIVE', badgeColor: '#4285F4', badgeBg: '#e8f0fe' },
  { icon: 'archive-outline' as const, title: 'Old Zomato Export', meta: 'Archived · June 2024', badgeText: 'ARCHIVED', badgeColor: C.secondary, badgeBg: C.secondaryContainer },
];

export default function DataUploadScreen() {
  const [uploaded, setUploaded] = useState<number[]>([]);

  const toggleUpload = (i: number) => {
    setUploaded(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const stepColor = (status: string) => {
    if (status === 'done') return C.onTertiaryContainer;
    if (status === 'processing') return C.amber;
    return C.secondary;
  };

  const stepIcon = (status: string) => {
    if (status === 'done') return 'checkmark-circle' as const;
    if (status === 'processing') return 'sync-outline' as const;
    return 'ellipse-outline' as const;
  };

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.pageTitle}>Data Pipeline</Text>
          <Text style={s.pageSubtitle}>Connect your café data sources</Text>
        </View>
        <TouchableOpacity style={s.analyzeBtn}>
          <Ionicons name="flash-outline" size={14} color={C.onPrimary} />
          <Text style={s.analyzeBtnText}>Analyze</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Data Source Cards */}
        {DATA_SOURCES.map((src, i) => (
          <View key={i} style={[s.sourceCard, { borderTopColor: C.onTertiaryContainer }]}>
            <View style={s.sourceCardTop}>
              <View style={s.sourceIconBox}>
                <Ionicons name={src.icon} size={20} color={C.primary} />
              </View>
              <View style={s.sourceInfo}>
                <View style={s.sourceTagRow}>
                  <View style={[s.tagBadge, { backgroundColor: src.tagBg }]}>
                    <Text style={[s.tagBadgeText, { color: src.tagColor }]}>{src.tag}</Text>
                  </View>
                </View>
                <Text style={s.sourceTitle}>{src.title}</Text>
                <Text style={s.sourceDesc}>{src.desc}</Text>
              </View>
            </View>

            {/* Upload Zone */}
            <TouchableOpacity style={[s.uploadZone, uploaded.includes(i) && s.uploadZoneDone]} onPress={() => toggleUpload(i)}>
              <Ionicons name={uploaded.includes(i) ? 'checkmark-circle-outline' : 'cloud-upload-outline'} size={20} color={uploaded.includes(i) ? C.onTertiaryFixedVariant : C.secondary} />
              <Text style={[s.uploadZoneText, uploaded.includes(i) && { color: C.onTertiaryFixedVariant }]}>
                {uploaded.includes(i) ? 'File uploaded ✓' : 'Tap to mark as uploaded'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.actionBtn}>
              <Text style={s.actionBtnText}>{src.btnText}</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Live Analysis Pipeline */}
        <Text style={s.sectionTitle}>Live Analysis Pipeline</Text>
        <View style={s.pipelineCard}>
          <View style={s.pipelineSteps}>
            {PIPELINE_STEPS.map((step, i) => (
              <React.Fragment key={i}>
                <View style={[s.pipelineStep, { opacity: step.opacity }]}>
                  <Ionicons name={stepIcon(step.status)} size={22} color={stepColor(step.status)} />
                  <Text style={[s.pipelineLabel, { color: stepColor(step.status) }]}>{step.label}</Text>
                  <Text style={s.pipelineSublabel}>{step.sublabel}</Text>
                </View>
                {i < PIPELINE_STEPS.length - 1 && (
                  <View style={[s.connector, { opacity: i < 1 ? 1 : 0.4 }]} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Connected Sources */}
        <Text style={s.sectionTitle}>Connected Sources</Text>
        {CONNECTED_SOURCES.map((cs, i) => (
          <View key={i} style={s.connectedRow}>
            <View style={s.connectedIconBox}>
              <Ionicons name={cs.icon} size={18} color={C.primary} />
            </View>
            <View style={s.connectedInfo}>
              <Text style={s.connectedTitle}>{cs.title}</Text>
              <Text style={s.connectedMeta}>{cs.meta}</Text>
            </View>
            <View style={[s.statusBadge, { backgroundColor: cs.badgeBg }]}>
              <Text style={[s.statusBadgeText, { color: cs.badgeColor }]}>{cs.badgeText}</Text>
            </View>
            <TouchableOpacity style={s.connectedAction}>
              <Ionicons name="settings-outline" size={16} color={C.secondary} />
            </TouchableOpacity>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.outlineVariant },
  pageTitle: { fontSize: 18, fontWeight: '900', color: C.primary },
  pageSubtitle: { fontSize: 11, color: C.secondary, marginTop: 2 },
  analyzeBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  analyzeBtnText: { fontSize: 12, fontWeight: '800', color: C.onPrimary },
  content: { padding: 14 },
  sourceCard: { backgroundColor: C.surfaceContainerLowest, borderRadius: 14, padding: 14, marginBottom: 12, borderTopWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  sourceCardTop: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  sourceIconBox: { width: 42, height: 42, borderRadius: 12, backgroundColor: C.primaryContainer + '20', justifyContent: 'center', alignItems: 'center' },
  sourceInfo: { flex: 1 },
  sourceTagRow: { marginBottom: 4 },
  tagBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start' },
  tagBadgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  sourceTitle: { fontSize: 14, fontWeight: '800', color: C.primary, marginBottom: 2 },
  sourceDesc: { fontSize: 11, color: C.secondary, lineHeight: 16 },
  uploadZone: { borderWidth: 1.5, borderColor: C.outlineVariant, borderStyle: 'dashed', borderRadius: 10, padding: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 10 },
  uploadZoneDone: { borderColor: C.onTertiaryContainer, backgroundColor: C.tertiaryFixed + '20' },
  uploadZoneText: { fontSize: 12, color: C.secondary, fontWeight: '600' },
  actionBtn: { backgroundColor: C.primary, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  actionBtnText: { fontSize: 13, fontWeight: '800', color: C.onPrimary },
  sectionTitle: { fontSize: 15, fontWeight: '900', color: C.onSurface, marginBottom: 12 },
  pipelineCard: { backgroundColor: C.surfaceContainerLowest, borderRadius: 14, padding: 14, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  pipelineSteps: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pipelineStep: { alignItems: 'center', flex: 1 },
  pipelineLabel: { fontSize: 10, fontWeight: '800', marginTop: 4, textAlign: 'center' },
  pipelineSublabel: { fontSize: 9, color: C.secondary, marginTop: 2, textAlign: 'center' },
  connector: { width: 20, height: 2, backgroundColor: C.outlineVariant, marginBottom: 10 },
  connectedRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surfaceContainerLowest, borderRadius: 12, padding: 12, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  connectedIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.primaryContainer + '20', justifyContent: 'center', alignItems: 'center' },
  connectedInfo: { flex: 1 },
  connectedTitle: { fontSize: 13, fontWeight: '700', color: C.onSurface },
  connectedMeta: { fontSize: 10, color: C.secondary, marginTop: 1 },
  statusBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  statusBadgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.4 },
  connectedAction: { padding: 4 },
});
