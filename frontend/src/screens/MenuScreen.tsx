import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DEMO_MENU, DEMO_COMBOS, DEMO_EXPERIMENTS } from '../mock/demoData';

const C = {
  primary: '#32170d', primaryContainer: '#4b2c20', onPrimary: '#ffffff',
  onPrimaryContainer: '#bf9282', onTertiaryContainer: '#6ba98a',
  tertiaryFixed: '#b1f0ce', onTertiaryFixedVariant: '#0e5138',
  error: '#ba1a1a', errorContainer: '#ffdad6',
  secondary: '#605e5b', secondaryContainer: '#e6e2de',
  surface: '#f8f9ff', surfaceContainerLow: '#eff4ff',
  surfaceContainerLowest: '#ffffff', surfaceContainerHighest: '#d9e3f6',
  onSurface: '#121c2a', onSurfaceVariant: '#504440',
  outlineVariant: '#d5c3bd', background: '#F5F1ED',
};

const EXP_IMGS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDBOm1vYsqTqEjigPr2-p8n1XqBrhKSkQ8Od2B8k3YnwKphShDHzjZN1pt5kU1B6T5-1XuT-5t3hkyVnYmruo0vcwVicF4fQr_PBwiyazJxxst1NKyi1_8tEidXW_FJkkZcWB6bAT4rz5bIybYZ40vPZP8KCDbsRaBn2oGtuqm-5wMla8uC8EOXXH_rlugRUB6X3ZwPn6_Nnd3XqhIbV7OJeaVr5FeJjFlu5zDofpmeZ-JoeUJ31Ki4U7pNKoFr8P_jNoobsQP7PgX8',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD1u98cugvvKPwoRR8It_dGlCkV6XgbcF-gXi7Q-hyGEYpSI_Zfq0kqSD8CllLPU1T27OhyJ2yKyWgXfPu2XFvtLdYHbrJbaQRPgId9_OwxQIZCY2HmtEVdfPSuNrZqMrxi-87auUI6DJCijPd8M5B9fO041vD-bMd0grgD-6BSi3egIg4QJR9S1tbI6hfED64_j1uqmLzP-Wj2BWPh0PCSiD5n0sAK3RI5Te85i7LLweaThbFEyWDGdV-DJ-lvg4XLOyovJ4qSk91N',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuALSonQqq6uxbK5JtxMkgzu2Uq0XijQy5pDdcSO6wZq9yjpu8V7qtB5l63v_DcFoK-9vUcsacXRxp_PfDXsarnV-McjxgKkiNOpHrAEOqaZze3HvAts7lD-_6i-3La9V4kVVfzZoTzn6xxnXsxsYW3bPgwn6Acb2jccTmxlSCtP9LeSMN4_bwHkGIcmd4Qq3QAEtcboQxBIxE-7RfcHGLrGJFGauF6PhL2YK8ugYIwPUeNO2Mk2Rp9vE3g4YBAbHc-wSinEXtU-wZxW',
];

const SUGGESTED = [
  { title: 'Latte + Brownie Combo', badge: 'High Potential', badgeColor: C.onTertiaryContainer, badgeBg: C.tertiaryFixed, desc: 'AI predicts +15% AOV bundling these high-margin items after 2 PM.', metric: 'Expected Lift: +₹180/order', borderColor: C.onTertiaryContainer },
  { title: 'Free Sample Campaign', badge: 'Awareness', badgeColor: C.secondary, badgeBg: C.surfaceContainerHighest, desc: 'Offer Ethiopian Roast samples to drip buyers. Convert 10% to premium.', metric: 'Target: Regulars', borderColor: C.primary },
  { title: 'Menu Layout A/B Test', badge: 'UX', badgeColor: C.onPrimaryContainer, badgeBg: C.primaryContainer + '30', desc: 'Move high-margin Specialty Brews to top of digital menu.', metric: 'Metric: View-to-Order %', borderColor: C.onPrimaryContainer },
];

const TABLE_DATA = [
  { initial: 'L', name: 'Oat Milk Latte', sales: '1,240', margin: '72%', healthy: true, status: 'High Performer' },
  { initial: 'B', name: 'Artisan Brownie', sales: '412', margin: '65%', healthy: true, status: 'Stable' },
  { initial: 'A', name: 'Avocado Toast', sales: '189', margin: '24%', healthy: false, status: 'Review Cost' },
  { initial: 'C', name: 'Cappuccino', sales: '980', margin: '68%', healthy: true, status: 'High Performer' },
  { initial: 'G', name: 'Green Tea', sales: '95', margin: '18%', healthy: false, status: 'Review Cost' },
];

const ACTIVE_EXP = [
  { title: '"Eco-Friendly" Cup Surcharge', status: 'Keep', healthy: true, desc: 'Testing ₹12 sustainable packaging fee.', progress: 85, progressLabel: '12/14 Days', roi: '+4.2%', roiColor: C.onTertiaryContainer },
  { title: 'Vegan Pastry Bundle', status: 'Improve', healthy: false, desc: 'Cross-selling oat milk with vegan croissants.', progress: 28, progressLabel: '4/14 Days', roi: '-1.1%', roiColor: C.primary },
];

export default function MenuScreen() {
  const [tab, setTab] = useState<'menu' | 'experiments' | 'combos'>('menu');
  const [launched, setLaunched] = useState<string[]>([]);

  const handleLaunch = (title: string) => {
    setLaunched(prev => [...prev, title]);
    Alert.alert('Launched!', `"${title}" is now active. Check results in 1-2 weeks.`);
  };

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.pageTitle}>Menu Studio</Text>
          <Text style={s.pageSubtitle}>Design, test and optimize with AI</Text>
        </View>
        <TouchableOpacity style={s.newBtn}>
          <Ionicons name="add" size={14} color={C.onPrimary} />
          <Text style={s.newBtnText}>New Experiment</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={s.tabs}>
        {(['menu', 'experiments', 'combos'] as const).map(key => (
          <TouchableOpacity
            key={key}
            style={[s.tab, tab === key && s.tabActive]}
            onPress={() => setTab(key)}
          >
            <Text style={[s.tabText, tab === key && s.tabTextActive]}>
              {key === 'menu' ? '📋 Menu' : key === 'experiments' ? '🧪 Tests' : '🎁 Combos'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── MENU TAB ── */}
      {tab === 'menu' && (
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

          {/* AI Insights */}
          <View style={s.card}>
            <View style={s.cardTitleRow}>
              <Ionicons name="bulb-outline" size={16} color={C.onTertiaryContainer} />
              <Text style={s.cardTitle}>AI Pulse Insights</Text>
            </View>
            <View style={[s.insightTip, { borderLeftColor: C.onTertiaryContainer }]}>
              <Text style={s.insightTipText}>
                "Customers who buy Pizza also buy Garlic Bread 84% of the time. Consider a Friday Night combo."
              </Text>
            </View>
            <View style={[s.insightTip, { borderLeftColor: C.onPrimaryContainer, marginTop: 8 }]}>
              <Text style={s.insightTipText}>
                "Cold Brew peaks 2-4 PM. A Happy Hour discount could increase volume by 12%."
              </Text>
            </View>
          </View>

          {/* Performance Table */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Menu Performance</Text>
            <View style={s.tableHeader}>
              <Text style={[s.colHeader, { flex: 2 }]}>ITEM</Text>
              <Text style={s.colHeader}>SALES</Text>
              <Text style={s.colHeader}>MARGIN</Text>
              <Text style={s.colHeader}>STATUS</Text>
            </View>
            {TABLE_DATA.map((row, i) => (
              <View key={i} style={[s.tableRow, i % 2 === 0 && s.tableRowAlt]}>
                <View style={[s.tableCell, { flex: 2, flexDirection: 'row', alignItems: 'center', gap: 7 }]}>
                  <View style={s.initBox}>
                    <Text style={s.initText}>{row.initial}</Text>
                  </View>
                  <Text style={s.itemName} numberOfLines={1}>{row.name}</Text>
                </View>
                <Text style={[s.tableCell, { fontWeight: '700' }]}>{row.sales}</Text>
                <Text style={[s.tableCell, { fontWeight: '700', color: row.healthy ? C.onTertiaryContainer : C.error }]}>
                  {row.margin}
                </Text>
                <View style={s.tableCell}>
                  <View style={[s.statusPill, { backgroundColor: row.healthy ? 'rgba(107,169,138,0.12)' : 'rgba(186,26,26,0.1)' }]}>
                    <Text style={[s.statusPillText, { color: row.healthy ? C.onTertiaryFixedVariant : C.error }]} numberOfLines={1}>
                      {row.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Suggested Experiments */}
          <Text style={s.sectionTitle}>🧪 Suggested Experiments</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 16 }}>
            {SUGGESTED.map((exp, i) => (
              <View key={i} style={[s.expCard, { borderTopColor: exp.borderColor }]}>
                <Image source={{ uri: EXP_IMGS[i] }} style={s.expImg} resizeMode="cover" />
                <View style={s.expBody}>
                  <View style={s.expTitleRow}>
                    <Text style={s.expTitle}>{exp.title}</Text>
                    <View style={[s.expBadge, { backgroundColor: exp.badgeBg }]}>
                      <Text style={[s.expBadgeText, { color: exp.badgeColor }]}>{exp.badge}</Text>
                    </View>
                  </View>
                  <Text style={s.expDesc}>{exp.desc}</Text>
                  <Text style={s.expMetric}>{exp.metric}</Text>
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

          {/* Active Experiments */}
          <Text style={[s.sectionTitle, { marginTop: 16 }]}>📊 Active Experiments</Text>
          {ACTIVE_EXP.map((exp, i) => (
            <View key={i} style={s.activeCard}>
              <View style={s.activeTitleRow}>
                <Text style={s.activeTitle}>{exp.title}</Text>
                <View style={[s.statusPill, { backgroundColor: exp.healthy ? 'rgba(107,169,138,0.12)' : C.surfaceContainerHighest }]}>
                  <Text style={[s.statusPillText, { color: exp.healthy ? C.onTertiaryFixedVariant : C.secondary }]}>
                    {exp.status}
                  </Text>
                </View>
              </View>
              <Text style={s.activeDesc}>{exp.desc}</Text>
              <View style={s.progressRow}>
                <Text style={s.progressLabel}>Progress ({exp.progressLabel})</Text>
                <Text style={s.progressPct}>{exp.progress}%</Text>
              </View>
              <View style={s.progressTrack}>
                <View style={[s.progressFill, {
                  width: `${exp.progress}%` as any,
                  backgroundColor: exp.healthy ? C.onTertiaryContainer : C.primary,
                }]} />
              </View>
              <View style={s.roiRow}>
                <Text style={s.roiLabel}>Est. ROI</Text>
                <Text style={[s.roiValue, { color: exp.roiColor }]}>{exp.roi}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ── EXPERIMENTS TAB ── */}
      {tab === 'experiments' && (
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          {ACTIVE_EXP.map((exp, i) => (
            <View key={i} style={s.activeCard}>
              <View style={s.activeTitleRow}>
                <Text style={s.activeTitle}>{exp.title}</Text>
                <View style={[s.statusPill, { backgroundColor: exp.healthy ? 'rgba(107,169,138,0.12)' : C.surfaceContainerHighest }]}>
                  <Text style={[s.statusPillText, { color: exp.healthy ? C.onTertiaryFixedVariant : C.secondary }]}>
                    {exp.status}
                  </Text>
                </View>
              </View>
              <Text style={s.activeDesc}>{exp.desc}</Text>
              <View style={s.progressRow}>
                <Text style={s.progressLabel}>Progress ({exp.progressLabel})</Text>
                <Text style={s.progressPct}>{exp.progress}%</Text>
              </View>
              <View style={s.progressTrack}>
                <View style={[s.progressFill, {
                  width: `${exp.progress}%` as any,
                  backgroundColor: exp.healthy ? C.onTertiaryContainer : C.primary,
                }]} />
              </View>
              <Text style={[s.roiValue, { color: exp.roiColor, marginTop: 8 }]}>{exp.roi} ROI</Text>
            </View>
          ))}
          {SUGGESTED.map((exp, i) => (
            <View key={i} style={[s.activeCard, { borderTopWidth: 3, borderTopColor: exp.borderColor }]}>
              <Text style={s.activeTitle}>{exp.title}</Text>
              <Text style={s.activeDesc}>{exp.desc}</Text>
              <TouchableOpacity
                style={[s.launchBtn, launched.includes(exp.title) && s.launchBtnDone, { marginTop: 10 }]}
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
      )}

      {/* ── COMBOS TAB ── */}
      {tab === 'combos' && (
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          <View style={s.infoBox}>
            <Ionicons name="sparkles" size={14} color={C.onTertiaryContainer} />
            <Text style={s.infoText}>
              AI identified products frequently purchased together to maximize order value.
            </Text>
          </View>
          {DEMO_COMBOS.map((combo, i) => (
            <View key={i} style={s.card}>
              <Text style={s.cardTitle}>{combo.combo_name}</Text>
              <View style={s.comboItems}>
                {combo.items.map((item, j) => (
                  <View key={j} style={s.comboItemBadge}>
                    <Text style={s.comboItemText}>{item}</Text>
                  </View>
                ))}
              </View>
              <View style={s.comboMeta}>
                <Text style={s.comboMetaItem}>📈 {combo.estimated_revenue_uplift}</Text>
                <Text style={s.comboMetaItem}>🏷 {combo.suggested_discount} off</Text>
              </View>
              <Text style={s.comboUpsell}>💡 {combo.upsell_opportunity}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.outlineVariant },
  pageTitle: { fontSize: 18, fontWeight: '900', color: C.primary },
  pageSubtitle: { fontSize: 11, color: C.secondary, marginTop: 2 },
  newBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.primary, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  newBtnText: { fontSize: 11, fontWeight: '800', color: C.onPrimary },
  tabs: { flexDirection: 'row', backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.outlineVariant },
  tab: { flex: 1, paddingVertical: 11, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: C.primary },
  tabText: { fontSize: 11, color: C.secondary, fontWeight: '600' },
  tabTextActive: { color: C.primary },
  content: { padding: 14, paddingBottom: 90 },
  sectionTitle: { fontSize: 14, fontWeight: '900', color: C.onSurface, marginBottom: 10 },
  card: { backgroundColor: C.surfaceContainerLowest, borderRadius: 14, padding: 14, marginBottom: 12, shadowColor: '#4b2c20', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: C.primary, marginBottom: 4 },
  insightTip: { borderLeftWidth: 3, backgroundColor: C.surfaceContainerLow, borderRadius: 8, padding: 10 },
  insightTipText: { fontSize: 12, color: C.primary, fontStyle: 'italic', lineHeight: 18 },
  tableHeader: { flexDirection: 'row', backgroundColor: C.surfaceContainerLow, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6, marginBottom: 4 },
  colHeader: { flex: 1, fontSize: 9, fontWeight: '800', color: C.secondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 9 },
  tableRowAlt: { backgroundColor: '#f5f5f5' },
  tableCell: { flex: 1, fontSize: 12, color: C.onSurface },
  initBox: { width: 26, height: 26, borderRadius: 6, backgroundColor: C.primaryContainer + '20', justifyContent: 'center', alignItems: 'center' },
  initText: { fontSize: 11, fontWeight: '900', color: C.primary },
  itemName: { fontSize: 11, color: C.onSurface, flex: 1 },
  statusPill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 20 },
  statusPillText: { fontSize: 9, fontWeight: '800' },
  expCard: { width: 220, backgroundColor: C.surfaceContainerLowest, borderRadius: 14, overflow: 'hidden', borderTopWidth: 4, shadowColor: '#4b2c20', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  expImg: { width: '100%', height: 120 },
  expBody: { padding: 12 },
  expTitleRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 6, marginBottom: 6 },
  expTitle: { fontSize: 13, fontWeight: '800', color: C.primary, flex: 1 },
  expBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  expBadgeText: { fontSize: 8, fontWeight: '900', textTransform: 'uppercase' },
  expDesc: { fontSize: 11, color: C.secondary, lineHeight: 16, marginBottom: 6 },
  expMetric: { fontSize: 11, fontWeight: '600', color: C.primary },
  launchBtn: { margin: 12, marginTop: 4, backgroundColor: C.primary, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  launchBtnDone: { backgroundColor: C.onTertiaryContainer },
  launchBtnText: { fontSize: 12, fontWeight: '800', color: C.onPrimary },
  activeCard: { backgroundColor: C.surfaceContainerLowest, borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: '#4b2c20', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2 },
  activeTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
  activeTitle: { fontSize: 13, fontWeight: '800', color: C.primary, flex: 1 },
  activeDesc: { fontSize: 12, color: C.secondary, lineHeight: 18, marginBottom: 10 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { fontSize: 10, color: C.secondary, fontWeight: '600' },
  progressPct: { fontSize: 10, color: C.primary, fontWeight: '800' },
  progressTrack: { height: 6, backgroundColor: C.surfaceContainerHighest, borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', borderRadius: 3 },
  roiRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  roiLabel: { fontSize: 10, color: C.secondary, fontWeight: '600' },
  roiValue: { fontSize: 15, fontWeight: '900' },
  infoBox: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', backgroundColor: C.tertiaryFixed + '30', borderRadius: 10, padding: 12, marginBottom: 12 },
  infoText: { flex: 1, fontSize: 12, color: C.primary, lineHeight: 18 },
  comboItems: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 8 },
  comboItemBadge: { backgroundColor: C.primary + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  comboItemText: { fontSize: 12, fontWeight: '600', color: C.primary },
  comboMeta: { flexDirection: 'row', gap: 14, marginBottom: 6 },
  comboMetaItem: { fontSize: 12, color: C.secondary },
  comboUpsell: { fontSize: 12, color: C.onTertiaryContainer },
});
