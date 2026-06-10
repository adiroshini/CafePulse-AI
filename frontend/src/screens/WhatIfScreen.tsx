import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Image, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  amber: '#ff9800', background: '#F5F1ED',
};

const SCENARIOS = [
  { key: 'hire_employee', label: 'Hire Staff', icon: 'people-outline', color: C.onTertiaryContainer },
  { key: 'reduce_price', label: 'Reduce Price', icon: 'pricetag-outline', color: C.amber },
  { key: 'run_promotion', label: 'Run Promo', icon: 'megaphone-outline', color: '#4285F4' },
  { key: 'add_combo', label: 'Add Combo', icon: 'fast-food-outline', color: C.primary },
];

const SIMULATION_RESULTS: Record<string, {
  profit: string; profitDelta: string; labor: string; laborDelta: string;
  waitTime: string; waitDelta: string; recommendation: string;
  bars: { revenue: number; speed: number; cost: number };
}> = {
  hire_employee: {
    profit: '₹4,250', profitDelta: '+12.5%', labor: '₹12.4k', laborDelta: '–₹2,800',
    waitTime: '2.8m', waitDelta: '–3.5m',
    recommendation: 'Hiring 1 additional staff during the 8 AM rush reduces wait time by 4.2 minutes and captures ₹3,200 in lost morning sales.',
    bars: { revenue: 85, speed: 90, cost: 55 },
  },
  reduce_price: {
    profit: '₹2,800', profitDelta: '+8.2%', labor: '₹9.8k', laborDelta: '–₹0',
    waitTime: '5.2m', waitDelta: '–1.2m',
    recommendation: 'A 10% price drop on Latte could increase volume by 20% and net +8% profit over the month.',
    bars: { revenue: 78, speed: 65, cost: 40 },
  },
  run_promotion: {
    profit: '₹5,100', profitDelta: '+15%', labor: '₹10.2k', laborDelta: '–₹500',
    waitTime: '7.1m', waitDelta: '+0.7m',
    recommendation: 'A BOGO weekday promo is predicted to drive +25% footfall and break even by Day 5.',
    bars: { revenue: 92, speed: 50, cost: 48 },
  },
  add_combo: {
    profit: '₹3,600', profitDelta: '+10.4%', labor: '₹9.8k', laborDelta: '–₹0',
    waitTime: '6.1m', waitDelta: '–0.3m',
    recommendation: 'Adding a Cappuccino + Brownie combo at 10% off increases average order value by ₹42 with zero extra cost.',
    bars: { revenue: 82, speed: 70, cost: 40 },
  },
};

function Sidebar() {
  const items = [
    { icon: 'grid-outline', label: 'Dashboard' },
    { icon: 'bar-chart-outline', label: 'Review Intelligence' },
    { icon: 'restaurant-outline', label: 'Menu Studio' },
    { icon: 'settings-outline', label: 'Operations' },
    { icon: 'trending-up', label: 'What-If Simulator', active: true },
  ];
  return (
    <View style={sb.bar}>
      <View style={sb.brand}>
        <Text style={sb.name}>CafePulse AI</Text>
        <Text style={sb.sub}>INTELLIGENT BREWING</Text>
      </View>
      {items.map(item => (
        <TouchableOpacity key={item.label} style={[sb.item, item.active && sb.itemActive]}>
          <Ionicons name={item.icon as any} size={17} color={item.active ? C.primary : C.secondary} />
          <Text style={[sb.label, item.active && sb.labelActive]} numberOfLines={1}>{item.label}</Text>
          {item.active && <View style={sb.activeBar} />}
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={sb.voiceBtn}>
        <Ionicons name="mic" size={16} color={C.onPrimaryContainer} />
        <Text style={sb.voiceText}>Voice Assistant</Text>
      </TouchableOpacity>
    </View>
  );
}
const sb = StyleSheet.create({
  bar: { width: SIDEBAR_W, backgroundColor: C.surfaceContainerLow, paddingVertical: 20, paddingHorizontal: 10, borderRightWidth: 1, borderRightColor: C.outlineVariant },
  brand: { marginBottom: 20, paddingHorizontal: 6 },
  name: { fontSize: 15, fontWeight: '900', color: C.primary },
  sub: { fontSize: 8, color: C.secondary, letterSpacing: 1.5, marginTop: 1 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9, paddingHorizontal: 10, borderRadius: 8, marginBottom: 2, position: 'relative' },
  itemActive: { backgroundColor: C.surfaceContainerHigh },
  label: { fontSize: 11, color: C.secondary, flex: 1 },
  labelActive: { color: C.primary, fontWeight: '700' },
  activeBar: { position: 'absolute', right: 0, top: 4, bottom: 4, width: 3, backgroundColor: C.primary, borderRadius: 2 },
  voiceBtn: { marginTop: 24, backgroundColor: C.primaryContainer, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10 },
  voiceText: { fontSize: 12, fontWeight: '600', color: C.onPrimaryContainer },
});

function BarChart({ bars }: { bars: { revenue: number; speed: number; cost: number } }) {
  const items = [
    { label: 'Gross Revenue', current: 70, predicted: bars.revenue, color: C.primaryContainer },
    { label: 'Service Speed', current: 55, predicted: bars.speed, color: C.tertiaryContainer },
    { label: 'Operational Cost', current: 40, predicted: bars.cost, color: C.errorContainer },
  ];
  const H = 120;
  return (
    <View style={bc.wrapper}>
      <View style={bc.legend}>
        <View style={bc.legendItem}><View style={[bc.dot, { backgroundColor: C.secondaryContainer }]} /><Text style={bc.legendText}>Current</Text></View>
        <View style={bc.legendItem}><View style={[bc.dot, { backgroundColor: C.primaryContainer }]} /><Text style={bc.legendText}>Predicted</Text></View>
      </View>
      <View style={bc.chart}>
        {items.map((item, i) => (
          <View key={i} style={bc.barGroup}>
            <View style={[bc.barsRow, { height: H }]}>
              <View style={[bc.bar, { height: (item.current / 100) * H, backgroundColor: C.secondaryContainer }]} />
              <View style={[bc.bar, { height: (item.predicted / 100) * H, backgroundColor: item.color, shadowColor: item.color, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 }]} />
            </View>
            <Text style={bc.barLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
const bc = StyleSheet.create({
  wrapper: { marginTop: 8 },
  legend: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 3 },
  legendText: { fontSize: 11, color: C.secondary },
  chart: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
  barGroup: { alignItems: 'center', gap: 6, flex: 1 },
  barsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, justifyContent: 'center' },
  bar: { width: 24, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  barLabel: { fontSize: 9, fontWeight: '700', color: C.secondary, textAlign: 'center', letterSpacing: 0.5, textTransform: 'uppercase' },
});

export default function WhatIfScreen() {
  const [staffCount, setStaffCount] = useState(3);
  const [selectedScenario, setSelectedScenario] = useState('hire_employee');
  const result = SIMULATION_RESULTS[selectedScenario];

  return (
    <View style={s.root}>
      <Sidebar />
      <View style={{ flex: 1 }}>
        {/* Top nav */}
        <View style={s.topNav}>
          <View style={s.searchBar}>
            <Ionicons name="search-outline" size={14} color={C.secondary} />
            <TextInput style={s.searchInput} placeholder="Simulate growth strategies..." placeholderTextColor={C.secondary} />
          </View>
          <View style={s.topRight}>
            <Ionicons name="notifications-outline" size={20} color={C.secondary} />
            <Ionicons name="person-circle-outline" size={22} color={C.secondary} />
            <Text style={s.userName}>Ravi K.</Text>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={s.canvas}>
          {/* Page header */}
          <View style={s.pageHeader}>
            <View style={{ flex: 1 }}>
              <Text style={s.pageTitle}>What-If Business Simulator</Text>
              <Text style={s.pageSubtitle}>Model operational changes and predict financial outcomes before spending money.</Text>
            </View>
            <View style={s.headerBtns}>
              <TouchableOpacity style={s.outlineBtn}>
                <Ionicons name="save-outline" size={13} color={C.primary} />
                <Text style={s.outlineBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.solidBtn}>
                <Ionicons name="play" size={13} color={C.onPrimary} />
                <Text style={s.solidBtnText}>Run</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Scenario Selector */}
          <View style={s.scenarioRow}>
            {SCENARIOS.map(sc => (
              <TouchableOpacity
                key={sc.key}
                onPress={() => setSelectedScenario(sc.key)}
                style={[s.scenarioBtn, selectedScenario === sc.key && s.scenarioBtnActive]}
              >
                <Ionicons name={sc.icon as any} size={18} color={selectedScenario === sc.key ? C.onPrimary : sc.color} />
                <Text style={[s.scenarioBtnText, selectedScenario === sc.key && s.scenarioBtnTextActive]}>
                  {sc.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.grid}>
            {/* ── Left: Parameters Panel ── */}
            <View style={{ flex: 1, gap: 12 }}>
              <View style={[s.card, s.borderGreen]}>
                <View style={s.cardTitleRow}>
                  <Ionicons name="options-outline" size={18} color={C.onTertiaryContainer} />
                  <Text style={s.cardTitle}>Simulation Parameters</Text>
                </View>

                {/* Staffing slider */}
                <View style={s.paramSection}>
                  <View style={s.paramHeader}>
                    <Text style={s.paramLabel}>STAFFING LEVEL</Text>
                    <Text style={s.paramValue}>{staffCount} Employees</Text>
                  </View>
                  <View style={s.sliderTrack}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <TouchableOpacity
                        key={n}
                        onPress={() => setStaffCount(n)}
                        style={[s.sliderDot, n <= staffCount && s.sliderDotFilled]}
                      />
                    ))}
                  </View>
                  <View style={s.sliderLabels}>
                    <Text style={s.sliderLabelText}>Skeleton</Text>
                    <Text style={s.sliderLabelText}>Peak Ready</Text>
                  </View>
                </View>

                {/* Operating hours */}
                <View style={s.paramSection}>
                  <Text style={s.paramLabel}>DAILY HOURS</Text>
                  <View style={s.hoursRow}>
                    <View style={s.hoursBox}>
                      <Text style={s.hoursBoxLabel}>Open</Text>
                      <Text style={s.hoursBoxVal}>07:00 AM</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={16} color={C.secondary} />
                    <View style={s.hoursBox}>
                      <Text style={s.hoursBoxLabel}>Close</Text>
                      <Text style={s.hoursBoxVal}>06:00 PM</Text>
                    </View>
                  </View>
                </View>

                {/* Average ticket */}
                <View style={s.paramSection}>
                  <Text style={s.paramLabel}>TARGET AVG TICKET</Text>
                  <View style={s.ticketInput}>
                    <Text style={s.ticketSymbol}>₹</Text>
                    <Text style={s.ticketVal}>850</Text>
                  </View>
                </View>

                {/* AI tip */}
                <View style={s.aiTip}>
                  <Ionicons name="sparkles" size={14} color={C.onTertiaryContainer} />
                  <Text style={s.aiTipLabel}>AI RECOMMENDATION</Text>
                </View>
                <Text style={s.aiTipText}>{result.recommendation}</Text>
              </View>

              {/* Café image */}
              <View style={[s.card, { padding: 0, overflow: 'hidden' }]}>
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUPK5WENvgfQIGvjKZK_OkEn1yWov7msUXJ7W7mspg8KwoxwptdiaoTZNbrVGQ0d7_uD27_Ne5_f4PtEWm1gRYUEOlDI0ath1hvNMxS4sE6qeaCNTbin2foZPT5iK9CR35TrK8UAKW4NCHVDT0LkDaSYgG8YXYZ1GumIk42O7Y8qtRUe3FDWftghtqtq4MHbFoKb6CO4MSaRFbvx-LxxfrZVuhp4JBFIRD8Rr6oJD_ZYJlGZp5IFUEi7NzjimK7R5r1K0a_pPmDfEe' }}
                  style={s.cafeImg}
                  resizeMode="cover"
                />
                <View style={s.cafeImgOverlay}>
                  <Text style={s.cafeImgLabel}>Current Layout: Morning Brew Main St.</Text>
                </View>
              </View>
            </View>

            {/* ── Right: Results Panel ── */}
            <View style={{ flex: 1.6, gap: 12 }}>
              {/* Impact metrics */}
              <View style={s.metricsRow}>
                <View style={[s.metricCard, s.borderGreen]}>
                  <View style={s.metricTop}>
                    <View style={[s.metricIcon, { backgroundColor: C.tertiaryFixed }]}>
                      <Ionicons name="trending-up" size={16} color={C.onTertiaryContainer} />
                    </View>
                    <View style={[s.metricBadge, { backgroundColor: C.tertiaryFixed }]}>
                      <Text style={[s.metricBadgeText, { color: C.onTertiaryContainer }]}>{result.profitDelta}</Text>
                    </View>
                  </View>
                  <Text style={s.metricLabel}>NET PROFIT IMPACT</Text>
                  <Text style={s.metricValue}>{result.profit}<Text style={s.metricUnit}>/mo</Text></Text>
                </View>

                <View style={[s.metricCard, s.borderRed]}>
                  <View style={s.metricTop}>
                    <View style={[s.metricIcon, { backgroundColor: C.errorContainer }]}>
                      <Ionicons name="people" size={16} color={C.error} />
                    </View>
                    <View style={[s.metricBadge, { backgroundColor: C.errorContainer }]}>
                      <Text style={[s.metricBadgeText, { color: C.error }]}>{result.laborDelta}</Text>
                    </View>
                  </View>
                  <Text style={s.metricLabel}>LABOR COST DELTA</Text>
                  <Text style={s.metricValue}>{result.labor}<Text style={s.metricUnit}> Total</Text></Text>
                </View>

                <View style={[s.metricCard, s.borderAmber]}>
                  <View style={s.metricTop}>
                    <View style={[s.metricIcon, { backgroundColor: C.secondaryContainer }]}>
                      <Ionicons name="timer-outline" size={16} color={C.onSurfaceVariant} />
                    </View>
                    <View style={[s.metricBadge, { backgroundColor: C.tertiaryFixed }]}>
                      <Text style={[s.metricBadgeText, { color: C.onTertiaryContainer }]}>{result.waitDelta}</Text>
                    </View>
                  </View>
                  <Text style={s.metricLabel}>WAIT TIME REDUCTION</Text>
                  <Text style={s.metricValue}>{result.waitTime}<Text style={s.metricUnit}> Avg</Text></Text>
                </View>
              </View>

              {/* Bar chart */}
              <View style={s.card}>
                <Text style={s.cardTitle}>Performance Delta Visualization</Text>
                <Text style={s.cardSub}>Current vs. Predicted — {SCENARIOS.find(sc => sc.key === selectedScenario)?.label} Scenario</Text>
                <BarChart bars={result.bars} />
                <View style={s.chartFooter}>
                  <View style={s.chartFooterLeft}>
                    <View style={s.infoBox}>
                      <Ionicons name="information-circle-outline" size={18} color={C.primary} />
                    </View>
                    <Text style={s.chartFooterText}>Simulation assumes current morning demand levels (avg. 45 customers/hr between 8–10am).</Text>
                  </View>
                  <TouchableOpacity style={s.breakdownLink}>
                    <Text style={s.breakdownText}>View Full Data</Text>
                    <Ionicons name="arrow-forward" size={14} color={C.onTertiaryContainer} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Prediction summary */}
              <View style={[s.card, { backgroundColor: C.primaryContainer }]}>
                <View style={s.predHeader}>
                  <Ionicons name="sparkles" size={16} color={C.onPrimaryContainer} />
                  <Text style={[s.cardTitle, { color: C.onPrimaryContainer }]}>AI Prediction Summary</Text>
                </View>
                <View style={s.predGrid}>
                  {[
                    { icon: 'cash-outline', label: 'Revenue Impact', val: result.profitDelta, positive: true },
                    { icon: 'people-outline', label: 'Cost Increase', val: result.laborDelta, positive: false },
                    { icon: 'timer-outline', label: 'Wait Time Change', val: result.waitDelta, positive: result.waitDelta.startsWith('–') },
                    { icon: 'star-outline', label: 'Rating Impact', val: '+0.3 stars', positive: true },
                  ].map((item, i) => (
                    <View key={i} style={s.predItem}>
                      <Ionicons name={item.icon as any} size={16} color={C.onPrimaryContainer} />
                      <View>
                        <Text style={s.predLabel}>{item.label}</Text>
                        <Text style={[s.predVal, { color: item.positive ? C.tertiaryFixedDim : '#ffdbce' }]}>{item.val}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* FAB */}
      <TouchableOpacity style={s.fab}>
        <Ionicons name="flash" size={16} color={C.onPrimary} />
        <Text style={s.fabText}>Sarvam AI Assistant</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: C.background },
  topNav: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.outlineVariant },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F9F7F5', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: '#E5E7EB', flex: 1, maxWidth: 260 },
  searchInput: { fontSize: 12, color: C.onSurface, flex: 1 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  userName: { fontSize: 12, color: C.secondary, fontWeight: '600' },
  canvas: { padding: 16, paddingBottom: 100 },
  pageHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 8 },
  pageTitle: { fontSize: 18, fontWeight: '900', color: C.primary },
  pageSubtitle: { fontSize: 12, color: C.secondary, marginTop: 3, lineHeight: 18 },
  headerBtns: { flexDirection: 'row', gap: 8 },
  outlineBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1.5, borderColor: C.primary, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  outlineBtnText: { fontSize: 11, color: C.primary, fontWeight: '700' },
  solidBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.primary, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  solidBtnText: { fontSize: 11, color: C.onPrimary, fontWeight: '700' },
  scenarioRow: { flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  scenarioBtn: { flex: 1, minWidth: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1.5, borderColor: C.outlineVariant, backgroundColor: C.surfaceContainerLowest },
  scenarioBtnActive: { backgroundColor: C.primary, borderColor: C.primary },
  scenarioBtnText: { fontSize: 11, fontWeight: '700', color: C.secondary },
  scenarioBtnTextActive: { color: C.onPrimary },
  grid: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  card: { backgroundColor: C.surfaceContainerLowest, borderRadius: 12, padding: 14, shadowColor: '#4b2c20', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  borderGreen: { borderTopWidth: 4, borderTopColor: C.onTertiaryContainer },
  borderRed: { borderTopWidth: 4, borderTopColor: C.error },
  borderAmber: { borderTopWidth: 4, borderTopColor: C.amber },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: C.primary },
  cardSub: { fontSize: 11, color: C.secondary, marginTop: 2, marginBottom: 8 },
  paramSection: { marginBottom: 14 },
  paramHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  paramLabel: { fontSize: 9, fontWeight: '800', color: C.secondary, letterSpacing: 1.5, textTransform: 'uppercase' },
  paramValue: { fontSize: 13, fontWeight: '800', color: C.primary },
  sliderTrack: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  sliderDot: { flex: 1, height: 8, borderRadius: 4, backgroundColor: C.surfaceContainer },
  sliderDotFilled: { backgroundColor: C.primary },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  sliderLabelText: { fontSize: 9, color: C.onSurfaceVariant },
  hoursRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  hoursBox: { flex: 1, backgroundColor: '#F9F7F5', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 8, alignItems: 'center' },
  hoursBoxLabel: { fontSize: 9, color: C.secondary, fontWeight: '600' },
  hoursBoxVal: { fontSize: 13, fontWeight: '800', color: C.onSurface, marginTop: 2 },
  ticketInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F7F5', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginTop: 6 },
  ticketSymbol: { fontSize: 14, color: C.secondary, marginRight: 4 },
  ticketVal: { fontSize: 16, fontWeight: '800', color: C.onSurface },
  aiTip: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4, marginTop: 4 },
  aiTipLabel: { fontSize: 9, fontWeight: '800', color: C.onTertiaryContainer, letterSpacing: 1.2 },
  aiTipText: { fontSize: 12, color: C.secondary, fontStyle: 'italic', lineHeight: 18 },
  cafeImg: { width: '100%', height: 160 },
  cafeImgOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.55)', padding: 10 },
  cafeImgLabel: { color: '#fff', fontSize: 11, fontWeight: '700' },
  metricsRow: { flexDirection: 'row', gap: 8 },
  metricCard: { flex: 1, backgroundColor: C.surfaceContainerLowest, borderRadius: 12, padding: 12, shadowColor: '#4b2c20', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2 },
  metricTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  metricIcon: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  metricBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  metricBadgeText: { fontSize: 9, fontWeight: '800' },
  metricLabel: { fontSize: 8, fontWeight: '700', color: C.secondary, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 },
  metricValue: { fontSize: 18, fontWeight: '900', color: C.primary },
  metricUnit: { fontSize: 11, color: C.secondary },
  chartFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.outlineVariant, flexWrap: 'wrap', gap: 8 },
  chartFooterLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, flex: 1 },
  infoBox: { backgroundColor: C.surfaceContainer, padding: 6, borderRadius: 8 },
  chartFooterText: { flex: 1, fontSize: 11, color: C.secondary, lineHeight: 16 },
  breakdownLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  breakdownText: { fontSize: 12, color: C.onTertiaryContainer, fontWeight: '700' },
  predHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  predGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  predItem: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '47%' },
  predLabel: { fontSize: 9, color: C.onPrimaryContainer, fontWeight: '600', opacity: 0.8 },
  predVal: { fontSize: 14, fontWeight: '900' },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: C.primary, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 8 },
  fabText: { fontSize: 12, fontWeight: '700', color: C.onPrimary },
});
