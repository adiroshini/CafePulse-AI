import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DEMO_DASHBOARD, DEMO_BUSINESS } from '../mock/demoData';

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

const QUICK_CHIPS = [
  'Why are ratings dropping?',
  'How to improve revenue?',
  'Biggest problem today?',
  'Generate weekly report',
  'Espresso sales trend',
];

const LANGUAGES = ['English', 'Hindi', 'Telugu'];

type Message = { role: 'user' | 'ai'; text: string };

function getDemoAnswer(q: string): string {
  const lq = q.toLowerCase();
  if (lq.includes('rating') || lq.includes('drop') || lq.includes('why')) {
    return '📊 Ratings dropped from 4.1 → 3.4 over 30 days. Root cause: waiting time increased to 22 min avg during peak hours (12–2 PM). 60% of 1–2 star reviews mention "slow service". Recommendation: add 1 staff during lunch rush.';
  }
  if (lq.includes('revenue') || lq.includes('improve')) {
    return '💰 Revenue is down 18% (₹1,84,500 vs ₹2,25,000 target). Top 3 levers: (1) Reduce wait time → retain at-risk customers, (2) Launch weekday BOGO → boost slow days, (3) Activate Cappuccino + Brownie combo → +12% AOV.';
  }
  if (lq.includes('problem') || lq.includes('biggest')) {
    return '⚠️ Biggest problem: Waiting Time (22 min avg, target 10 min). This single issue is driving 60% of negative reviews, causing 12 customers to be at-risk, and contributing to the –18% revenue trend.';
  }
  if (lq.includes('report') || lq.includes('week')) {
    return '📋 Weekly Summary (Jun 4–10):\n• Revenue: ₹61,400 (–12% vs prev week)\n• Avg Rating: 3.4 ⭐\n• New Reviews: 10 (6 negative, 4 positive)\n• At-Risk Customers: 12\n• Top Issue: Waiting Time\n• Top Strength: Coffee Quality';
  }
  if (lq.includes('espresso') || lq.includes('sales')) {
    return '☕ Espresso Sales Trend: 110 units sold this month (₹22,000 revenue). Down 8% vs last month. Likely impacted by long wait times discouraging quick-order customers. Consider express counter during peak hours.';
  }
  return '🤖 I\'ve analyzed your café data. Ask me about ratings, revenue, problems, or get a weekly report!';
}

export default function AIAssistantScreen() {
  const [lang, setLang] = useState('English');
  const [listening, setListening] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  const waveAnims = useRef(Array.from({ length: 8 }, () => new Animated.Value(0.3))).current;
  const listenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startWave = () => {
    waveAnims.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 60),
          Animated.timing(anim, { toValue: 1, duration: 300, easing: Easing.ease, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.3, duration: 300, easing: Easing.ease, useNativeDriver: true }),
        ])
      ).start();
    });
  };

  const stopWave = () => {
    waveAnims.forEach(a => { a.stopAnimation(); a.setValue(0.3); });
  };

  const toggleListen = () => {
    if (listening) {
      setListening(false);
      stopWave();
      if (listenTimer.current) clearTimeout(listenTimer.current);
    } else {
      setListening(true);
      startWave();
      listenTimer.current = setTimeout(() => {
        setListening(false);
        stopWave();
        sendMessage('Why are my ratings dropping?');
      }, 2000);
    }
  };

  useEffect(() => {
    return () => { if (listenTimer.current) clearTimeout(listenTimer.current); };
  }, []);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', text: text.trim() };
    const aiMsg: Message = { role: 'ai', text: getDemoAnswer(text) };
    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.pageTitle}>Sarvam AI</Text>
          <Text style={s.pageSubtitle}>{DEMO_BUSINESS.cafe_name}</Text>
        </View>
        <View style={s.headerRight}>
          <Ionicons name="mic-outline" size={22} color={C.primary} />
          <TouchableOpacity style={{ marginLeft: 12 }}>
            <Ionicons name="notifications-outline" size={22} color={C.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Language Pills */}
      <View style={s.langRow}>
        {LANGUAGES.map(l => (
          <TouchableOpacity key={l} style={[s.langPill, lang === l && s.langPillActive]} onPress={() => setLang(l)}>
            <Text style={[s.langPillText, lang === l && s.langPillTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Voice Orb */}
        <View style={s.orbCard}>
          <TouchableOpacity style={[s.micOrb, listening && { backgroundColor: C.error }]} onPress={toggleListen} activeOpacity={0.85}>
            <Ionicons name={listening ? 'mic' : 'mic-outline'} size={36} color={C.onPrimary} />
          </TouchableOpacity>
          {listening && (
            <View style={s.waveRow}>
              {waveAnims.map((anim, i) => (
                <Animated.View key={i} style={[s.wavBar, { transform: [{ scaleY: anim }] }]} />
              ))}
            </View>
          )}
          <Text style={s.orbLabel}>{listening ? 'Listening...' : 'Tap to ask'}</Text>
        </View>

        {/* Bento Grid */}
        <View style={s.bentoRow}>
          {/* Recent Queries */}
          <View style={[s.bentoHalf]}>
            <Text style={s.bentoSectionTitle}>Recent Queries</Text>
            <View style={[s.queryCard, { borderLeftColor: C.error }]}>
              <Text style={s.queryText}>Why are ratings dropping?</Text>
              <Text style={s.queryMeta}>2 min ago</Text>
            </View>
            <View style={[s.queryCard, { borderLeftColor: C.onTertiaryContainer, marginTop: 8 }]}>
              <Text style={s.queryText}>Best performing item this week?</Text>
              <Text style={s.queryMeta}>1 hr ago</Text>
            </View>
          </View>

          {/* Sarvam Intelligence */}
          <View style={[s.bentoHalf, { backgroundColor: C.primaryContainer }]}>
            <View style={s.intelHeader}>
              <Ionicons name="sparkles" size={13} color={C.onPrimaryContainer} />
              <Text style={[s.bentoSectionTitle, { color: C.onPrimaryContainer, fontSize: 10 }]}>SARVAM INTEL</Text>
            </View>
            <Text style={[s.intelTitle, { color: C.onPrimary }]}>Peak Hour Efficiency Drop</Text>
            <Text style={[s.intelBody, { color: C.onPrimaryContainer }]}>Wait time up 14% between 12–2 PM this week.</Text>
            <View style={s.confRow}>
              <Text style={[s.confLabel, { color: C.onPrimaryContainer }]}>Confidence</Text>
              <Text style={[s.confValue, { color: C.onPrimary }]}>86%</Text>
            </View>
            <View style={[s.barBg, { marginTop: 4 }]}>
              <View style={[s.barFill, { width: '86%' }]} />
            </View>
          </View>
        </View>

        {/* 3 Metric Cards */}
        <View style={s.metricRow}>
          <View style={[s.metricCard, { borderTopColor: C.onTertiaryContainer }]}>
            <Text style={s.metricLabel}>Daily Revenue</Text>
            <Text style={[s.metricValue, { color: C.primary }]}>₹42,500</Text>
            <Text style={[s.metricDelta, { color: C.onTertiaryFixedVariant }]}>+12%</Text>
          </View>
          <View style={[s.metricCard, { borderTopColor: C.onTertiaryContainer }]}>
            <Text style={s.metricLabel}>Bean Stock</Text>
            <Text style={[s.metricValue, { color: C.primary }]}>124 kg</Text>
            <Text style={[s.metricDelta, { color: C.onTertiaryContainer }]}>OK</Text>
          </View>
          <View style={[s.metricCard, { borderTopColor: C.error }]}>
            <Text style={s.metricLabel}>Avg Service</Text>
            <Text style={[s.metricValue, { color: C.error }]}>5.2 min</Text>
            <Text style={[s.metricDelta, { color: C.error }]}>Alert</Text>
          </View>
        </View>

        {/* Conversation */}
        {messages.length > 0 && (
          <View style={s.convSection}>
            <Text style={s.sectionTitle}>Conversation</Text>
            {messages.map((msg, i) => (
              <View key={i} style={[s.msgRow, msg.role === 'user' ? s.msgRowUser : s.msgRowAi]}>
                {msg.role === 'ai' && (
                  <View style={s.aiAvatar}>
                    <Text style={s.aiAvatarText}>☕</Text>
                  </View>
                )}
                <View style={[s.msgBubble, msg.role === 'user' ? s.msgBubbleUser : s.msgBubbleAi]}>
                  <Text style={[s.msgText, msg.role === 'user' ? s.msgTextUser : s.msgTextAi]}>{msg.text}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Quick Chips */}
        <Text style={s.sectionTitle}>Quick Ask</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipsRow}>
          {QUICK_CHIPS.map((chip, i) => (
            <TouchableOpacity key={i} style={s.chip} onPress={() => sendMessage(chip)}>
              <Text style={s.chipText}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Input Bar */}
      <View style={s.inputBar}>
        <TouchableOpacity style={s.attachBtn}>
          <Ionicons name="attach-outline" size={20} color={C.secondary} />
        </TouchableOpacity>
        <TextInput
          style={s.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="Ask Sarvam AI anything..."
          placeholderTextColor={C.secondary}
          onSubmitEditing={() => sendMessage(input)}
          returnKeyType="send"
        />
        <TouchableOpacity style={s.micRound} onPress={toggleListen}>
          <Ionicons name="mic-outline" size={18} color={C.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={s.sendBtn} onPress={() => sendMessage(input)}>
          <Ionicons name="send" size={16} color={C.onPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.outlineVariant },
  pageTitle: { fontSize: 22, fontWeight: '900', color: C.primary },
  pageSubtitle: { fontSize: 11, color: C.secondary, marginTop: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  langRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.outlineVariant },
  langPill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, backgroundColor: C.surfaceContainerHighest },
  langPillActive: { backgroundColor: C.primary },
  langPillText: { fontSize: 11, fontWeight: '700', color: C.secondary },
  langPillTextActive: { color: C.onPrimary },
  content: { padding: 14 },
  orbCard: { backgroundColor: C.surfaceContainerLowest, borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  micOrb: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center', shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 8 },
  waveRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 14 },
  wavBar: { width: 4, height: 28, backgroundColor: C.primary, borderRadius: 2 },
  orbLabel: { fontSize: 13, color: C.secondary, fontWeight: '600', marginTop: 10 },
  bentoRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  bentoHalf: { flex: 1, backgroundColor: C.surfaceContainerLowest, borderRadius: 14, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  bentoSectionTitle: { fontSize: 11, fontWeight: '800', color: C.primary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  queryCard: { borderLeftWidth: 3, backgroundColor: C.surfaceContainerLow, borderRadius: 8, padding: 8 },
  queryText: { fontSize: 11, color: C.onSurface, fontWeight: '500', lineHeight: 15 },
  queryMeta: { fontSize: 9, color: C.secondary, marginTop: 3 },
  intelHeader: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
  intelTitle: { fontSize: 12, fontWeight: '800', lineHeight: 17, marginBottom: 4 },
  intelBody: { fontSize: 10, lineHeight: 15, marginBottom: 8 },
  confRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  confLabel: { fontSize: 9, fontWeight: '600' },
  confValue: { fontSize: 9, fontWeight: '900' },
  barBg: { height: 5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: C.onPrimaryContainer, borderRadius: 3 },
  metricRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  metricCard: { flex: 1, backgroundColor: C.surfaceContainerLowest, borderRadius: 12, padding: 10, alignItems: 'center', borderTopWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  metricLabel: { fontSize: 9, color: C.secondary, fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' },
  metricValue: { fontSize: 15, fontWeight: '900', marginVertical: 3 },
  metricDelta: { fontSize: 9, fontWeight: '700' },
  convSection: { marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: C.onSurface, marginBottom: 10 },
  msgRow: { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-end' },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowAi: { justifyContent: 'flex-start' },
  aiAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.primaryContainer + '40', justifyContent: 'center', alignItems: 'center', marginRight: 6 },
  aiAvatarText: { fontSize: 14 },
  msgBubble: { maxWidth: '80%', borderRadius: 14, padding: 10 },
  msgBubbleUser: { backgroundColor: C.primary, borderBottomRightRadius: 4 },
  msgBubbleAi: { backgroundColor: C.surfaceContainerLowest, borderBottomLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  msgText: { fontSize: 12, lineHeight: 18 },
  msgTextUser: { color: C.onPrimary },
  msgTextAi: { color: C.onSurface },
  chipsRow: { gap: 8, paddingBottom: 6 },
  chip: { backgroundColor: C.surfaceContainerLowest, borderRadius: 20, paddingHorizontal: 13, paddingVertical: 7, borderWidth: 1, borderColor: C.outlineVariant },
  chipText: { fontSize: 12, color: C.primary, fontWeight: '600' },
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.outlineVariant },
  attachBtn: { padding: 4 },
  textInput: { flex: 1, backgroundColor: C.surfaceContainerLow, borderRadius: 22, paddingHorizontal: 14, paddingVertical: 9, fontSize: 13, color: C.onSurface },
  micRound: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.surfaceContainerHighest, justifyContent: 'center', alignItems: 'center' },
  sendBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center' },
});
