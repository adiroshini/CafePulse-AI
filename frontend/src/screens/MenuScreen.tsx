import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ── Brand palette ─────────────────────────────────────────────────────────────
const C = {
  primary: '#32170d', primaryContainer: '#4b2c20', onPrimary: '#ffffff',
  onPrimaryContainer: '#bf9282', tertiaryContainer: '#003c27',
  onTertiaryContainer: '#6ba98a', tertiaryFixed: '#b1f0ce',
  error: '#ba1a1a', errorContainer: '#ffdad6',
  secondary: '#605e5b', secondaryContainer: '#e6e2de',
  surface: '#f8f9ff', surfaceContainer: '#e6eeff',
  surfaceContainerHigh: '#dee9fc', surfaceContainerLow: '#eff4ff',
  surfaceContainerLowest: '#ffffff', surfaceContainerHighest: '#d9e3f6',
  onSurface: '#121c2a', onSurfaceVariant: '#504440',
  outlineVariant: '#d5c3bd', outline: '#83746f',
  amber: '#ff9800', background: '#F5F1ED',
  onSecondaryFixed: '#1c1c19',
};

const SIDEBAR_W = 200;

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar() {
  const items = [
    { icon: 'grid-outline', label: 'Dashboard' },
    { icon: 'bar-chart-outline', label: 'Review Intelligence' },
    { icon: 'restaurant', label: 'Menu Studio', active: true },
    { icon: 'settings-outline', label: 'Operations' },
    { icon: 'trending-up-outline', label: 'What-If Simulator' },
  ];
  return (
    <View style={sb.bar}>
      <View style={sb.brand}>
        <Ionicons name="cafe" size={22} color={C.primary} />
        <Text style={sb.brandName}>CafePulse AI</Text>
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
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20, paddingHorizontal: 4 },
  brandName: { fontSize: 15, fontWeight: '900', color: C.primary },
  item: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9, paddingHorizontal: 8, borderRadius: 8, marginBottom: 2, position: 'relative' },
  itemActive: { backgroundColor: C.surfaceContainerHigh },
  label: { fontSize: 11, color: C.secondary, flex: 1 },
  labelActive: { color: C.primary, fontWeight: '700' },
  activeBar: { position: 'absolute', right: 0, top: 4, bottom: 4, width: 3, backgroundColor: C.primary, borderRadius: 2 },
  voiceBtn: { marginTop: 24, backgroundColor: C.primary, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10 },
  voiceBtnText: { fontSize: 11, fontWeight: '700', color: C.onPrimary },
});

// ── Performance Table ─────────────────────────────────────────────────────────
const TABLE_DATA = [
  { initial: 'L', name: 'Oat Milk Latte', sales: '1,240', margin: '72%', trend: 'trending-up', trendColor: C.onTertiaryContainer, status: 'High Performer', statusType: 'healthy' },
  { initial: 'B', name: 'Artisan Brownie', sales: '412', margin: '65%', trend: 'remove-outline', trendColor: C.secondary, status: 'Stable', statusType: 'healthy' },
  { initial: 'A', name: 'Avocado Toast', sales: '189', margin: '24%', trend: 'trending-down', trendColor: C.error, status: 'Review Cost', statusType: 'warning' },
  { initial: 'C', name: 'Cappuccino', sales: '980', margin: '68%', trend: 'trending-up', trendColor: C.onTertiaryContainer, status: 'High Performer', statusType: 'healthy' },
  { initial: 'G', name: 'Green Tea', sales: '95', margin: '18%', trend: 'trending-down', trendColor: C.error, status: 'Review Cost', statusType: 'warning' },
];

// ── Experiment Cards ──────────────────────────────────────────────────────────
const EXPERIMENTS = [
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBOm1vYsqTqEjigPr2-p8n1XqBrhKSkQ8Od2B8k3YnwKphShDHzjZN1pt5kU1B6T5-1XuT-5t3hkyVnYmruo0vcwVicF4fQr_PBwiyazJxxst1NKyi1_8tEidXW_FJkkZcWB6bAT4rz5bIybYZ40vPZP8KCDbsRaBn2oGtuqm-5wMla8uC8EOXXH_rlugRUB6X3ZwPn6_Nnd3XqhIbV7OJeaVr5FeJjFlu5zDofpmeZ-JoeUJ31Ki4U7pNKoFr8P_jNoobsQP7PgX8',
    title: 'Latte + Brownie Combo',
    badge: 'High Potential', badgeColor: C.onTertiaryContainer, badgeBg: C.tertiaryFixed,
    desc: 'AI predicts a 15% increase in AOV by bundling these two high-margin items after 2 PM.',
    metric: 'Expected Lift: +₹180/order',
    metricIcon: 'analytics-outline',
    borderColor: C.onTertiaryContainer,
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1u98cugvvKPwoRR8It_dGlCkV6XgbcF-gXi7Q-hyGEYpSI_Zfq0kqSD8CllLPU1T27OhyJ2yKyWgXfPu2XFvtLdYHbrJbaQRPgId9_OwxQIZCY2HmtEVdfPSuNrZqMrxi-87auUI6DJCijPd8M5B9fO041vD-bMd0grgD-6BSi3egIg4QJR9S1tbI6hfED64_j1uqmLzP-Wj2BWPh0PCSiD5n0sAK3RI5Te85i7LLweaThbFEyWDGdV-DJ-lvg4XLOyovJ4qSk91N',
    title: 'Free Sample Campaign',
    badge: 'Awareness', badgeColor: C.secondary, badgeBg: C.surfaceContainerHighest,
    desc: 'Offer small samples of Ethiopian Roast to drip coffee buyers. Aim to convert 10% to premium bags.',
    metric: 'Target: Regulars',
    metricIcon: 'people-outline',
    borderColor: C.primary,
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALSonQqq6uxbK5JtxMkgzu2Uq0XijQy5pDdcSO6wZq9yjpu8V7qtB5l63v_DcFoK-9vUcsacXRxp_PfDXsarnV-McjxgKkiNOpHrAEOqaZze3HvAts7lD-_6i-3La9V4kVVfzZoTzn6xxnXsxsYW3bPgwn6Acb2jccTmxlSCtP9LeSMN4_bwHkGIcmd4Qq3QAEtcboQxBIxE-7RfcHGLrGJFGauF6PhL2YK8ugYIwPUeNO2Mk2Rp9vE3g4YBAbHc-wSinEXtU-wZxW',
    title: 'Menu Layout A/B Test',
    badge: 'UX Optimization', badgeColor: C.onPrimaryContainer, badgeBg: C.primaryContainer + '20',
    desc: 'Test moving high-margin Specialty Brews to the top of the digital menu board.',
    metric: 'Metric: View-to-Order %',
    metricIcon: 'eye-outline',
    borderColor: C.onPrimaryContainer,
  },
];

// ── Active Experiments ────────────────────────────────────────────────────────
const ACTIVE_EXPERIMENTS = [
  {
    title: '"Eco-Friendly" Cup Surcharge',
    status: 'Keep', statusType: 'healthy',
    desc: 'Testing customer tolerance for a ₹12 sustainable packaging fee.',
    progress: 85, progressLabel: '12/14 Days',
    roi: '+4.2%', roiColor: C.onTertiaryContainer,
  },
  {
    title: 'Vegan Pastry Bundle',
    status: 'Improve', statusType: 'neutral',
    desc: 'Cross-selling oat milk drinks with vegan croissants.',
    progress: 28, progressLabel: '4/14 Days',
    roi: '–1.1%', roiColor: C.primary,
  },
];

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function MenuScreen() {
  const [launched, setLaunched] = useState<string[]>([]);

  const handleLaunch = (title: string) => {
    setLaunched(prev => [...prev, title]);
    Alert.alert('Experiment Launched!', `"${title}" is now active. Check back in 1–2 weeks for results.`);
  };

  return (
    <View style={s.root}>
      <Sidebar />

      <View style={{ flex: 1 }}>
        {/* Top Nav */}
        <View style={s.topNav}>
          <View style={s.searchBar}>
            <Ionicons name="search-outline" size={14} color={C.secondary} />
            <TextInput style={s.searchInput} placeholder="Search menu items or experiments..." placeholderTextColor={C.secondary} />
          </View>
          <View style={s.topRight}>
            <Ionicons name="notifications-outline" size={20} color={C.secondary} />
            <Ionicons name="happy-outline" size={20} color={C.secondary} />
            <Ionicons name="person-circle-outline" size={22} color={C.secondary} />
            <Text style={s.cafeName}>Morning Brew Cafe</Text>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={s.canvas}>

          {/* Page Header */}
          <View style={s.pageHeader}>
            <View style={{ flex: 1 }}>
              <Text style={s.pageTitle}>Menu Studio</Text>
              <Text style={s.pageSubtitle}>Design, test, and optimize your offerings with AI-driven experimentation.</Text>
            </View>
            <View style={s.headerBtns}>
              <TouchableOpacity style={s.outlineBtn}>
                <Ionicons name="download-outline" size={13} color={C.primary} />
                <Text style={s.outlineBtnText}>Export</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.solidBtn}>
                <Ionicons name="add" size={14} color={C.onPrimary} />
                <Text style={s.solidBtnText}>New Experiment</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Row 1: AI Insights + Performance Table ── */}
          <View style={s.row}>

            {/* AI Pulse Insights */}
            <View style={[s.card, { flex: 1, minWidth: 200 }]}>
              <View style={s.cardTitleRow}>
                <View style={s.psyIcon}>
                  <Ionicons name="bulb-outline" size={16} color={C.onTertiaryContainer} />
                </View>
                <Text style={s.cardTitle}>AI Pulse Insights</Text>
              </View>
              <View style={s.insightBlock}>
                <View style={s.insightBorderGreen} />
                <Text style={s.insightText}>
                  "Customers who buy <Text style={s.bold}>Pizza</Text> also buy{' '}
                  <Text style={s.bold}>Garlic Bread</Text> 84% of the time. Consider a 'Friday Night' combo."
                </Text>
              </View>
              <View style={[s.insightBlock, { marginTop: 8 }]}>
                <View style={[s.insightBorderGreen, { backgroundColor: C.onPrimaryContainer }]} />
                <Text style={s.insightText}>
                  "Cold Brew peaks 2–4 PM. A{' '}
                  <Text style={s.bold}>'Happy Hour' discount</Text> could increase volume by 12%."
                </Text>
              </View>
              <TouchableOpacity style={s.linkBtn}>
                <Text style={s.linkBtnText}>View all correlations</Text>
              </TouchableOpacity>
            </View>

            {/* Performance Table */}
            <View style={[s.card, { flex: 2, padding: 0, overflow: 'hidden' }]}>
              <View style={s.tableHeader}>
                <Text style={s.cardTitle}>Menu Item Performance</Text>
                <View style={s.tablePeriod}>
                  <Text style={s.tablePeriodText}>Last 30 Days</Text>
                  <Ionicons name="filter-outline" size={16} color={C.secondary} />
                </View>
              </View>
              {/* Column headers */}
              <View style={s.tableColHeaders}>
                {['ITEM', 'SALES', 'MARGIN', 'TREND', 'STATUS'].map(h => (
                  <Text key={h} style={[s.colHeader, h === 'ITEM' && { flex: 2 }]}>{h}</Text>
                ))}
              </View>
              {TABLE_DATA.map((row, i) => (
                <TouchableOpacity key={i} style={[s.tableRow, i % 2 === 0 && s.tableRowAlt]}>
                  <View style={[s.tableCell, { flex: 2, flexDirection: 'row', alignItems: 'center', gap: 8 }]}>
                    <View style={s.initialBox}>
                      <Text style={s.initialText}>{row.initial}</Text>
                    </View>
                    <Text style={s.itemName} numberOfLines={1}>{row.name}</Text>
                  </View>
                  <Text style={[s.tableCell, s.cellBold]}>{row.sales}</Text>
                  <Text style={[s.tableCell, s.cellBold, { color: row.statusType === 'warning' ? C.error : C.onTertiaryContainer }]}>{row.margin}</Text>
                  <View style={s.tableCell}>
                    <Ionicons name={row.trend as any} size={16} color={row.trendColor} />
                  </View>
                  <View style={s.tableCell}>
                    <View style={[
                      s.statusPill,
                      { backgroundColor: row.statusType === 'healthy' ? 'rgba(107,169,138,0.12)' : 'rgba(186,26,26,0.1)' },
                    ]}>
                      <Text style={[
                        s.statusPillText,
                        { color: row.statusType === 'healthy' ? '#0e5138' : C.error },
                      ]}>
                        {row.status}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── Suggested Experiments ── */}
          <View style={s.sectionHeader}>
            <Ionicons name="flask-outline" size={20} color={C.primary} />
            <Text style={s.sectionTitle}>Suggested Experiments</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.expScroll}>
            {EXPERIMENTS.map((exp, i) => (
              <View key={i} style={[s.expCard, { borderTopColor: exp.borderColor }]}>
                <Image source={{ uri: exp.image }} style={s.expImage} resizeMode="cover" />
                <View style={s.expBody}>
                  <View style={s.expTitleRow}>
                    <Text style={s.expTitle}>{exp.title}</Text>
                    <View style={[s.expBadge, { backgroundColor: exp.badgeBg }]}>
                      <Text style={[s.expBadgeText, { color: exp.badgeColor }]}>{exp.badge}</Text>
                    </View>
                  </View>
                  <Text style={s.expDesc}>{exp.desc}</Text>
                  <View style={s.expMetric}>
                    <Ionicons name={exp.metricIcon as any} size={13} color={C.primary} />
                    <Text style={s.expMetricText}>{exp.metric}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[s.launchBtn, launched.includes(exp.title) && s.launchBtnDone]}
                  onPress={() => handleLaunch(exp.title)}
                  disabled={launched.includes(exp.title)}
                >
                  <Text style={s.launchBtnText}>
                    {launched.includes(exp.title) ? '✓ Launched' : 'Launch Experiment'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* ── Active Experiments Tracker ── */}
          <View style={[s.card, { marginTop: 4 }]}>
            <View style={s.activeHeader}>
              <View style={s.activeHeaderLeft}>
                <Ionicons name="radio-button-on" size={18} color={C.primary} />
                <Text style={s.sectionTitle}>Active Experiments</Text>
              </View>
              <TouchableOpacity style={s.viewHistoryBtn}>
                <Text style={s.viewHistoryText}>View History</Text>
                <Ionicons name="arrow-forward" size={14} color={C.onTertiaryContainer} />
              </TouchableOpacity>
            </View>

            {ACTIVE_EXPERIMENTS.map((exp, i) => (
              <TouchableOpacity key={i} style={s.activeExpRow}>
                {/* Title + desc */}
                <View style={{ flex: 1 }}>
                  <View style={s.activeTitleRow}>
                    <Text style={s.activeTitle}>{exp.title}</Text>
                    <View style={[
                      s.statusPill,
                      { backgroundColor: exp.statusType === 'healthy' ? 'rgba(107,169,138,0.12)' : C.surfaceContainerHighest },
                    ]}>
                      <Text style={[
                        s.statusPillText,
                        { color: exp.statusType === 'healthy' ? '#0e5138' : C.secondary },
                      ]}>
                        {exp.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={s.activeDesc}>{exp.desc}</Text>
                </View>

                {/* Progress */}
                <View style={s.progressSection}>
                  <View style={s.progressHeader}>
                    <Text style={s.progressLabel}>Progress ({exp.progressLabel})</Text>
                    <Text style={s.progressPct}>{exp.progress}%</Text>
                  </View>
                  <View style={s.progressTrack}>
                    <View style={[
                      s.progressFill,
                      {
                        width: `${exp.progress}%` as any,
                        backgroundColor: exp.statusType === 'healthy' ? C.onTertiaryContainer : C.primary,
                      },
                    ]} />
                  </View>
                </View>

                {/* ROI */}
                <View style={s.roiSection}>
                  <Text style={s.roiLabel}>Est. ROI</Text>
                  <Text style={[s.roiValue, { color: exp.roiColor }]}>{exp.roi}</Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color={C.secondary} style={{ alignSelf: 'center' }} />
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </View>

      {/* FAB */}
      <TouchableOpacity style={s.fab}>
        <Ionicons name="sparkles" size={16} color={C.onPrimary} />
        <Text style={s.fabText}>Sarvam AI Assistant</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: C.background },

  // Top nav
  topNav: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.outlineVariant },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.surfaceContainerLow, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: C.outlineVariant, flex: 1, maxWidth: 260 },
  searchInput: { fontSize: 12, color: C.onSurface, flex: 1 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cafeName: { fontSize: 13, fontWeight: '800', color: C.primary },

  // Canvas
  canvas: { padding: 16, paddingBottom: 100 },

  // Page header
  pageHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 8 },
  pageTitle: { fontSize: 20, fontWeight: '900', color: C.primary },
  pageSubtitle: { fontSize: 12, color: C.secondary, marginTop: 3, lineHeight: 18 },
  headerBtns: { flexDirection: 'row', gap: 8 },
  outlineBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: C.outline, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8, backgroundColor: C.secondaryContainer },
  outlineBtnText: { fontSize: 11, fontWeight: '700', color: C.primary },
  solidBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.primary, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8 },
  solidBtnText: { fontSize: 11, fontWeight: '700', color: C.onPrimary },

  // Layout
  row: { flexDirection: 'row', gap: 12, marginBottom: 16, flexWrap: 'wrap' },
  card: {
    backgroundColor: C.surfaceContainerLowest, borderRadius: 12, padding: 14,
    shadowColor: '#4b2c20', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
  },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: C.primary },

  // AI Insights
  psyIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: C.tertiaryContainer + '18', justifyContent: 'center', alignItems: 'center' },
  insightBlock: { flexDirection: 'row', backgroundColor: C.surfaceContainerLow, borderRadius: 8, padding: 10, gap: 8 },
  insightBorderGreen: { width: 3, borderRadius: 2, backgroundColor: C.onTertiaryContainer },
  insightText: { flex: 1, fontSize: 12, color: C.primary, fontStyle: 'italic', lineHeight: 18 },
  bold: { fontWeight: '800', fontStyle: 'normal' },
  linkBtn: { marginTop: 10, alignItems: 'center' },
  linkBtnText: { fontSize: 12, color: C.primary, fontWeight: '700', textDecorationLine: 'underline' },

  // Performance table
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: C.outlineVariant },
  tablePeriod: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tablePeriodText: { fontSize: 10, color: C.secondary, backgroundColor: C.surfaceContainerHighest, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, fontWeight: '600' },
  tableColHeaders: { flexDirection: 'row', backgroundColor: C.surfaceContainerLow, paddingHorizontal: 12, paddingVertical: 6 },
  colHeader: { flex: 1, fontSize: 9, fontWeight: '800', color: C.secondary, letterSpacing: 0.8, textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10 },
  tableRowAlt: { backgroundColor: C.surfaceContainerLowest },
  tableCell: { flex: 1, fontSize: 12, color: C.onSurface },
  cellBold: { fontWeight: '700' },
  initialBox: { width: 28, height: 28, borderRadius: 6, backgroundColor: C.primaryContainer + '20', justifyContent: 'center', alignItems: 'center' },
  initialText: { fontSize: 12, fontWeight: '900', color: C.primary },
  itemName: { fontSize: 12, color: C.onSurface, fontWeight: '500', flex: 1 },
  statusPill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999 },
  statusPillText: { fontSize: 9, fontWeight: '800' },

  // Section title
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: C.primary },

  // Experiment cards (horizontal scroll)
  expScroll: { gap: 12, paddingBottom: 4, paddingRight: 16 },
  expCard: {
    width: 240, backgroundColor: C.surfaceContainerLowest, borderRadius: 12, overflow: 'hidden',
    borderTopWidth: 4,
    shadowColor: '#4b2c20', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
  },
  expImage: { width: '100%', height: 130 },
  expBody: { padding: 12, flex: 1 },
  expTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 6 },
  expTitle: { fontSize: 13, fontWeight: '800', color: C.primary, flex: 1 },
  expBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  expBadgeText: { fontSize: 8, fontWeight: '900', textTransform: 'uppercase' },
  expDesc: { fontSize: 11, color: C.secondary, lineHeight: 16, marginBottom: 8 },
  expMetric: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  expMetricText: { fontSize: 11, fontWeight: '600', color: C.primary },
  launchBtn: { margin: 12, marginTop: 0, backgroundColor: C.primary, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  launchBtnDone: { backgroundColor: C.onTertiaryContainer },
  launchBtnText: { fontSize: 12, fontWeight: '800', color: C.onPrimary },

  // Active experiments
  activeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  activeHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  viewHistoryBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewHistoryText: { fontSize: 12, color: C.onTertiaryContainer, fontWeight: '700' },
  activeExpRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 12, borderRadius: 10, borderWidth: 1, borderColor: C.outlineVariant,
    marginBottom: 10, flexWrap: 'wrap',
  },
  activeTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
  activeTitle: { fontSize: 13, fontWeight: '800', color: C.primary, flex: 1 },
  activeDesc: { fontSize: 11, color: C.secondary, lineHeight: 16 },
  progressSection: { width: 140 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { fontSize: 9, color: C.secondary, fontWeight: '600' },
  progressPct: { fontSize: 9, color: C.primary, fontWeight: '800' },
  progressTrack: { height: 6, backgroundColor: C.surfaceContainerHighest, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  roiSection: { alignItems: 'flex-end' },
  roiLabel: { fontSize: 9, color: C.secondary, fontWeight: '600' },
  roiValue: { fontSize: 16, fontWeight: '900' },

  // FAB
  fab: {
    position: 'absolute', bottom: 20, right: 20,
    backgroundColor: C.primary, borderRadius: 999,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 10, elevation: 8,
  },
  fabText: { fontSize: 12, fontWeight: '700', color: C.onPrimary },
});
