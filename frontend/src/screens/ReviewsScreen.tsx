import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DEMO_REVIEWS, DEMO_DASHBOARD } from '../mock/demoData';

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

const COMPLAINTS = [
  { key: 'waiting_time', label: 'Waiting Time', count: 5, top: true },
  { key: 'staff_behavior', label: 'Staff Behavior', count: 3, top: false },
  { key: 'food_temperature', label: 'Food Temperature', count: 2, top: false },
  { key: 'food_quality', label: 'Food Quality', count: 1, top: false },
  { key: 'cleanliness', label: 'Cleanliness', count: 0, top: false },
];

const STRENGTHS = [
  { key: 'coffee_quality', label: 'Coffee Quality', count: 6, top: true },
  { key: 'ambience', label: 'Ambience', count: 4, top: false },
  { key: 'cleanliness', label: 'Cleanliness', count: 3, top: false },
  { key: 'food_quality', label: 'Food Quality', count: 2, top: false },
  { key: 'staff_behavior', label: 'Staff Behavior', count: 1, top: false },
];

const SOURCE_COLORS: Record<string, string> = {
  google: '#4285F4', zomato: '#E23744', swiggy: '#FC8019', manual: C.primary,
};

type Tab = 'insights' | 'rootcause' | 'reviews';

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons key={i} name="star" size={11} color={i <= rating ? C.amber : C.outlineVariant} />
      ))}
    </View>
  );
}

export default function ReviewsScreen() {
  const [tab, setTab] = useState<Tab>('insights');

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.pageTitle}>Reviews & Insights</Text>
        <View style={s.ratingBadge}>
          <Ionicons name="star" size={13} color={C.amber} />
          <Text style={s.ratingBadgeText}>{DEMO_DASHBOARD.avg_rating}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabs}>
        {(['insights', 'rootcause', 'reviews'] as Tab[]).map(key => (
          <TouchableOpacity key={key} style={[s.tab, tab === key && s.tabActive]} onPress={() => setTab(key)}>
            <Text style={[s.tabText, tab === key && s.tabTextActive]}>
              {key === 'insights' ? '🎯 Insights' : key === 'rootcause' ? '🔗 Root Cause' : '💬 Reviews'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── INSIGHTS TAB ── */}
      {tab === 'insights' && (
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          {/* Sentiment Pulse */}
          <View style={[s.card, { borderTopWidth: 3, borderTopColor: C.onTertiaryContainer }]}>
            <Text style={s.cardTitle}>Sentiment Pulse</Text>
            <View style={s.sentimentRow}>
              <View style={s.gaugeCircle}>
                <Text style={s.gaugeValue}>75%</Text>
                <Text style={s.gaugeLabel}>Positive</Text>
              </View>
              <View style={{ flex: 1, gap: 10 }}>
                <Text style={s.trendText}>+4.2% from last month</Text>
                <View>
                  <View style={s.barLabelRow}>
                    <Text style={s.barLabel}>Strengths</Text>
                    <Text style={s.barPct}>88%</Text>
                  </View>
                  <View style={s.barBg}>
                    <View style={[s.barFill, { width: '88%', backgroundColor: C.onTertiaryContainer }]} />
                  </View>
                </View>
                <View>
                  <View style={s.barLabelRow}>
                    <Text style={s.barLabel}>Weaknesses</Text>
                    <Text style={s.barPct}>32%</Text>
                  </View>
                  <View style={s.barBg}>
                    <View style={[s.barFill, { width: '32%', backgroundColor: C.amber }]} />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Complaint Tag Cloud */}
          <View style={[s.card, { borderTopWidth: 3, borderTopColor: C.error }]}>
            <Text style={s.cardTitle}>Complaint Tag Cloud</Text>
            <View style={s.tagCloud}>
              <View style={[s.tag, { backgroundColor: C.errorContainer }]}>
                <Text style={[s.tagText, { color: C.error, fontSize: 15 }]}>Waiting Time</Text>
              </View>
              <View style={[s.tag, { backgroundColor: C.secondaryContainer }]}>
                <Text style={[s.tagText, { color: C.secondary, fontSize: 12 }]}>Staff Behavior</Text>
              </View>
              <View style={[s.tag, { backgroundColor: C.surfaceContainerHighest }]}>
                <Text style={[s.tagText, { color: C.onSurfaceVariant, fontSize: 10 }]}>Cold Coffee</Text>
              </View>
              <View style={[s.tag, { backgroundColor: C.secondaryContainer }]}>
                <Text style={[s.tagText, { color: C.secondary, fontSize: 14 }]}>Price Point</Text>
              </View>
              <View style={[s.tag, { backgroundColor: C.surfaceContainerHighest }]}>
                <Text style={[s.tagText, { color: C.onSurfaceVariant, fontSize: 11 }]}>Loud Music</Text>
              </View>
            </View>
          </View>

          {/* Complaint Breakdown */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Complaint Breakdown</Text>
            {COMPLAINTS.map((c, i) => (
              <View key={i} style={s.breakdownRow}>
                <Text style={s.breakdownLabel}>{c.label}</Text>
                {c.top && (
                  <View style={[s.topBadge, { backgroundColor: C.errorContainer }]}>
                    <Text style={[s.topBadgeText, { color: C.error }]}>TOP</Text>
                  </View>
                )}
                <View style={s.breakdownBarBg}>
                  <View style={[s.breakdownBarFill, {
                    width: c.count > 0 ? `${(c.count / 6) * 100}%` : '2%',
                    backgroundColor: c.top ? C.error : C.secondary + '80',
                  }]} />
                </View>
                <Text style={s.breakdownCount}>{c.count}</Text>
              </View>
            ))}
          </View>

          {/* Strength Breakdown */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Strength Breakdown</Text>
            {STRENGTHS.map((c, i) => (
              <View key={i} style={s.breakdownRow}>
                <Text style={s.breakdownLabel}>{c.label}</Text>
                {c.top && (
                  <View style={[s.topBadge, { backgroundColor: C.tertiaryFixed }]}>
                    <Text style={[s.topBadgeText, { color: C.onTertiaryFixedVariant }]}>TOP</Text>
                  </View>
                )}
                <View style={s.breakdownBarBg}>
                  <View style={[s.breakdownBarFill, {
                    width: `${(c.count / 7) * 100}%`,
                    backgroundColor: c.top ? C.onTertiaryContainer : C.onTertiaryContainer + '60',
                  }]} />
                </View>
                <Text style={s.breakdownCount}>{c.count}</Text>
              </View>
            ))}
          </View>

          {/* At-Risk Card */}
          <View style={[s.card, { borderLeftWidth: 4, borderLeftColor: C.error }]}>
            <Text style={s.atRiskTitle}>🚨 {DEMO_DASHBOARD.at_risk_customer_count} Customers At Risk</Text>
            <Text style={s.atRiskDesc}>These customers have left 2+ low ratings and may not return.</Text>
            <Text style={s.atRiskBullet}>• Send loyalty reward or free coffee coupon</Text>
            <Text style={s.atRiskBullet}>• Follow up with personal apology message</Text>
            <Text style={s.atRiskBullet}>• Offer priority service on next visit</Text>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      )}

      {/* ── ROOT CAUSE TAB ── */}
      {tab === 'rootcause' && (
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          <View style={s.card}>
            <Text style={s.cardTitle}>Root Cause Analysis</Text>
            {/* Node 1 */}
            <View style={s.rcNode}>
              <View style={[s.rcIconBox, { backgroundColor: C.primaryContainer + '40' }]}>
                <Ionicons name="timer-outline" size={22} color={C.primary} />
              </View>
              <View style={s.rcNodeText}>
                <Text style={s.rcNodeTitle}>Long Waiting Time</Text>
                <Text style={s.rcNodeDesc}>Avg. 22 min during peak hours (expected: 10 min)</Text>
              </View>
            </View>
            <View style={s.rcArrow}><Text style={s.rcArrowText}>↓</Text></View>
            {/* Node 2 */}
            <View style={s.rcNode}>
              <View style={[s.rcIconBox, { backgroundColor: C.errorContainer }]}>
                <Ionicons name="thumbs-down-outline" size={22} color={C.error} />
              </View>
              <View style={s.rcNodeText}>
                <Text style={s.rcNodeTitle}>Negative Reviews</Text>
                <Text style={s.rcNodeDesc}>60% of reviews mention waiting time. Rating dropped to 3.4</Text>
              </View>
            </View>
            <View style={s.rcArrow}><Text style={s.rcArrowText}>↓</Text></View>
            {/* Node 3 */}
            <View style={s.rcNode}>
              <View style={[s.rcIconBox, { backgroundColor: C.primary }]}>
                <Ionicons name="trending-down-outline" size={22} color={C.onPrimary} />
              </View>
              <View style={s.rcNodeText}>
                <Text style={s.rcNodeTitle}>Revenue Loss –18%</Text>
                <Text style={s.rcNodeDesc}>Reduced repeat customers driving monthly revenue decline</Text>
              </View>
            </View>
          </View>

          {/* AI Quote */}
          <View style={[s.card, { backgroundColor: C.tertiaryFixed + '30', borderLeftWidth: 3, borderLeftColor: C.onTertiaryContainer }]}>
            <Ionicons name="sparkles-outline" size={15} color={C.onTertiaryFixedVariant} />
            <Text style={s.aiQuote}>
              "A 10% reduction in waiting time correlates to an 8% increase in repeat customer revenue."
            </Text>
            <Text style={s.aiQuoteSource}>— Sarvam AI Analysis</Text>
          </View>

          {/* Chain Steps */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Causal Chain</Text>
            {['Waiting Time', 'Negative Reviews', 'Lower Ratings', 'Reduced Repeat Customers', 'Revenue Loss (–18%)'].map((step, i, arr) => (
              <View key={i}>
                <View style={s.chainStep}>
                  <View style={[s.chainDot, { backgroundColor: i === 0 ? C.amber : i === arr.length - 1 ? C.error : C.secondary }]} />
                  <Text style={s.chainStepText}>{step}</Text>
                </View>
                {i < arr.length - 1 && <View style={s.chainLine} />}
              </View>
            ))}
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      )}

      {/* ── REVIEWS TAB ── */}
      {tab === 'reviews' && (
        <FlatList
          data={DEMO_REVIEWS}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 30 }} />}
          renderItem={({ item }) => (
            <View style={s.reviewCard}>
              <View style={s.reviewHeader}>
                <View style={[s.sourceBadge, { backgroundColor: SOURCE_COLORS[item.source] }]}>
                  <Text style={s.sourceBadgeText}>{item.source.toUpperCase()}</Text>
                </View>
                <StarRow rating={item.rating} />
                <Text style={s.reviewRating}>{item.rating}/5</Text>
                <Text style={s.reviewDate}>{item.date}</Text>
              </View>
              <Text style={s.reviewText}>{item.text}</Text>
              <Text style={s.reviewCustomer}>— {item.customer_name}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.outlineVariant },
  pageTitle: { fontSize: 18, fontWeight: '900', color: C.primary },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.amber + '20', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  ratingBadgeText: { fontSize: 13, fontWeight: '900', color: C.amber },
  tabs: { flexDirection: 'row', backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.outlineVariant },
  tab: { flex: 1, paddingVertical: 11, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: C.primary },
  tabText: { fontSize: 11, color: C.secondary, fontWeight: '600' },
  tabTextActive: { color: C.primary, fontWeight: '800' },
  content: { padding: 14 },
  card: { backgroundColor: C.surfaceContainerLowest, borderRadius: 14, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: C.primary, marginBottom: 12 },
  sentimentRow: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  gaugeCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: C.tertiaryFixed + '50', borderWidth: 3, borderColor: C.onTertiaryContainer, justifyContent: 'center', alignItems: 'center' },
  gaugeValue: { fontSize: 16, fontWeight: '900', color: C.onTertiaryFixedVariant },
  gaugeLabel: { fontSize: 9, color: C.secondary, fontWeight: '600' },
  trendText: { fontSize: 11, color: C.onTertiaryFixedVariant, fontWeight: '700' },
  barLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  barLabel: { fontSize: 10, color: C.secondary, fontWeight: '600' },
  barPct: { fontSize: 10, color: C.onSurface, fontWeight: '700' },
  barBg: { height: 6, backgroundColor: C.surfaceContainerHighest, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  tagCloud: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  tagText: { fontWeight: '700' },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  breakdownLabel: { width: 110, fontSize: 11, color: C.onSurface, fontWeight: '500' },
  topBadge: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 },
  topBadgeText: { fontSize: 8, fontWeight: '900' },
  breakdownBarBg: { flex: 1, height: 6, backgroundColor: C.surfaceContainerHighest, borderRadius: 3, overflow: 'hidden' },
  breakdownBarFill: { height: '100%', borderRadius: 3 },
  breakdownCount: { width: 16, fontSize: 11, fontWeight: '700', color: C.onSurface, textAlign: 'right' },
  atRiskTitle: { fontSize: 15, fontWeight: '900', color: C.error, marginBottom: 6 },
  atRiskDesc: { fontSize: 12, color: C.secondary, marginBottom: 8, lineHeight: 17 },
  atRiskBullet: { fontSize: 12, color: C.onSurface, lineHeight: 20 },
  rcNode: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rcIconBox: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
  rcNodeText: { flex: 1 },
  rcNodeTitle: { fontSize: 13, fontWeight: '800', color: C.onSurface },
  rcNodeDesc: { fontSize: 11, color: C.secondary, lineHeight: 16, marginTop: 2 },
  rcArrow: { paddingLeft: 20, paddingVertical: 4 },
  rcArrowText: { fontSize: 20, color: C.primary, fontWeight: '900' },
  aiQuote: { fontSize: 13, color: C.onTertiaryFixedVariant, fontStyle: 'italic', lineHeight: 20, marginTop: 8, marginBottom: 4 },
  aiQuoteSource: { fontSize: 10, color: C.secondary, fontWeight: '600' },
  chainStep: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  chainDot: { width: 10, height: 10, borderRadius: 5 },
  chainStepText: { fontSize: 13, color: C.onSurface, fontWeight: '500' },
  chainLine: { width: 2, height: 18, backgroundColor: C.outlineVariant, marginLeft: 4 },
  reviewCard: { backgroundColor: C.surfaceContainerLowest, borderRadius: 12, padding: 13, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  sourceBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 5 },
  sourceBadgeText: { fontSize: 8, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  reviewRating: { fontSize: 11, fontWeight: '700', color: C.amber },
  reviewDate: { fontSize: 10, color: C.secondary, marginLeft: 'auto' },
  reviewText: { fontSize: 12, color: C.onSurface, lineHeight: 18, marginBottom: 6 },
  reviewCustomer: { fontSize: 11, color: C.secondary, fontWeight: '600' },
});
