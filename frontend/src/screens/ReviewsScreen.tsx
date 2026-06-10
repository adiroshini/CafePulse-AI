import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DEMO_REVIEWS, DEMO_DASHBOARD } from '../mock/demoData';

const { width } = Dimensions.get('window');
const SIDEBAR_W = 200;

const C = {
  primary: '#32170d', primaryContainer: '#4b2c20', onPrimary: '#ffffff',
  onPrimaryContainer: '#bf9282', tertiary: '#002416',
  tertiaryContainer: '#003c27', onTertiaryContainer: '#6ba98a',
  tertiaryFixed: '#b1f0ce', tertiaryFixedDim: '#95d4b3',
  error: '#ba1a1a', errorContainer: '#ffdad6', onErrorContainer: '#93000a',
  secondary: '#605e5b', secondaryContainer: '#e6e2de',
  surface: '#f8f9ff', surfaceContainer: '#e6eeff',
  surfaceContainerHigh: '#dee9fc', surfaceContainerLow: '#eff4ff',
  surfaceContainerLowest: '#ffffff', surfaceContainerHighest: '#d9e3f6',
  onSurface: '#121c2a', onSurfaceVariant: '#504440',
  outlineVariant: '#d5c3bd', outline: '#83746f',
  amber: '#ffb300', background: '#F5F1ED',
  onSecondaryFixed: '#1c1c19', onSecondaryContainer: '#666461',
};

const COMPLAINTS = [
  { label: 'Waiting Time', size: 'xl', bg: C.errorContainer, color: C.onErrorContainer },
  { label: 'Staff Behavior', size: 'lg', bg: C.surfaceContainerHighest, color: C.secondary },
  { label: 'Cold Coffee', size: 'sm', bg: C.surfaceContainer, color: C.onSecondaryContainer },
  { label: 'Loud Music', size: 'lg', bg: C.surfaceContainerHighest, color: C.secondary },
  { label: 'Mobile App Glitch', size: 'sm', bg: C.surfaceContainer, color: C.onSecondaryContainer },
  { label: 'Price Point', size: 'xl', bg: C.secondaryContainer, color: C.onSecondaryFixed },
  { label: 'Table Cleanliness', size: 'sm', bg: C.surfaceContainer, color: C.onSecondaryContainer },
];

const ROOT_NODES = [
  { icon: 'timer-outline', bg: C.primaryContainer, color: C.onPrimaryContainer, label: 'Waiting Time', sub: 'Avg. 14 mins', size: 80 },
  { icon: 'thumbs-down', bg: C.errorContainer, color: C.error, label: 'Negative Reviews', sub: '42 Reviews Today', size: 100 },
  { icon: 'trending-down', bg: C.onSurface, color: C.tertiaryFixedDim, label: 'Revenue Loss', sub: 'Est. –₹8,500/Week', size: 90 },
];

const SOURCE_COLORS: Record<string, string> = {
  google: '#4285F4', zomato: '#E23744', swiggy: '#FC8019', manual: C.primary,
};

function SentimentGauge() {
  const pct = 75;
  const r = 36;
  const circ = 2 * Math.PI * r;
  return (
    <View style={sg.wrapper}>
      <View style={sg.circle}>
        <View style={[sg.ring, { borderColor: C.surfaceContainer }]} />
        <View style={[sg.progress, { borderColor: C.onTertiaryContainer }]} />
        <View style={sg.inner}>
          <Text style={sg.pct}>75%</Text>
        </View>
      </View>
      <View>
        <Text style={sg.label}>NET POSITIVE</Text>
        <Text style={sg.delta}>+4.2% from last month</Text>
      </View>
    </View>
  );
}
const sg = StyleSheet.create({
  wrapper: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  circle: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 80, height: 80, borderRadius: 40, borderWidth: 7 },
  progress: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40, borderWidth: 7,
    borderTopColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: 'transparent',
    transform: [{ rotate: '60deg' }],
  },
  inner: { alignItems: 'center' },
  pct: { fontSize: 18, fontWeight: '900', color: C.primary },
  label: { fontSize: 9, fontWeight: '700', color: C.secondary, letterSpacing: 1.5 },
  delta: { fontSize: 12, fontWeight: '600', color: C.onTertiaryContainer, marginTop: 2 },
});

function Sidebar() {
  const items = [
    { icon: 'grid-outline', label: 'Dashboard' },
    { icon: 'bar-chart', label: 'Review Intelligence', active: true },
    { icon: 'restaurant-outline', label: 'Menu Studio' },
    { icon: 'settings-outline', label: 'Operations' },
    { icon: 'trending-up-outline', label: 'What-If Simulator' },
  ];
  return (
    <View style={sb.bar}>
      <View style={sb.brand}>
        <Text style={sb.name}>CafePulse AI</Text>
        <Text style={sb.sub}>INTELLIGENT BREWING</Text>
      </View>
      {items.map(item => (
        <TouchableOpacity key={item.label} style={[sb.item, item.active && sb.itemActive]}>
          <Ionicons name={item.icon as any} size={18} color={item.active ? C.primary : C.secondary} />
          <Text style={[sb.itemLabel, item.active && sb.itemLabelActive]} numberOfLines={1}>{item.label}</Text>
          {item.active && <View style={sb.activeBar} />}
        </TouchableOpacity>
      ))}
      <View style={sb.profile}>
        <Ionicons name="person-circle-outline" size={32} color={C.onPrimaryContainer} />
        <View>
          <Text style={sb.profileName}>Manager</Text>
          <Text style={sb.profileCafe}>Morning Brew Cafe</Text>
        </View>
      </View>
    </View>
  );
}
const sb = StyleSheet.create({
  bar: {
    width: SIDEBAR_W, backgroundColor: C.surfaceContainerLow,
    paddingVertical: 20, paddingHorizontal: 10,
    borderRightWidth: 1, borderRightColor: C.outlineVariant,
  },
  brand: { marginBottom: 20, paddingHorizontal: 6 },
  name: { fontSize: 16, fontWeight: '900', color: C.primary },
  sub: { fontSize: 8, color: C.secondary, letterSpacing: 1.5, marginTop: 1 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9, paddingHorizontal: 10, borderRadius: 8, marginBottom: 2, position: 'relative' },
  itemActive: { backgroundColor: C.surfaceContainerHigh },
  itemLabel: { fontSize: 12, color: C.secondary, flex: 1 },
  itemLabelActive: { color: C.primary, fontWeight: '700' },
  activeBar: { position: 'absolute', right: 0, top: 4, bottom: 4, width: 3, backgroundColor: C.primary, borderRadius: 2 },
  profile: { marginTop: 'auto' as any, flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 16, marginTop: 24, borderTopWidth: 1, borderTopColor: C.outlineVariant },
  profileName: { fontSize: 12, fontWeight: '700', color: C.onSurface },
  profileCafe: { fontSize: 10, color: C.secondary },
});

export default function ReviewsScreen() {
  const [activeTab, setActiveTab] = useState<'insights' | 'reviews' | 'root'>('insights');

  return (
    <View style={s.root}>
      <Sidebar />
      <View style={{ flex: 1 }}>
        {/* Top nav */}
        <View style={s.topNav}>
          <View style={s.searchBar}>
            <Ionicons name="search-outline" size={15} color={C.secondary} />
            <TextInput style={s.searchInput} placeholder="Search insights..." placeholderTextColor={C.secondary} />
          </View>
          <View style={s.topRight}>
            <Ionicons name="notifications-outline" size={20} color={C.secondary} />
            <View style={s.notifDot} />
            <Text style={s.cafeName}>Morning Brew Cafe</Text>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={s.canvas}>
          {/* Page header */}
          <View style={s.pageHeader}>
            <View>
              <Text style={s.pageTitle}>Intelligence &amp; Root Cause</Text>
              <Text style={s.pageSubtitle}>Analyzing 1,248 reviews from the last 30 days.</Text>
            </View>
            <View style={s.headerBtns}>
              <TouchableOpacity style={s.outlineBtn}>
                <Ionicons name="calendar-outline" size={14} color={C.primary} />
                <Text style={s.outlineBtnText}>Last 30 Days</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.solidBtn}>
                <Ionicons name="download-outline" size={14} color={C.onPrimary} />
                <Text style={s.solidBtnText}>Export</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sub-tabs */}
          <View style={s.tabs}>
            {(['insights', 'reviews', 'root'] as const).map(tab => (
              <TouchableOpacity key={tab} style={[s.tab, activeTab === tab && s.tabActive]} onPress={() => setActiveTab(tab)}>
                <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>
                  {tab === 'insights' ? '🎯 Insights' : tab === 'reviews' ? '💬 Reviews' : '🔗 Root Cause'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── INSIGHTS TAB ── */}
          {activeTab === 'insights' && (
            <View style={s.grid}>
              {/* Sentiment Pulse */}
              <View style={[s.card, s.borderGreen, { flex: 1, minWidth: 240 }]}>
                <Text style={s.cardTitle}>Sentiment Pulse</Text>
                <SentimentGauge />
                <View style={{ gap: 8 }}>
                  <View style={s.barRow}>
                    <Text style={s.barLabel}>Strengths</Text>
                    <View style={s.greenPill}><Text style={s.greenPillText}>Coffee, Decor</Text></View>
                  </View>
                  <View style={s.track}><View style={[s.fill, { width: '88%', backgroundColor: C.onTertiaryContainer }]} /></View>
                  <View style={s.barRow}>
                    <Text style={s.barLabel}>Weaknesses</Text>
                    <View style={s.orangePill}><Text style={s.orangePillText}>Speed, Parking</Text></View>
                  </View>
                  <View style={s.track}><View style={[s.fill, { width: '32%', backgroundColor: '#ecbcaa' }]} /></View>
                </View>
              </View>

              {/* Complaints Cloud */}
              <View style={[s.card, s.borderRed, { flex: 2, minWidth: 280 }]}>
                <View style={s.cardHeader}>
                  <View>
                    <Text style={s.cardTitle}>Top Complaints Cloud</Text>
                    <Text style={s.cardSub}>NLP-extracted themes from negative reviews.</Text>
                  </View>
                  <Ionicons name="warning" size={20} color={C.error} />
                </View>
                <View style={s.cloud}>
                  {COMPLAINTS.map((c, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        s.tag,
                        { backgroundColor: c.bg },
                        c.size === 'xl' && s.tagXl,
                        c.size === 'lg' && s.tagLg,
                      ]}
                    >
                      <Text style={[
                        s.tagText,
                        { color: c.color },
                        c.size === 'xl' && s.tagTextXl,
                        c.size === 'lg' && s.tagTextLg,
                      ]}>
                        {c.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* ── ROOT CAUSE TAB ── */}
          {activeTab === 'root' && (
            <View style={[s.card, { marginTop: 12 }]}>
              <Text style={s.cardTitle}>Root Cause Impact Map</Text>
              <Text style={s.cardSub}>Causal relationships between operational friction and revenue loss.</Text>

              {/* Node chain */}
              <View style={s.nodeChain}>
                {ROOT_NODES.map((node, i) => (
                  <View key={i} style={s.nodeWrapper}>
                    <View style={[s.nodeCircle, { width: node.size, height: node.size, borderRadius: node.size / 2, backgroundColor: node.bg }]}>
                      <Ionicons name={node.icon as any} size={node.size * 0.38} color={node.color} />
                    </View>
                    <Text style={s.nodeLabel}>{node.label}</Text>
                    <Text style={s.nodeSub}>{node.sub}</Text>
                    {i < ROOT_NODES.length - 1 && (
                      <View style={s.arrow}>
                        <Ionicons name="arrow-forward" size={20} color={C.primaryContainer} />
                      </View>
                    )}
                  </View>
                ))}
              </View>

              {/* Quote */}
              <View style={s.quoteBox}>
                <Ionicons name="sparkles" size={14} color={C.onTertiaryContainer} />
                <Text style={s.quoteText}>
                  "AI Correlation: A 10% reduction in waiting time correlates to an 8% increase in repeat customer revenue."
                </Text>
              </View>

              {/* Chain list */}
              <View style={s.chainList}>
                {['Long Waiting Time', '→ Negative Reviews Generated', '→ Lower Star Ratings', '→ Reduced Repeat Customers', '→ Revenue Loss (–18%)'].map((step, i) => (
                  <Text key={i} style={[s.chainStep, i === 0 && s.chainFirst]}>{step}</Text>
                ))}
              </View>
            </View>
          )}

          {/* ── REVIEWS TAB ── */}
          {activeTab === 'reviews' && (
            <View style={{ gap: 10, marginTop: 12 }}>
              {DEMO_REVIEWS.map((review, i) => (
                <View key={i} style={s.reviewCard}>
                  <View style={s.reviewTop}>
                    <View style={[s.sourceBadge, { backgroundColor: SOURCE_COLORS[review.source] || C.primary }]}>
                      <Text style={s.sourceText}>{review.source.toUpperCase()}</Text>
                    </View>
                    <Text style={[s.stars, { color: review.rating >= 4 ? C.onTertiaryContainer : review.rating >= 3 ? C.amber : C.error }]}>
                      {'★'.repeat(Math.round(review.rating))}{'☆'.repeat(5 - Math.round(review.rating))}
                    </Text>
                    <Text style={s.ratingNum}>{review.rating.toFixed(1)}</Text>
                    <Text style={s.reviewDate}>{review.date}</Text>
                  </View>
                  <Text style={s.reviewText}>{review.text}</Text>
                  <Text style={s.reviewAuthor}>{review.customer_name}</Text>
                </View>
              ))}
            </View>
          )}

        </ScrollView>
      </View>

      {/* FAB */}
      <TouchableOpacity style={s.fab}>
        <Ionicons name="mic" size={16} color={C.onPrimary} />
        <Text style={s.fabText}>Voice Assistant</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: C.background },
  topNav: {
    height: 52, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.outlineVariant,
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.surfaceContainerLow, borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: C.outlineVariant, flex: 1, maxWidth: 240,
  },
  searchInput: { fontSize: 12, color: C.onSurface, flex: 1 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  notifDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.error, marginLeft: -14, marginTop: -10 },
  cafeName: { fontSize: 13, fontWeight: '800', color: C.primary },
  canvas: { padding: 16, paddingBottom: 80 },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  pageTitle: { fontSize: 18, fontWeight: '900', color: C.primary },
  pageSubtitle: { fontSize: 12, color: C.secondary, marginTop: 2 },
  headerBtns: { flexDirection: 'row', gap: 8 },
  outlineBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: C.primary, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  outlineBtnText: { fontSize: 11, color: C.primary, fontWeight: '700' },
  solidBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.primary, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  solidBtnText: { fontSize: 11, color: C.onPrimary, fontWeight: '700' },
  tabs: { flexDirection: 'row', backgroundColor: C.surface, borderRadius: 10, padding: 3, marginBottom: 12, borderWidth: 1, borderColor: C.outlineVariant },
  tab: { flex: 1, paddingVertical: 7, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: C.primaryContainer },
  tabText: { fontSize: 11, color: C.secondary, fontWeight: '600' },
  tabTextActive: { color: C.onPrimary },
  grid: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  card: {
    backgroundColor: C.surfaceContainerLowest, borderRadius: 12, padding: 14,
    shadowColor: '#4b2c20', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
  },
  borderGreen: { borderTopWidth: 4, borderTopColor: C.onTertiaryContainer },
  borderRed: { borderTopWidth: 4, borderTopColor: C.error },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: C.primary, marginBottom: 4 },
  cardSub: { fontSize: 11, color: C.secondary },
  barRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  barLabel: { fontSize: 12, color: C.secondary, fontWeight: '500' },
  track: { height: 6, backgroundColor: C.surfaceContainerLow, borderRadius: 3, overflow: 'hidden', marginTop: 4, marginBottom: 8 },
  fill: { height: '100%', borderRadius: 3 },
  greenPill: { backgroundColor: 'rgba(149,212,179,0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  greenPillText: { fontSize: 10, color: '#0e5138', fontWeight: '600' },
  orangePill: { backgroundColor: '#ffdbce', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  orangePillText: { fontSize: 10, color: '#613e31', fontWeight: '600' },
  cloud: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  tag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  tagXl: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  tagLg: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  tagText: { fontSize: 11, fontWeight: '600' },
  tagTextXl: { fontSize: 15, fontWeight: '800' },
  tagTextLg: { fontSize: 13, fontWeight: '700' },
  nodeChain: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginVertical: 20, flexWrap: 'wrap', gap: 8 },
  nodeWrapper: { alignItems: 'center', position: 'relative' },
  nodeCircle: { justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: C.surfaceContainerLowest, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5, marginBottom: 6 },
  nodeLabel: { fontSize: 12, fontWeight: '800', color: C.primary, textAlign: 'center', maxWidth: 90 },
  nodeSub: { fontSize: 10, color: C.secondary, textAlign: 'center' },
  arrow: { position: 'absolute', right: -22, top: '40%' as any },
  quoteBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: C.surfaceContainerLow, borderWidth: 1, borderColor: C.outlineVariant, borderRadius: 10, padding: 12, marginTop: 12 },
  quoteText: { flex: 1, fontSize: 12, color: C.primary, fontStyle: 'italic', lineHeight: 18 },
  chainList: { marginTop: 14, gap: 6 },
  chainStep: { fontSize: 13, color: C.onSurfaceVariant, paddingLeft: 10 },
  chainFirst: { color: C.error, fontWeight: '800', paddingLeft: 0, fontSize: 14 },
  reviewCard: {
    backgroundColor: C.surfaceContainerLowest, borderRadius: 12, padding: 14,
    shadowColor: '#4b2c20', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sourceBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5 },
  sourceText: { fontSize: 9, color: '#fff', fontWeight: '800' },
  stars: { fontSize: 12, letterSpacing: 1 },
  ratingNum: { fontSize: 12, fontWeight: '700', color: C.onSurface },
  reviewDate: { fontSize: 10, color: C.secondary, marginLeft: 'auto' as any },
  reviewText: { fontSize: 13, color: C.onSurface, lineHeight: 20 },
  reviewAuthor: { fontSize: 11, color: C.secondary, fontWeight: '600', marginTop: 6 },
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
