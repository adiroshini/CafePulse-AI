import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DEMO_DASHBOARD, DEMO_BUSINESS, DEMO_RECOMMENDATIONS } from '../mock/demoData';

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

const ALERTS = [
  { icon: 'timer-outline' as const, color: C.error, bg: C.errorContainer, text: 'Waiting time increased 12% in the last hour', label: 'Critical' },
  { icon: 'cube-outline' as const, color: C.amber, bg: '#fff8e1', text: 'Oat Milk below 15% stock — reorder needed', label: 'Warning' },
  { icon: 'chatbubble-ellipses-outline' as const, color: C.onTertiaryFixedVariant, bg: C.tertiaryFixed + '50', text: '"The croissant was great, loved the vibe!"', label: 'Positive' },
];

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const d = DEMO_DASHBOARD;

  return (
    <View style={s.root}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.logoBox}>
            <Ionicons name="cafe" size={18} color={C.onPrimary} />
          </View>
          <View>
            <Text style={s.cafeName}>{DEMO_BUSINESS.cafe_name}</Text>
            <View style={s.demoBadge}>
              <Text style={s.demoBadgeText}>DEMO</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={s.notifBtn}>
          <Ionicons name="notifications-outline" size={22} color={C.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); }} tintColor={C.primary} />}
      >
        <View style={s.healthCard}>
          <View style={s.healthTop}>
            <View>
              <Text style={s.healthLabel}>Business Health Score</Text>
              <Text style={s.healthScore}>{d.health_score}</Text>
              <Text style={s.healthMax}>/100</Text>
            </View>
            <View style={[s.riskPill, { backgroundColor: C.amber + '30' }]}>
              <Text style={[s.riskText, { color: C.amber }]}>{d.risk_level} Risk</Text>
            </View>
          </View>
          <View style={s.scoreBarBg}>
            <View style={[s.scoreBarFill, { width: `${d.health_score}%` as any }]} />
          </View>
          <Text style={s.healthSummary}>
            AI: Waiting time is the primary driver of negative reviews and reduced repeat customers.
          </Text>
        </View>

        <View style={s.kpiRow}>
          <View style={[s.kpiCard, { borderTopColor: C.error }]}>
            <Ionicons name="trending-down-outline" size={16} color={C.error} />
            <Text style={[s.kpiValue, { color: C.error }]}>{d.revenue_trend_pct}%</Text>
            <Text style={s.kpiLabel}>Revenue{'\n'}Trend</Text>
          </View>
          <View style={[s.kpiCard, { borderTopColor: C.amber }]}>
            <Ionicons name="star" size={16} color={C.amber} />
            <Text style={[s.kpiValue, { color: C.amber }]}>{d.avg_rating}</Text>
            <Text style={s.kpiLabel}>Avg{'\n'}Rating</Text>
          </View>
          <View style={[s.kpiCard, { borderTopColor: C.error }]}>
            <Ionicons name="warning-outline" size={16} color={C.error} />
            <Text style={[s.kpiValue, { color: C.error }]}>{d.at_risk_customer_count}</Text>
            <Text style={s.kpiLabel}>At{'\n'}Risk</Text>
          </View>
        </View>

        <View style={s.revenueCard}>
          <Text style={s.revenueLabel}>Total Revenue (This Month)</Text>
          <Text style={s.revenueValue}>₹{d.total_revenue.toLocaleString('en-IN')}</Text>
        </View>

        <View style={s.psRow}>
          <View style={[s.psCard, { borderLeftColor: C.error }]}>
            <Text style={s.psIcon}>⚠️</Text>
            <Text style={s.psTitle}>Top Problem</Text>
            <Text style={[s.psValue, { color: C.error }]}>Waiting Time</Text>
          </View>
          <View style={[s.psCard, { borderLeftColor: C.onTertiaryContainer }]}>
            <Text style={s.psIcon}>✅</Text>
            <Text style={s.psTitle}>Top Strength</Text>
            <Text style={[s.psValue, { color: C.onTertiaryFixedVariant }]}>Coffee Quality</Text>
          </View>
        </View>

        <View style={[s.card, { backgroundColor: C.surfaceContainerLow }]}>
          <View style={s.cardTitleRow}>
            <Ionicons name="git-branch-outline" size={15} color={C.primary} />
            <Text style={s.cardTitle}>Root Cause Chain</Text>
          </View>
          <Text style={s.chainText}>
            Waiting Time → Negative Reviews → Lower Ratings → Reduced Repeat Customers → Revenue Loss (–18%)
          </Text>
        </View>

        <Text style={s.sectionTitle}>Real-Time Alerts</Text>
        {ALERTS.map((a, i) => (
          <View key={i} style={[s.alertCard, { borderLeftColor: a.color }]}>
            <View style={[s.alertIconBox, { backgroundColor: a.bg }]}>
              <Ionicons name={a.icon} size={18} color={a.color} />
            </View>
            <View style={s.alertBody}>
              <Text style={s.alertText}>{a.text}</Text>
              <Text style={[s.alertLabel, { color: a.color }]}>{a.label}</Text>
            </View>
          </View>
        ))}

        <Text style={s.sectionTitle}>AI Recommendations</Text>
        {DEMO_RECOMMENDATIONS.map((r, i) => (
          <View key={i} style={s.recCard}>
            <View style={s.recHeader}>
              <View style={[s.priorityBadge, { backgroundColor: r.priority === 'High' ? C.errorContainer : C.secondaryContainer }]}>
                <Text style={[s.priorityText, { color: r.priority === 'High' ? C.error : C.secondary }]}>{r.priority}</Text>
              </View>
            </View>
            <Text style={s.recAction}>{r.action}</Text>
            <View style={s.recMetaRow}>
              <Text style={s.recMeta}>📈 {r.expected_revenue_impact}</Text>
              <Text style={s.recMeta}>⭐ {r.expected_rating_improvement}</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 90 }} />
      </ScrollView>

      <TouchableOpacity style={s.fab}>
        <Ionicons name="sparkles" size={16} color={C.onPrimary} />
        <Text style={s.fabText}>Sarvam AI</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.outlineVariant },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  cafeName: { fontSize: 15, fontWeight: '900', color: C.primary },
  demoBadge: { backgroundColor: C.amber + '30', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4, alignSelf: 'flex-start', marginTop: 2 },
  demoBadgeText: { fontSize: 9, fontWeight: '900', color: C.amber, letterSpacing: 1 },
  notifBtn: { padding: 4 },
  content: { padding: 14 },
  healthCard: { backgroundColor: C.primaryContainer, borderRadius: 16, padding: 16, marginBottom: 12 },
  healthTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  healthLabel: { fontSize: 11, color: C.onPrimaryContainer, fontWeight: '600', marginBottom: 4 },
  healthScore: { fontSize: 52, fontWeight: '900', color: C.onPrimary, lineHeight: 56 },
  healthMax: { fontSize: 13, color: C.onPrimaryContainer },
  riskPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  riskText: { fontSize: 11, fontWeight: '800' },
  scoreBarBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
  scoreBarFill: { height: '100%', backgroundColor: C.amber, borderRadius: 4 },
  healthSummary: { fontSize: 11, color: C.onPrimaryContainer, lineHeight: 16, fontStyle: 'italic' },
  kpiRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  kpiCard: { flex: 1, backgroundColor: C.surfaceContainerLowest, borderRadius: 12, padding: 12, alignItems: 'center', borderTopWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  kpiValue: { fontSize: 22, fontWeight: '900', marginVertical: 4 },
  kpiLabel: { fontSize: 10, color: C.secondary, textAlign: 'center', fontWeight: '600' },
  revenueCard: { backgroundColor: C.surfaceContainerLowest, borderRadius: 14, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  revenueLabel: { fontSize: 11, color: C.secondary, fontWeight: '600', marginBottom: 4 },
  revenueValue: { fontSize: 30, fontWeight: '900', color: C.primary },
  psRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  psCard: { flex: 1, backgroundColor: C.surfaceContainerLowest, borderRadius: 12, padding: 12, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  psIcon: { fontSize: 18, marginBottom: 4 },
  psTitle: { fontSize: 10, color: C.secondary, fontWeight: '600', marginBottom: 2 },
  psValue: { fontSize: 13, fontWeight: '800' },
  card: { borderRadius: 14, padding: 14, marginBottom: 12 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  cardTitle: { fontSize: 13, fontWeight: '800', color: C.primary },
  chainText: { fontSize: 12, color: C.onSurface, lineHeight: 20, fontWeight: '500' },
  sectionTitle: { fontSize: 15, fontWeight: '900', color: C.onSurface, marginBottom: 10 },
  alertCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.surfaceContainerLowest, borderRadius: 12, padding: 12, marginBottom: 8, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  alertIconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  alertBody: { flex: 1 },
  alertText: { fontSize: 12, color: C.onSurface, lineHeight: 17, fontWeight: '500' },
  alertLabel: { fontSize: 10, fontWeight: '800', marginTop: 2 },
  recCard: { backgroundColor: C.surfaceContainerLowest, borderRadius: 12, padding: 13, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  recHeader: { marginBottom: 6 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, alignSelf: 'flex-start' },
  priorityText: { fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },
  recAction: { fontSize: 13, color: C.onSurface, lineHeight: 19, fontWeight: '500', marginBottom: 8 },
  recMetaRow: { flexDirection: 'row', gap: 16 },
  recMeta: { fontSize: 11, color: C.secondary, fontWeight: '600' },
  fab: { position: 'absolute', bottom: 24, right: 20, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.primary, paddingHorizontal: 18, paddingVertical: 13, borderRadius: 30, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
  fabText: { fontSize: 13, fontWeight: '800', color: C.onPrimary },
});
