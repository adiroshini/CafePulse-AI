import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions, TextInput, Image,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { DEMO_DASHBOARD, DEMO_BUSINESS, DEMO_RECOMMENDATIONS } from '../mock/demoData';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = 220;

// ── Brand palette (from HTML theme) ──────────────────────────────────────────
const C = {
  primary:        '#32170d',
  primaryContainer:'#4b2c20',
  onPrimary:      '#ffffff',
  onPrimaryContainer: '#bf9282',
  tertiary:       '#002416',
  tertiaryContainer: '#003c27',
  onTertiaryContainer: '#6ba98a',
  tertiaryFixedDim: '#95d4b3',
  error:          '#ba1a1a',
  errorContainer: '#ffdad6',
  onErrorContainer:'#93000a',
  secondary:      '#605e5b',
  secondaryContainer:'#e6e2de',
  surface:        '#f8f9ff',
  surfaceContainer:'#e6eeff',
  surfaceContainerHigh:'#dee9fc',
  surfaceContainerLow:'#eff4ff',
  surfaceContainerLowest:'#ffffff',
  onSurface:      '#121c2a',
  onSurfaceVariant:'#504440',
  outlineVariant: '#d5c3bd',
  outline:        '#83746f',
  inverseSurface: '#27313f',
  inverseOnSurface:'#eaf1ff',
  amber:          '#ffb300',
  background:     '#F5F1ED',
};

// ── Gauge SVG (circular progress) ────────────────────────────────────────────
function CircularGauge({ score }: { score: number }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * score) / 100;
  const color = score >= 70 ? C.onTertiaryContainer : score >= 40 ? C.amber : C.error;

  return (
    <View style={gauge.wrapper}>
      <View style={gauge.circle}>
        {/* Background ring */}
        <View style={[gauge.ring, { borderColor: C.outlineVariant }]} />
        {/* Progress arc overlay — approximated with a filled arc color */}
        <View
          style={[
            gauge.progressArc,
            {
              borderColor: color,
              // Rotate to show progress: full = 360deg, partial = score/100 * 360
              transform: [{ rotate: `${(score / 100) * 360 - 180}deg` }],
            },
          ]}
        />
        <View style={gauge.inner}>
          <Text style={[gauge.scoreText, { color }]}>{score}</Text>
          <Text style={gauge.scoreLabel}>STABLE</Text>
        </View>
      </View>
    </View>
  );
}

const gauge = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  circle: { width: 120, height: 120, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute', width: 120, height: 120,
    borderRadius: 60, borderWidth: 10, borderColor: '#E5E7EB',
  },
  progressArc: {
    position: 'absolute', width: 120, height: 120,
    borderRadius: 60, borderWidth: 10,
    borderTopColor: 'transparent', borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  inner: { alignItems: 'center' },
  scoreText: { fontSize: 36, fontWeight: '900' },
  scoreLabel: { fontSize: 10, fontWeight: '700', color: C.secondary, letterSpacing: 1.5 },
});

// ── Sparkline (simple SVG-style line using View trick) ────────────────────────
function Sparkline() {
  const points = [22, 10, 18, 25, 12, 28, 30];
  const max = Math.max(...points);
  const H = 56, W = width - SIDEBAR_WIDTH - 200;
  return (
    <View style={{ height: H, flexDirection: 'row', alignItems: 'flex-end', gap: 2, marginTop: 8 }}>
      {points.map((p, i) => (
        <View
          key={i}
          style={{
            flex: 1, height: (p / max) * H,
            backgroundColor: C.error + '40',
            borderTopLeftRadius: 3, borderTopRightRadius: 3,
          }}
        />
      ))}
    </View>
  );
}

// ── Notification Card ─────────────────────────────────────────────────────────
function AlertCard({ icon, title, time, message, color }: {
  icon: string; title: string; time: string; message: string; color: string;
}) {
  return (
    <View style={[alertS.card, { borderLeftColor: color }]}>
      <View style={[alertS.iconBox, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={alertS.row}>
          <Text style={alertS.title}>{title}</Text>
          <Text style={alertS.time}>{time}</Text>
        </View>
        <Text style={alertS.message}>{message}</Text>
      </View>
    </View>
  );
}

const alertS = StyleSheet.create({
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 12, padding: 12,
    flexDirection: 'row', gap: 12,
    borderLeftWidth: 4,
    shadowColor: '#4b2c20', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
    marginBottom: 8,
  },
  iconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  title: { fontSize: 13, fontWeight: '700', color: C.onSurface },
  time: { fontSize: 10, color: C.secondary },
  message: { fontSize: 12, color: C.onSurfaceVariant, lineHeight: 18 },
});

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ active }: { active: string }) {
  const items = [
    { icon: 'grid-outline', label: 'Dashboard' },
    { icon: 'bar-chart-outline', label: 'Review Intelligence' },
    { icon: 'restaurant-outline', label: 'Menu Studio' },
    { icon: 'settings-outline', label: 'Operations' },
    { icon: 'trending-up-outline', label: 'What-If Simulator' },
  ];
  return (
    <View style={sb.sidebar}>
      <View style={sb.brand}>
        <Text style={sb.brandName}>CafePulse AI</Text>
        <Text style={sb.brandSub}>INTELLIGENT BREWING</Text>
      </View>
      {items.map((item) => {
        const isActive = item.label === active;
        return (
          <TouchableOpacity
            key={item.label}
            style={[sb.navItem, isActive && sb.navItemActive]}
          >
            <Ionicons
              name={item.icon as any}
              size={20}
              color={isActive ? C.primary : C.secondary}
            />
            <Text style={[sb.navLabel, isActive && sb.navLabelActive]}>
              {item.label}
            </Text>
            {isActive && <View style={sb.activeBar} />}
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity style={sb.voiceBtn}>
        <Ionicons name="mic" size={18} color={C.onPrimaryContainer} />
        <Text style={sb.voiceBtnText}>Voice Assistant</Text>
      </TouchableOpacity>
    </View>
  );
}

const sb = StyleSheet.create({
  sidebar: {
    width: SIDEBAR_WIDTH, backgroundColor: C.surfaceContainerLow,
    paddingVertical: 24, paddingHorizontal: 12,
    borderRightWidth: 1, borderRightColor: C.outlineVariant,
  },
  brand: { marginBottom: 24, paddingHorizontal: 8 },
  brandName: { fontSize: 18, fontWeight: '900', color: C.primary },
  brandSub: { fontSize: 9, color: C.secondary, letterSpacing: 2, marginTop: 2 },
  navItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: 8, marginBottom: 2, position: 'relative',
  },
  navItemActive: { backgroundColor: C.surfaceContainerHigh },
  navLabel: { fontSize: 13, color: C.secondary, fontWeight: '500', flex: 1 },
  navLabelActive: { color: C.primary, fontWeight: '700' },
  activeBar: {
    position: 'absolute', right: 0, top: 4, bottom: 4,
    width: 3, backgroundColor: C.primary, borderRadius: 2,
  },
  voiceBtn: {
    marginTop: 'auto' as any,
    backgroundColor: C.primaryContainer, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 12, marginTop: 32,
  },
  voiceBtnText: { fontSize: 13, fontWeight: '600', color: C.onPrimaryContainer },
});

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function DashboardScreen() {
  const d = DEMO_DASHBOARD;

  return (
    <View style={s.root}>
      {/* Sidebar */}
      <Sidebar active="Dashboard" />

      {/* Main area */}
      <View style={{ flex: 1 }}>
        {/* Top Nav */}
        <View style={s.topNav}>
          <View style={s.searchBar}>
            <Ionicons name="search-outline" size={16} color={C.secondary} />
            <TextInput
              style={s.searchInput}
              placeholder="Search analytics..."
              placeholderTextColor={C.secondary}
            />
          </View>
          <View style={s.topRight}>
            <Text style={s.cafeName}>{DEMO_BUSINESS.cafe_name}</Text>
            <Ionicons name="notifications-outline" size={22} color={C.secondary} />
            <Ionicons name="person-circle-outline" size={24} color={C.secondary} />
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView style={s.canvas} contentContainerStyle={s.canvasContent}>

          {/* Page Header */}
          <View style={s.pageHeader}>
            <View>
              <Text style={s.pageTitle}>Executive Health Dashboard</Text>
              <Text style={s.pageSubtitle}>A snapshot of your café's vital signs and predictive actions.</Text>
            </View>
            <TouchableOpacity style={s.exportBtn}>
              <Ionicons name="download-outline" size={14} color={C.onPrimary} />
              <Text style={s.exportBtnText}>Export PDF</Text>
            </TouchableOpacity>
          </View>

          {/* Row 1: Health Score + Revenue + Risk */}
          <View style={s.row}>

            {/* Health Score Card */}
            <View style={[s.card, s.cardBorderGreen, { flex: 1.1 }]}>
              <View style={s.cardHeader}>
                <Text style={s.cardTitle}>Health Score</Text>
                <Ionicons name="information-circle-outline" size={18} color={C.onTertiaryContainer} />
              </View>
              <CircularGauge score={d.health_score} />
              <Text style={s.gaugeCaption}>
                Your performance is in the top 15% of specialty cafés in your district.
              </Text>
            </View>

            {/* Right column: Revenue + Risk */}
            <View style={{ flex: 2, gap: 12 }}>
              {/* Revenue Trend */}
              <View style={[s.card, s.cardBorderRed]}>
                <View style={s.metaRow}>
                  <Text style={s.metaLabel}>REVENUE TREND</Text>
                  <Text style={[s.metaValue, { color: C.error }]}>–18%</Text>
                </View>
                <Sparkline />
                <Text style={s.metaNote}>
                  * Decline likely due to increased competition nearby.
                </Text>
              </View>

              {/* Risk Level */}
              <View style={[s.card, s.cardBorderAmber]}>
                <View style={s.cardHeader}>
                  <Text style={s.cardTitle}>Risk Level</Text>
                  <View style={s.riskBadge}>
                    <Ionicons name="warning" size={12} color={C.onErrorContainer} />
                    <Text style={s.riskBadgeText}>MEDIUM</Text>
                  </View>
                </View>
                <View style={{ gap: 10, marginTop: 8 }}>
                  <View style={s.barRow}>
                    <Text style={s.barLabel}>Churn Probability</Text>
                    <View style={s.barTrack}>
                      <View style={[s.barFill, { width: '42%', backgroundColor: C.error }]} />
                    </View>
                  </View>
                  <View style={s.barRow}>
                    <Text style={s.barLabel}>Inventory Latency</Text>
                    <View style={s.barTrack}>
                      <View style={[s.barFill, { width: '68%', backgroundColor: C.amber }]} />
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={s.mitigationLink}>
                  <Text style={s.mitigationText}>View Mitigation Plan</Text>
                  <Ionicons name="chevron-forward" size={14} color={C.onTertiaryContainer} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* AI Weekly Summary */}
          <View style={[s.card, s.aiCard]}>
            <View style={s.aiHeader}>
              <Ionicons name="sparkles" size={18} color={C.onPrimaryContainer} />
              <Text style={s.aiTitle}>Weekly Performance Summary</Text>
            </View>
            <Text style={s.aiBody}>
              Growth in your{' '}
              <Text style={s.aiHighlight}>Loyalty Program</Text>
              {' '}memberships (+12%) is being offset by operational friction during peak hours.
              Customer sentiment remains high for product quality, but frustrations are mounting
              regarding queue times. Models predict a{' '}
              <Text style={s.aiHighlight}>5.4% revenue bounce</Text>
              {' '}if staff density is increased between 12:00 PM and 2:00 PM.
            </Text>
          </View>

          {/* Row 2: Top Problem + Alerts */}
          <View style={s.row}>

            {/* Top Problem */}
            <View style={[s.card, { flex: 1.6 }]}>
              <View style={s.criticalTag}>
                <Ionicons name="alert-circle" size={12} color={C.error} />
                <Text style={s.criticalTagText}>CRITICAL FRICTION POINT</Text>
              </View>
              <Text style={s.problemTitle}>Problem: Waiting Time</Text>
              <Text style={s.problemBody}>
                Average transaction duration has increased to{' '}
                <Text style={{ fontWeight: '700', color: C.primary }}>6.4 minutes</Text>
                {' '}during lunch peak, exceeding the customer tolerance threshold of 4.5 minutes.
              </Text>

              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCm2tD6z4IND_NZqLUfdnH6eAOi20ABFxo-xP5Yb0ULbdQl5vppLdmOWTNOHS0OwBGD9CwRarPfGStEQfBEDUnFlDwqi6HG2dTAbwnmMnczTMj2FlRkld5vYj-SiVGf8QxVDpAKi1qvOcC_i4uDlMRaah9IBM1SI31nIXnQskeVFIIrURUaSQVTqvxbk0UeGzOTM-ubLG6S5eOVFW3EQ4LyCbwRui_7_aqGSfidsR67RVa3WeQnPx8izNzK74Q7i2An6mRut4iQRZIo' }}
                style={s.problemImage}
                resizeMode="cover"
              />

              <View style={s.recBox}>
                <View>
                  <Text style={s.recBoxLabel}>RECOMMENDED ACTION</Text>
                  <Text style={s.recBoxValue}>Add Lunch-Hour Staff</Text>
                </View>
                <TouchableOpacity style={s.applyBtn}>
                  <Text style={s.applyBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Alerts Feed */}
            <View style={{ flex: 1, gap: 8 }}>
              <Text style={s.alertsTitle}>Real-Time Alerts</Text>
              <AlertCard
                icon="timer-outline"
                title="Operational Alert"
                time="2m ago"
                message="Waiting time increased 12% in the last hour. Staff workload is at critical levels."
                color={C.error}
              />
              <AlertCard
                icon="cube-outline"
                title="Inventory Warning"
                time="45m ago"
                message="Oat Milk stock is below 15%. Recommend ordering 12 units now."
                color={C.amber}
              />
              <AlertCard
                icon="chatbubble-ellipses-outline"
                title="New High-Impact Review"
                time="2h ago"
                message={`"The almond croissant was the best I've ever had, but finding a seat took forever."`}
                color={C.onTertiaryContainer}
              />
            </View>
          </View>

          {/* AI Recommendations */}
          <Text style={s.recSectionTitle}>🧠 AI Recommendations</Text>
          <View style={s.recGrid}>
            {DEMO_RECOMMENDATIONS.map((rec, i) => (
              <View key={i} style={s.recCard}>
                <View style={[
                  s.recPriorityDot,
                  { backgroundColor: rec.priority === 'High' ? C.error : C.amber },
                ]} />
                <View style={{ flex: 1 }}>
                  <Text style={s.recAction}>{rec.action}</Text>
                  <View style={s.recMetaRow}>
                    <Text style={s.recMeta}>💰 {rec.expected_revenue_impact}</Text>
                    <Text style={s.recMeta}>⭐ {rec.expected_rating_improvement}</Text>
                  </View>
                </View>
                <View style={[
                  s.recPriorityBadge,
                  { backgroundColor: rec.priority === 'High' ? C.error + '20' : C.amber + '20' },
                ]}>
                  <Text style={[
                    s.recPriorityText,
                    { color: rec.priority === 'High' ? C.error : C.amber },
                  ]}>
                    {rec.priority}
                  </Text>
                </View>
              </View>
            ))}
          </View>

        </ScrollView>
      </View>

      {/* Floating AI Button */}
      <TouchableOpacity style={s.fab}>
        <Ionicons name="hardware-chip-outline" size={18} color={C.onPrimary} />
        <Text style={s.fabText}>Sarvam AI Assistant</Text>
        <View style={s.fabDivider} />
        <Text style={s.fabLink}>Help</Text>
        <Text style={s.fabLink}>Feedback</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: C.background },

  // Top nav
  topNav: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 20,
    backgroundColor: C.surface, borderBottomWidth: 1,
    borderBottomColor: C.outlineVariant,
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: C.surfaceContainerLowest, borderRadius: 999,
    paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 1, borderColor: C.outlineVariant, width: 220,
  },
  searchInput: { fontSize: 13, color: C.onSurface, flex: 1 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  cafeName: { fontSize: 15, fontWeight: '800', color: C.onSurface, marginRight: 4 },

  // Canvas
  canvas: { flex: 1 },
  canvasContent: { padding: 20, paddingBottom: 100 },

  // Page header
  pageHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-end', marginBottom: 16,
  },
  pageTitle: { fontSize: 20, fontWeight: '900', color: C.primary },
  pageSubtitle: { fontSize: 13, color: C.secondary, marginTop: 2 },
  exportBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.primary, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 8,
  },
  exportBtnText: { fontSize: 12, fontWeight: '700', color: C.onPrimary },

  // Cards
  card: {
    backgroundColor: C.surfaceContainerLowest, borderRadius: 12,
    padding: 16, shadowColor: '#4b2c20',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08,
    shadowRadius: 12, elevation: 3,
  },
  cardBorderGreen: { borderTopWidth: 4, borderTopColor: C.onTertiaryContainer },
  cardBorderRed:   { borderTopWidth: 4, borderTopColor: C.error },
  cardBorderAmber: { borderTopWidth: 4, borderTopColor: C.amber },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.onSurface },

  // Layout rows
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },

  // Gauge
  gaugeCaption: {
    fontSize: 12, color: C.onSurfaceVariant, textAlign: 'center',
    marginTop: 8, lineHeight: 18, paddingHorizontal: 4,
  },

  // Revenue sparkline meta
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaLabel: { fontSize: 10, fontWeight: '700', color: C.secondary, letterSpacing: 1.2 },
  metaValue: { fontSize: 18, fontWeight: '900' },
  metaNote: { fontSize: 11, color: C.onSurfaceVariant, fontStyle: 'italic', marginTop: 6 },

  // Risk bars
  riskBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: C.errorContainer, paddingHorizontal: 8,
    paddingVertical: 3, borderRadius: 6,
  },
  riskBadgeText: { fontSize: 9, fontWeight: '900', color: C.onErrorContainer },
  barRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  barLabel: { fontSize: 12, color: C.secondary, flex: 1 },
  barTrack: {
    width: 100, height: 6, backgroundColor: C.surfaceContainer,
    borderRadius: 3, overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 3 },
  mitigationLink: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  mitigationText: { fontSize: 13, color: C.onTertiaryContainer, fontWeight: '600' },

  // AI Summary
  aiCard: { backgroundColor: C.primaryContainer, marginBottom: 12 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  aiTitle: { fontSize: 15, fontWeight: '700', color: C.onPrimaryContainer },
  aiBody: { fontSize: 14, color: C.onPrimaryContainer, lineHeight: 22 },
  aiHighlight: { fontWeight: '700', textDecorationLine: 'underline' },

  // Top problem
  criticalTag: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  criticalTagText: { fontSize: 9, fontWeight: '900', color: C.error, letterSpacing: 1.5 },
  problemTitle: { fontSize: 18, fontWeight: '900', color: C.primary, marginBottom: 6 },
  problemBody: { fontSize: 13, color: C.onSurfaceVariant, lineHeight: 20, marginBottom: 12 },
  problemImage: { width: '100%', height: 140, borderRadius: 10, marginBottom: 12 },
  recBox: {
    backgroundColor: C.tertiaryContainer + '40',
    borderWidth: 1, borderColor: C.tertiaryContainer,
    borderRadius: 10, padding: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  recBoxLabel: { fontSize: 9, fontWeight: '800', color: C.onTertiaryContainer, letterSpacing: 1.2 },
  recBoxValue: { fontSize: 15, fontWeight: '700', color: C.onSurface, marginTop: 2 },
  applyBtn: {
    backgroundColor: C.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8,
  },
  applyBtnText: { color: C.onPrimary, fontWeight: '700', fontSize: 13 },

  // Alerts
  alertsTitle: { fontSize: 14, fontWeight: '700', color: C.onSurface, marginBottom: 4 },

  // Recommendations section
  recSectionTitle: { fontSize: 17, fontWeight: '900', color: C.onSurface, marginTop: 4, marginBottom: 10 },
  recGrid: { gap: 8 },
  recCard: {
    backgroundColor: C.surfaceContainerLowest, borderRadius: 12,
    padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    shadowColor: '#4b2c20', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  recPriorityDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  recAction: { fontSize: 13, fontWeight: '600', color: C.onSurface, lineHeight: 20, marginBottom: 6 },
  recMetaRow: { flexDirection: 'row', gap: 12 },
  recMeta: { fontSize: 11, color: C.secondary },
  recPriorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, alignSelf: 'flex-start' },
  recPriorityText: { fontSize: 9, fontWeight: '900' },

  // FAB
  fab: {
    position: 'absolute', bottom: 20, right: 20,
    backgroundColor: C.primary, borderRadius: 999,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 18, paddingVertical: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 12, elevation: 8,
  },
  fabText: { fontSize: 13, fontWeight: '700', color: C.onPrimary },
  fabDivider: { width: 1, height: 16, backgroundColor: C.onPrimary + '40', marginHorizontal: 2 },
  fabLink: { fontSize: 12, color: C.onPrimary, fontWeight: '500' },
});
