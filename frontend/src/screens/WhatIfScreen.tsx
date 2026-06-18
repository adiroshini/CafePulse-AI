import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
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

type ScenarioKey = 'hire_employee' | 'reduce_price' | 'run_promotion' | 'add_combo';

const SCENARIOS: { key: ScenarioKey; label: string; icon: React.ComponentProps<typeof Ionicons>['name']; color: string }[] = [
  { key: 'hire_employee', label: 'Hire Employee', icon: 'people-outline', color: C.onTertiaryContainer },
  { key: 'reduce_price', label: 'Reduce Price', icon: 'pricetag-outline', color: C.amber },
  { key: 'run_promotion', label: 'Run Promotion', icon: 'megaphone-outline', color: '#4285F4' },
  { key: 'add_combo', label: 'Add Combo', icon: 'fast-food-outline', color: C.primary },
];

const RESULTS: Record<ScenarioKey, {
  profit: string; profitDelta: string;
  labor: string; laborDelta: string;
  wait: string; waitDelta: string;
  bars: [number, number, number];
  tip: string;
  revImpact: string; costChange: string; waitChange: string; ratingImpact: string;
  staffDots: number;
}> = {
  hire_employee: {
    profit: '₹4,250', profitDelta: '+12.5%', labor: '₹12.4k', laborDelta: '–₹2,800',
    wait: '2.8m', waitDelta: '–3.5m', bars: [85, 90, 55],
    tip: 'Adding 1 staff during peak hours (12–2 PM) reduces wait by 35%.',
    revImpact: '+12.5%', costChange: '+₹2,800/mo', waitChange: '–3.5 min', ratingImpact: '+0.4 ⭐',
    staffDots: 7,
  },
  reduce_price: {
    profit: '₹2,800', profitDelta: '+8.2%', labor: '₹9.8k', laborDelta: '–₹0',
    wait: '5.2m', waitDelta: '–1.2m', bars: [78, 65, 40],
    tip: 'A 10% price reduction on slow items can increase volume by 18%.',
    revImpact: '+8.2%', costChange: '–₹0', waitChange: '–1.2 min', ratingImpact: '+0.2 ⭐',
    staffDots: 5,
  },
  run_promotion: {
    profit: '₹5,100', profitDelta: '+15%', labor: '₹10.2k', laborDelta: '–₹500',
    wait: '7.1m', waitDelta: '+0.7m', bars: [92, 50, 48],
    tip: 'BOGO promotions on weekdays typically drive 20% more footfall.',
    revImpact: '+15%', costChange: '–₹500', waitChange: '+0.7 min', ratingImpact: 'Neutral',
    staffDots: 5,
  },
  add_combo: {
    profit: '₹3,600', profitDelta: '+10.4%', labor: '₹9.8k', laborDelta: '–₹0',
    wait: '6.1m', waitDelta: '–0.3m', bars: [82, 70, 40],
    tip: 'Cappuccino + Brownie combo increases avg order value by 12%.',
    revImpact: '+10.4%', costChange: '–₹0', waitChange: '–0.3 min', ratingImpact: '+0.1 ⭐',
    staffDots: 5,
  },
};

const BAR_LABELS = ['Revenue', 'Speed', 'Cost'];
const BAR_CURRENT = [70, 60, 60];

export default function WhatIfScreen() {
  const [scenario, setScenario] = useState<ScenarioKey>('hire_employee');
  const r = RESULTS[scenario];

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.pageTitle}>What-If Simulator</Text>
          <Text style={s.pageSubtitle}>Predict outcomes before acting</Text>
        </View>
        <TouchableOpacity style={s.runBtn}>
          <Ionicons name="play-circle-outline" size={14} color={C.onPrimary} />
          <Text style={s.runBtnText}>Run</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Scenario Grid */}
        <View style={s.scenarioGrid}>
          {SCENARIOS.map(sc => (
            <TouchableOpacity
              key={sc.key}
              style={[s.scenarioBtn, scenario === sc.key && { borderColor: sc.color, backgroundColor: sc.color + '15' }]}
              onPress={() => setScenario(sc.key)}
            >
              <Ionicons name={sc.icon} size={22} color={sc.color} />
              <Text style={[s.scenarioBtnText, scenario === sc.key && { color: sc.color }]}>{sc.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Parameters Card */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Parameters</Text>
          <Text style={s.paramLabel}>Staffing Level</Text>
          <View style={s.dotsRow}>
            {Array.from({ length: 10 }, (_, i) => (
              <View key={i} style={[s.dot, i < r.staffDots && { backgroundColor: C.primary }]} />
            ))}
            <Text style={s.dotsCount}>{r.staffDots}/10</Text>
          </View>
          <Text style={s.paramLabel}>Operating Hours</Text>
          <Text style={s.paramValue}>07:00 – 18:00</Text>
          <View style={[s.tipBox, { borderLeftColor: C.onTertiaryContainer }]}>
            <Text style={s.tipText}>{r.tip}</Text>
          </View>
        </View>

        {/* Impact Metric Cards */}
        <View style={s.metricRow}>
          <View style={[s.metricCard, { borderTopColor: C.onTertiaryContainer }]}>
            <Text style={s.metricLabel}>Net Profit</Text>
            <Text style={[s.metricValue, { color: C.onTertiaryFixedVariant }]}>{r.profit}</Text>
            <Text style={s.metricDelta}>{r.profitDelta}</Text>
          </View>
          <View style={[s.metricCard, { borderTopColor: C.error }]}>
            <Text style={s.metricLabel}>Labor Cost</Text>
            <Text style={[s.metricValue, { color: C.error }]}>{r.labor}</Text>
            <Text style={s.metricDelta}>{r.laborDelta}</Text>
          </View>
          <View style={[s.metricCard, { borderTopColor: C.amber }]}>
            <Text style={s.metricLabel}>Wait Time</Text>
            <Text style={[s.metricValue, { color: C.amber }]}>{r.wait}</Text>
            <Text style={s.metricDelta}>{r.waitDelta}</Text>
          </View>
        </View>

        {/* Bar Chart Card */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Performance Delta</Text>
          <Text style={s.chartSubtitle}>Current vs Predicted</Text>
          <View style={s.barChartArea}>
            {BAR_LABELS.map((label, i) => (
              <View key={i} style={s.barGroup}>
                <View style={s.barsRow}>
                  <View style={[s.chartBar, { height: BAR_CURRENT[i] * 0.9, backgroundColor: C.surfaceContainerHighest }]} />
                  <View style={[s.chartBar, { height: r.bars[i] * 0.9, backgroundColor: [C.onTertiaryContainer, '#4285F4', C.amber][i] }]} />
                </View>
                <Text style={s.barGroupLabel}>{label}</Text>
              </View>
            ))}
          </View>
          <View style={s.legendRow}>
            <View style={s.legendItem}><View style={[s.legendDot, { backgroundColor: C.surfaceContainerHighest, borderWidth: 1, borderColor: C.outlineVariant }]} /><Text style={s.legendText}>Current</Text></View>
            <View style={s.legendItem}><View style={[s.legendDot, { backgroundColor: C.primary }]} /><Text style={s.legendText}>Predicted</Text></View>
          </View>
        </View>

        {/* Café Image */}
        <View style={s.card}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80' }}
            style={s.cafeImage}
            resizeMode="cover"
          />
        </View>

        {/* AI Summary Card */}
        <View style={[s.card, { backgroundColor: C.primaryContainer }]}>
          <View style={s.aiSummaryHeader}>
            <Ionicons name="sparkles" size={15} color={C.onPrimaryContainer} />
            <Text style={[s.cardTitle, { color: C.onPrimary, marginBottom: 0 }]}>AI Impact Summary</Text>
          </View>
          <View style={s.summaryGrid}>
            <View style={s.summaryCell}>
              <Text style={s.summaryCellLabel}>Revenue Impact</Text>
              <Text style={s.summaryCellValue}>{r.revImpact}</Text>
            </View>
            <View style={s.summaryCell}>
              <Text style={s.summaryCellLabel}>Cost Change</Text>
              <Text style={s.summaryCellValue}>{r.costChange}</Text>
            </View>
            <View style={s.summaryCell}>
              <Text style={s.summaryCellLabel}>Wait Time</Text>
              <Text style={s.summaryCellValue}>{r.waitChange}</Text>
            </View>
            <View style={s.summaryCell}>
              <Text style={s.summaryCellLabel}>Rating Impact</Text>
              <Text style={s.summaryCellValue}>{r.ratingImpact}</Text>
            </View>
          </View>
        </View>

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
  runBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  runBtnText: { fontSize: 12, fontWeight: '800', color: C.onPrimary },
  content: { padding: 14 },
  scenarioGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  scenarioBtn: { width: '47%', backgroundColor: C.surfaceContainerLowest, borderRadius: 12, padding: 14, alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: C.outlineVariant, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  scenarioBtnText: { fontSize: 12, fontWeight: '700', color: C.onSurface, textAlign: 'center' },
  card: { backgroundColor: C.surfaceContainerLowest, borderRadius: 14, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: C.primary, marginBottom: 10 },
  paramLabel: { fontSize: 11, color: C.secondary, fontWeight: '600', marginTop: 8, marginBottom: 6 },
  dotsRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: C.surfaceContainerHighest },
  dotsCount: { fontSize: 11, color: C.secondary, marginLeft: 6, fontWeight: '600' },
  paramValue: { fontSize: 14, fontWeight: '700', color: C.onSurface, marginBottom: 10 },
  tipBox: { borderLeftWidth: 3, backgroundColor: C.tertiaryFixed + '30', borderRadius: 8, padding: 10, marginTop: 4 },
  tipText: { fontSize: 12, color: C.onTertiaryFixedVariant, lineHeight: 18, fontStyle: 'italic' },
  metricRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  metricCard: { flex: 1, backgroundColor: C.surfaceContainerLowest, borderRadius: 12, padding: 10, alignItems: 'center', borderTopWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  metricLabel: { fontSize: 9, color: C.secondary, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  metricValue: { fontSize: 18, fontWeight: '900' },
  metricDelta: { fontSize: 10, color: C.secondary, fontWeight: '600', marginTop: 2 },
  barChartArea: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 100, marginVertical: 10 },
  barGroup: { alignItems: 'center', gap: 6 },
  barsRow: { flexDirection: 'row', gap: 4, alignItems: 'flex-end' },
  chartBar: { width: 22, borderRadius: 4 },
  barGroupLabel: { fontSize: 10, color: C.secondary, fontWeight: '600' },
  legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 10, color: C.secondary },
  cafeImage: { width: '100%', height: 160, borderRadius: 10 },
  aiSummaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  summaryCell: { width: '47%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 12 },
  summaryCellLabel: { fontSize: 10, color: C.onPrimaryContainer, fontWeight: '600', marginBottom: 4 },
  summaryCellValue: { fontSize: 16, fontWeight: '900', color: C.onPrimary },
  chartSubtitle: { fontSize: 11, color: C.secondary, marginBottom: 4 },
});
