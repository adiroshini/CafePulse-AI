import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const C = {
  primary: '#32170d', primaryContainer: '#4b2c20', onPrimary: '#ffffff',
  onPrimaryContainer: '#bf9282', tertiaryContainer: '#003c27',
  onTertiaryContainer: '#6ba98a', tertiaryFixed: '#b1f0ce',
  onTertiaryFixed: '#002114', onTertiaryFixedVariant: '#0e5138',
  error: '#ba1a1a', errorContainer: '#ffdad6',
  secondary: '#605e5b', secondaryContainer: '#e6e2de',
  surface: '#f8f9ff', surfaceContainer: '#e6eeff',
  surfaceContainerHigh: '#dee9fc', surfaceContainerLow: '#eff4ff',
  surfaceContainerLowest: '#ffffff', surfaceContainerHighest: '#d9e3f6',
  onSurface: '#121c2a', onSurfaceVariant: '#504440',
  outlineVariant: '#d5c3bd', outline: '#83746f',
  background: '#F5F1ED',
};

const SIDEBAR_W = 200;

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar() {
  const items = [
    { icon: 'grid-outline', label: 'Dashboard' },
    { icon: 'bar-chart-outline', label: 'Review Intelligence' },
    { icon: 'restaurant-outline', label: 'Menu Studio' },
    { icon: 'settings', label: 'Operations', active: true },
    { icon: 'trending-up-outline', label: 'What-If Simulator' },
  ];
  return (
    <View style={sb.bar}>
      <View style={sb.brand}>
        <View style={sb.brandIcon}>
          <Ionicons name="cafe" size={20} color={C.onPrimary} />
        </View>
        <View>
          <Text style={sb.brandName}>CafePulse AI</Text>
          <Text style={sb.brandSub}>INTELLIGENT BREWING</Text>
        </View>
      </View>
      {items.map(item => (
        <TouchableOpacity key={item.label} style={[sb.item, item.active && sb.itemActive]}>
          <Ionicons name={item.icon as any} size={17} color={item.active ? C.primary : C.secondary} />
          <Text style={[sb.label, item.active && sb.labelActive]} numberOfLines={1}>{item.label}</Text>
          {item.active && <View style={sb.activeBar} />}
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={sb.voiceBtn}>
        <Ionicons name="mic" size={16} color={C.onPrimary} />
        <Text style={sb.voiceBtnText}>Voice Assistant</Text>
      </TouchableOpacity>
    </View>
  );
}
const sb = StyleSheet.create({
  bar: { width: SIDEBAR_W, backgroundColor: C.surfaceContainerLow, paddingVertical: 20, paddingHorizontal: 10, borderRightWidth: 1, borderRightColor: C.outlineVariant },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20, paddingHorizontal: 4 },
  brandIcon: { width: 36, height: 36, borderRadius: 8, backgroundColor: C.primaryContainer, justifyContent: 'center', alignItems: 'center' },
  brandName: { fontSize: 13, fontWeight: '900', color: C.primary },
  brandSub: { fontSize: 7, color: C.secondary, letterSpacing: 1.5, marginTop: 1 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9, paddingHorizontal: 8, borderRadius: 8, marginBottom: 2, position: 'relative' },
  itemActive: { backgroundColor: C.surfaceContainerHigh },
  label: { fontSize: 11, color: C.secondary, flex: 1 },
  labelActive: { color: C.primary, fontWeight: '700' },
  activeBar: { position: 'absolute', right: 0, top: 4, bottom: 4, width: 3, backgroundColor: C.primary, borderRadius: 2 },
  voiceBtn: { marginTop: 24, backgroundColor: C.primary, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12 },
  voiceBtnText: { fontSize: 12, fontWeight: '700', color: C.onPrimary },
});

// ── Data Source Cards ─────────────────────────────────────────────────────────
const DATA_CARDS = [
  { icon: 'analytics-outline', tag: 'SALES', title: 'Sales Data', desc: 'Revenue, Orders, Product Sales mix logs.', uploadLabel: 'Drop CSV/JSON', uploadIcon: 'cloud-upload-outline', btnLabel: 'Analyze Sales', btnStyle: 'solid' },
  { icon: 'star-half-outline', tag: 'REVIEWS', title: 'Customer Reviews', desc: 'Google, Zomato, Swiggy, Manual entries.', uploadLabel: 'Connect API or Upload', uploadIcon: 'git-network-outline', btnLabel: 'Fetch Reviews', btnStyle: 'outline' },
  { icon: 'cube-outline', tag: 'STOCK', title: 'Inventory Data', desc: 'Ingredients, Stock Levels, Purchase logs.', uploadLabel: 'Drop Inventory Logs', uploadIcon: 'document-text-outline', btnLabel: 'Sync Inventory', btnStyle: 'solid' },
  { icon: 'chatbubbles-outline', tag: 'FEEDBACK', title: 'Customer Feedback', desc: 'Direct Ratings, Loyalty Apps, Feedback Forms.', uploadLabel: null, uploadIcon: null, btnLabel: 'Process Feedback', btnStyle: 'outline' },
];

// ── Pipeline Steps ────────────────────────────────────────────────────────────
const PIPELINE = [
  { icon: 'checkmark-circle', label: 'Cleaning Data', status: 'Completed', statusColor: C.onTertiaryContainer, bg: C.tertiaryFixed, opacity: 1 },
  { icon: 'flash', label: 'AI Analysis\nSarvam AI', status: 'Processing...', statusColor: C.primaryContainer, bg: '#ffdbce', opacity: 1 },
  { icon: 'git-network-outline', label: 'Relationship Mapping\nNeo4j', status: 'Queued', statusColor: C.secondary, bg: C.surfaceContainer, opacity: 0.6 },
  { icon: 'grid-outline', label: 'Dashboard Ready', status: 'Pending', statusColor: C.outline, bg: C.surfaceContainerLow, opacity: 0.4 },
];

// ── Connected Sources ─────────────────────────────────────────────────────────
const SOURCES = [
  { icon: 'grid-outline', title: 'Sales Data: Daily_POS_Export.csv', meta: 'Uploaded today at 09:12 AM', count: '1,240 records', badge: 'SYNCHRONIZED', badgeBg: C.tertiaryFixed, badgeColor: C.onTertiaryFixedVariant, action: 'trash-outline' },
  { icon: 'git-network-outline', title: 'Google Reviews API', meta: 'Last fetch: 2 hours ago', count: '452 reviews mapped', badge: 'LIVE API', badgeBg: C.tertiaryFixed, badgeColor: C.onTertiaryFixedVariant, action: 'settings-outline' },
  { icon: 'restaurant-outline', title: 'Inventory Data: Milk_Produce.xlsx', meta: 'Uploaded yesterday', count: '88 line items', badge: 'ARCHIVED', badgeBg: C.secondaryContainer, badgeColor: C.onSurfaceVariant, action: 'trash-outline' },
];

export default function DataUploadScreen() {
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});

  const handleUpload = (title: string) => {
    setUploaded(prev => ({ ...prev, [title]: true }));
  };

  return (
    <View style={s.root}>
      <Sidebar />

      <View style={{ flex: 1 }}>
        {/* Top Nav */}
        <View style={s.topNav}>
          <View style={s.searchBar}>
            <Ionicons name="search-outline" size={14} color={C.secondary} />
            <TextInput style={s.searchInput} placeholder="Search analytics or data logs..." placeholderTextColor={C.secondary} />
          </View>
          <View style={s.topRight}>
            <Text style={s.cafeName}>Morning Brew Cafe</Text>
            <View style={{ position: 'relative' }}>
              <Ionicons name="notifications-outline" size={20} color={C.secondary} />
              <View style={s.notifDot} />
            </View>
            <Ionicons name="happy-outline" size={20} color={C.secondary} />
            <Ionicons name="person-circle-outline" size={22} color={C.secondary} />
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={s.canvas}>

          {/* Page Header */}
          <View style={s.pageHeader}>
            <Text style={s.pageTitle}>Data Connection &amp; Pipeline</Text>
            <Text style={s.pageSubtitle}>Fuel your business intelligence by syncing real-time coffee shop metrics.</Text>
          </View>

          {/* ── Data Source Cards ── */}
          <View style={s.cardsGrid}>
            {DATA_CARDS.map((card, i) => (
              <View key={i} style={s.dataCard}>
                {/* Card top */}
                <View style={s.dataCardTop}>
                  <Ionicons name={card.icon as any} size={28} color={C.primary} />
                  <View style={s.tagBadge}>
                    <Text style={s.tagBadgeText}>{card.tag}</Text>
                  </View>
                </View>
                <Text style={s.dataCardTitle}>{card.title}</Text>
                <Text style={s.dataCardDesc}>{card.desc}</Text>

                {/* Upload zone or tags */}
                {card.uploadLabel ? (
                  <TouchableOpacity
                    style={[s.uploadZone, uploaded[card.title] && s.uploadZoneDone]}
                    onPress={() => handleUpload(card.title)}
                  >
                    <Ionicons
                      name={card.uploadIcon as any}
                      size={22}
                      color={uploaded[card.title] ? C.onTertiaryContainer : C.outline}
                    />
                    <Text style={[s.uploadZoneText, uploaded[card.title] && { color: C.onTertiaryContainer }]}>
                      {uploaded[card.title] ? '✓ Uploaded' : card.uploadLabel}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={s.feedbackTags}>
                    <View style={s.feedbackTag}><Text style={s.feedbackTagText}>Form #102 Active</Text></View>
                    <View style={s.feedbackTag}><Text style={s.feedbackTagText}>SMS Polling On</Text></View>
                  </View>
                )}

                {/* Button */}
                <TouchableOpacity style={card.btnStyle === 'solid' ? s.solidBtn : s.outlineBtn}>
                  <Text style={card.btnStyle === 'solid' ? s.solidBtnText : s.outlineBtnText}>
                    {card.btnLabel}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* ── Live Analysis Pipeline ── */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Live Analysis Pipeline</Text>
              <View style={s.liveRow}>
                <View style={s.liveDot} />
                <Text style={s.liveText}>REAL-TIME SYNCING</Text>
              </View>
            </View>

            <View style={s.pipeline}>
              {PIPELINE.map((step, i) => (
                <View key={i} style={[s.pipelineStep, { opacity: step.opacity }]}>
                  {/* Connector line */}
                  {i < PIPELINE.length - 1 && <View style={s.pipelineLine} />}
                  {/* Icon circle */}
                  <View style={[s.pipelineCircle, { backgroundColor: step.bg }]}>
                    <Ionicons name={step.icon as any} size={28} color={step.statusColor} />
                  </View>
                  {/* Label */}
                  <Text style={s.pipelineLabel}>{step.label}</Text>
                  <Text style={[s.pipelineStatus, { color: step.statusColor }]}>{step.status}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Connected Data Sources ── */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Connected Data Sources</Text>
              <TouchableOpacity>
                <Text style={s.exportLink}>Export Logs</Text>
              </TouchableOpacity>
            </View>

            {SOURCES.map((src, i) => (
              <TouchableOpacity key={i} style={s.sourceRow}>
                <View style={s.sourceIcon}>
                  <Ionicons name={src.icon as any} size={20} color={C.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.sourceTitle}>{src.title}</Text>
                  <Text style={s.sourceMeta}>
                    {src.meta} •{' '}
                    <Text style={{ fontWeight: '700', color: C.onTertiaryContainer }}>{src.count}</Text>
                  </Text>
                </View>
                <View style={[s.sourceBadge, { backgroundColor: src.badgeBg }]}>
                  <Text style={[s.sourceBadgeText, { color: src.badgeColor }]}>{src.badge}</Text>
                </View>
                <TouchableOpacity style={s.sourceAction}>
                  <Ionicons name={src.action as any} size={18} color={C.secondary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </View>

      {/* Analyze FAB */}
      <TouchableOpacity style={s.fab}>
        <Ionicons name="rocket-outline" size={16} color={C.onPrimary} />
        <Text style={s.fabText}>Analyze My Business</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: C.background },

  // Top nav
  topNav: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.outlineVariant },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.surfaceContainerLow, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: C.outlineVariant, flex: 1, maxWidth: 240 },
  searchInput: { fontSize: 12, color: C.onSurface, flex: 1 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cafeName: { fontSize: 13, fontWeight: '800', color: C.onSurface },
  notifDot: { position: 'absolute', top: 0, right: 0, width: 7, height: 7, borderRadius: 4, backgroundColor: C.error },

  // Canvas
  canvas: { padding: 16, paddingBottom: 100 },
  pageHeader: { marginBottom: 16 },
  pageTitle: { fontSize: 20, fontWeight: '900', color: C.primary },
  pageSubtitle: { fontSize: 13, color: C.secondary, marginTop: 3, lineHeight: 19 },

  // Data cards grid
  cardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  dataCard: {
    flex: 1, minWidth: 160,
    backgroundColor: C.surfaceContainerLowest, borderRadius: 12,
    padding: 14, borderTopWidth: 4, borderTopColor: C.onTertiaryContainer,
    shadowColor: '#4b2c20', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
    justifyContent: 'space-between',
  },
  dataCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tagBadge: { backgroundColor: C.tertiaryFixed, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagBadgeText: { fontSize: 9, fontWeight: '900', color: C.onTertiaryFixedVariant, letterSpacing: 0.5 },
  dataCardTitle: { fontSize: 13, fontWeight: '800', color: C.primary, marginBottom: 4 },
  dataCardDesc: { fontSize: 11, color: C.secondary, lineHeight: 16, marginBottom: 10 },
  uploadZone: {
    borderWidth: 2, borderStyle: 'dashed', borderColor: C.outlineVariant,
    backgroundColor: C.surfaceContainerLow, borderRadius: 8, padding: 12,
    alignItems: 'center', gap: 4, marginBottom: 10,
  },
  uploadZoneDone: { borderColor: C.onTertiaryContainer, backgroundColor: C.tertiaryFixed + '30' },
  uploadZoneText: { fontSize: 10, color: C.outline, fontWeight: '600' },
  feedbackTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  feedbackTag: { backgroundColor: C.surfaceContainerLow, borderWidth: 1, borderColor: C.outlineVariant, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  feedbackTagText: { fontSize: 10, color: C.secondary },
  solidBtn: { backgroundColor: C.primary, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  solidBtnText: { fontSize: 12, fontWeight: '800', color: C.onPrimary },
  outlineBtn: { borderWidth: 1, borderColor: C.primary, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  outlineBtnText: { fontSize: 12, fontWeight: '800', color: C.primary },

  // Section
  section: {
    backgroundColor: C.surfaceContainerLowest, borderRadius: 16, padding: 16, marginBottom: 16,
    shadowColor: '#4b2c20', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '900', color: C.primary },
  exportLink: { fontSize: 12, fontWeight: '700', color: C.primary, textDecorationLine: 'underline' },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.tertiaryFixed },
  liveText: { fontSize: 9, fontWeight: '700', color: C.onTertiaryContainer, letterSpacing: 1.5 },

  // Pipeline
  pipeline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pipelineStep: { flex: 1, alignItems: 'center', position: 'relative' },
  pipelineLine: {
    position: 'absolute', top: 30, left: '50%', right: '-50%',
    height: 2, backgroundColor: C.outlineVariant,
    borderStyle: 'dashed',
  },
  pipelineCircle: {
    width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: C.surfaceContainerLowest,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, marginBottom: 8,
  },
  pipelineLabel: { fontSize: 10, fontWeight: '700', color: C.primary, textAlign: 'center', paddingHorizontal: 4 },
  pipelineStatus: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },

  // Sources
  sourceRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: C.outlineVariant, borderRadius: 12,
    padding: 12, marginBottom: 8,
  },
  sourceIcon: {
    width: 44, height: 44, borderRadius: 8, backgroundColor: C.surfaceContainerHigh,
    justifyContent: 'center', alignItems: 'center',
  },
  sourceTitle: { fontSize: 13, fontWeight: '700', color: C.primary },
  sourceMeta: { fontSize: 11, color: C.secondary, marginTop: 2 },
  sourceBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  sourceBadgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  sourceAction: { padding: 6 },

  // FAB
  fab: {
    position: 'absolute', bottom: 20, right: 20,
    backgroundColor: C.primary, borderRadius: 999,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 18, paddingVertical: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 10,
  },
  fabText: { fontSize: 13, fontWeight: '800', color: C.onPrimary },
});
