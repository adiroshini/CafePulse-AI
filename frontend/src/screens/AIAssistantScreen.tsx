import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Animated, Easing, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DEMO_DASHBOARD, DEMO_BUSINESS } from '../mock/demoData';

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
  primaryFixed: '#ffdbce', primaryFixedDim: '#ecbcaa',
  background: '#F5F1ED',
};

const LANGUAGES = ['English', 'Hindi', 'Telugu'];

const QUICK_QUESTIONS = [
  { text: 'Why are my ratings dropping?', color: C.error },
  { text: 'Show me espresso sales trend.', color: C.onTertiaryContainer },
  { text: 'What is my biggest problem?', color: C.error },
  { text: 'How can I improve revenue?', color: C.onTertiaryContainer },
  { text: 'Give me this week\'s report.', color: C.onTertiaryContainer },
];

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

function getDemoAnswer(question: string): string {
  const q = question.toLowerCase();
  const d = DEMO_DASHBOARD;
  if (q.includes('rating') || q.includes('drop') || q.includes('why')) {
    return `Your average rating is ${d.avg_rating} stars. The primary cause is "${d.top_complaint.replace(/_/g, ' ')}". Customers mention this in 5 of your last 10 reviews. Adding one lunch-hour staff member could improve ratings by +0.4 stars within 2 weeks.`;
  }
  if (q.includes('espresso') || q.includes('sales') || q.includes('trend')) {
    return `Espresso sales are trending up by 12% week-over-week. It is currently your 4th best-selling item with 110 units/month. Consider a "Happy Hour" Espresso discount between 2–4 PM to capture +15% more volume.`;
  }
  if (q.includes('problem') || q.includes('biggest') || q.includes('issue')) {
    return `Your biggest problem is "${d.top_complaint.replace(/_/g, ' ')}". It appears in 5/10 recent reviews and is directly causing your rating to drop from 4.2 to ${d.avg_rating}. This is your #1 priority this week.`;
  }
  if (q.includes('revenue') || q.includes('improve') || q.includes('money')) {
    return `Revenue is ${d.revenue_trend_pct}% vs last period. Top 3 actions to improve: (1) BOGO promotion on slow weekdays +15%, (2) Cappuccino + Brownie combo +10% avg order, (3) Fix waiting time to retain at-risk customers +5%. Combined expected impact: +20-30%.`;
  }
  if (q.includes('report') || q.includes('week') || q.includes('summary')) {
    return `Weekly Report for ${DEMO_BUSINESS.cafe_name}:\n\n• Health Score: ${d.health_score}/100 (${d.risk_level} Risk)\n• Revenue: ${d.revenue_trend_pct}% vs last week\n• Avg Rating: ${d.avg_rating} ⭐\n• Top Strength: ${d.top_strength.replace(/_/g, ' ')}\n• Top Complaint: ${d.top_complaint.replace(/_/g, ' ')}\n• At-Risk Customers: ${d.at_risk_customer_count}\n\nMost urgent: Add lunch-hour staff immediately.`;
  }
  return `I can help you with ratings, revenue, weekly reports, inventory, or menu performance. Your current health score is ${d.health_score}/100. What would you like to know?`;
}

// ── Animated Waveform ─────────────────────────────────────────────────────────
function Waveform({ active }: { active: boolean }) {
  const bars = [0.6, 1.0, 0.7, 0.4, 0.9, 1.0, 0.75, 0.5];
  const anims = bars.map(() => useRef(new Animated.Value(0.3)).current);

  useEffect(() => {
    if (!active) return;
    const loops = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: bars[i], duration: 300 + i * 80, useNativeDriver: false, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(anim, { toValue: 0.2, duration: 300 + i * 80, useNativeDriver: false, easing: Easing.inOut(Easing.ease) }),
        ])
      )
    );
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, [active]);

  return (
    <View style={wf.row}>
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          style={[wf.bar, { height: anim.interpolate({ inputRange: [0, 1], outputRange: [4, 40] }) }]}
        />
      ))}
    </View>
  );
}
const wf = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 3, height: 44, marginBottom: 8 },
  bar: { width: 5, backgroundColor: C.primary, borderRadius: 3 },
});

// ── Mini bar chart ────────────────────────────────────────────────────────────
function MiniBarChart({ heights }: { heights: number[] }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 40, gap: 3, marginTop: 8 }}>
      {heights.map((h, i) => (
        <View key={i} style={{ flex: 1, height: h * 40, backgroundColor: C.onTertiaryContainer, borderTopLeftRadius: 3, borderTopRightRadius: 3 }} />
      ))}
    </View>
  );
}

export default function AIAssistantScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('English');
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for mic button
  useEffect(() => {
    if (!listening) { pulseAnim.setValue(1); return; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.4, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [listening]);

  const sendMessage = (question: string = input) => {
    if (!question.trim()) return;
    const userMsg: Message = { role: 'user', text: question };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setListening(false);
    setTimeout(() => {
      const answer = getDemoAnswer(question);
      setMessages(prev => [...prev, { role: 'assistant', text: answer }]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 700);
  };

  const toggleListen = () => {
    setListening(prev => {
      if (!prev) {
        // Simulate voice input after 2 seconds
        setTimeout(() => {
          sendMessage('Why are my ratings dropping?');
        }, 2000);
      }
      return !prev;
    });
  };

  return (
    <View style={s.root}>
      {/* Top Nav */}
      <View style={s.topNav}>
        <View style={s.topLeft}>
          <Text style={s.brandName}>Sarvam AI</Text>
          <View style={s.langRow}>
            {LANGUAGES.map(lang => (
              <TouchableOpacity
                key={lang}
                onPress={() => setLanguage(lang)}
                style={[s.langChip, language === lang && s.langChipActive]}
              >
                <Text style={[s.langChipText, language === lang && s.langChipTextActive]}>{lang}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={s.topRight}>
          <Ionicons name="mic-outline" size={20} color={C.primary} />
          <Ionicons name="notifications-outline" size={20} color={C.primary} />
          <View style={s.divider} />
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfEMJbY9DPk2q1dKOOMvJjKxLNaGxoMsplqLIwQtg2fnRlcyJjYKjlC3HWEpdV9jRS8xFm76i9s3jjlSQ-oqmSndKDEIkPooeyzzT00c4eQ6QhnoOqbt34FZbIHP6AW7GJgGCRINF3qVv4nvs-eSNM6rhBY0W8XxPK4amDAZozhXSpABuQBoZSr7grMiXrdRq35SQUKJ_p8enPAZOSbwEblD3VwaR2ClXWgqKE9ODaRWgW3dwGB_xrSAUrxNYT4TObcPK3apruZ0y-' }}
            style={s.avatar}
          />
          <Text style={s.managerName}>Manager</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={s.canvas}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >

        {/* ── Voice Orb ── */}
        <View style={s.voiceOrb}>
          <View style={s.micWrapper}>
            <Animated.View style={[s.ripple1, { transform: [{ scale: pulseAnim }] }]} />
            <Animated.View style={[s.ripple2, {
              transform: [{ scale: pulseAnim.interpolate({ inputRange: [1, 1.4], outputRange: [1.2, 1.8] }) }],
            }]} />
            <TouchableOpacity style={s.micBtn} onPress={toggleListen} activeOpacity={0.85}>
              <Ionicons name={listening ? 'mic' : 'mic-outline'} size={36} color={C.onPrimary} />
            </TouchableOpacity>
          </View>
          <Waveform active={listening} />
          <Text style={[s.listeningText, { opacity: listening ? 1 : 0.5 }]}>
            {listening ? 'Listening for your pulse...' : 'Tap mic to speak'}
          </Text>
        </View>

        {/* ── Bento Grid ── */}
        <View style={s.bento}>

          {/* Recent Queries + Intelligence side by side */}
          <View style={s.bentoRow}>

            {/* Recent Queries */}
            <View style={{ flex: 1 }}>
              <View style={s.bentoPanelHeader}>
                <Ionicons name="time-outline" size={16} color={C.outline} />
                <Text style={s.bentoPanelTitle}>Recent Queries</Text>
              </View>
              {QUICK_QUESTIONS.slice(0, 2).map((q, i) => (
                <TouchableOpacity
                  key={i}
                  style={[s.queryCard, { borderLeftColor: q.color }]}
                  onPress={() => sendMessage(q.text)}
                >
                  <Text style={s.queryText}>{q.text}</Text>
                  <Text style={s.queryMeta}>
                    {i === 0 ? 'Asked 12 mins ago • Downtown Branch' : 'Asked 2 hours ago • Weekly Comparison'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Sarvam Intelligence Card */}
            <View style={s.intelligenceCard}>
              <View style={s.intelligenceHeader}>
                <Ionicons name="sparkles" size={16} color={C.tertiaryFixed} />
                <Text style={s.intelligenceLabel}>SARVAM INTELLIGENCE</Text>
              </View>
              <Text style={s.intelligenceTitle}>Peak Hour Efficiency Drop</Text>
              <Text style={s.intelligenceBody}>
                I noticed a 14% increase in wait times between 8:30–9:15 AM. Root cause: milk replenishment delays.
              </Text>
              {/* Confidence bar */}
              <View style={s.confRow}>
                <View style={s.confTrack}>
                  <View style={s.confFill} />
                </View>
                <Text style={s.confScore}>86%</Text>
              </View>
              <Text style={s.confLabel}>Confidence Score</Text>
            </View>
          </View>

          {/* Metric Cards row */}
          <View style={s.metricsRow}>
            {/* Revenue */}
            <View style={s.metricCard}>
              <View style={s.metricTop}>
                <View style={[s.metricIcon, { backgroundColor: C.secondaryContainer }]}>
                  <Ionicons name="cash-outline" size={16} color={C.primary} />
                </View>
                <Text style={s.metricDelta}>+12%</Text>
              </View>
              <Text style={s.metricLabel}>Daily Revenue</Text>
              <Text style={s.metricValue}>₹42,500</Text>
              <MiniBarChart heights={[0.4, 0.6, 0.55, 0.8, 0.75, 0.95]} />
            </View>

            {/* Bean Stock */}
            <View style={[s.metricCard, s.metricCardGreen]}>
              <View style={s.metricTop}>
                <View style={[s.metricIcon, { backgroundColor: C.tertiaryFixed }]}>
                  <Ionicons name="leaf-outline" size={16} color={C.onTertiaryFixed} />
                </View>
                <View style={s.optimalBadge}>
                  <Text style={s.optimalBadgeText}>Optimal</Text>
                </View>
              </View>
              <Text style={s.metricLabel}>Bean Stock</Text>
              <Text style={s.metricValue}>124 kg</Text>
              <Text style={s.metricSub}>Good for 8 more days</Text>
            </View>

            {/* Service Time */}
            <View style={[s.metricCard, s.metricCardRed]}>
              <View style={s.metricTop}>
                <View style={[s.metricIcon, { backgroundColor: C.errorContainer }]}>
                  <Ionicons name="warning-outline" size={16} color={C.error} />
                </View>
                <Text style={s.alertText}>Alert</Text>
              </View>
              <Text style={s.metricLabel}>Avg Service Time</Text>
              <Text style={s.metricValue}>5.2 min</Text>
              <Text style={[s.metricSub, { color: C.error }]}>Critical Threshold: 4.0 min</Text>
            </View>
          </View>

          {/* Conversation thread */}
          {messages.length > 0 && (
            <View style={s.chatSection}>
              <View style={s.bentoPanelHeader}>
                <Ionicons name="chatbubbles-outline" size={16} color={C.outline} />
                <Text style={s.bentoPanelTitle}>Conversation</Text>
              </View>
              {messages.map((msg, i) => (
                <View key={i} style={[s.bubble, msg.role === 'user' ? s.userBubble : s.aiBubble]}>
                  {msg.role === 'assistant' && <Text style={s.aiAvatar}>☕</Text>}
                  <View style={[s.bubbleContent, msg.role === 'user' ? s.userContent : s.aiContent]}>
                    <Text style={[s.bubbleText, msg.role === 'user' && s.userText]}>{msg.text}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Quick Ask chips */}
          <View style={s.chipsSection}>
            <Text style={s.chipsLabel}>Quick Ask:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {QUICK_QUESTIONS.map((q, i) => (
                <TouchableOpacity key={i} style={s.chip} onPress={() => sendMessage(q.text)}>
                  <Text style={s.chipText}>{q.text}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

        </View>
      </ScrollView>

      {/* ── Input Bar ── */}
      <View style={s.inputBar}>
        <View style={s.inputWrapper}>
          <TextInput
            style={s.textInput}
            placeholder="Ask Sarvam anything about your cafe..."
            placeholderTextColor={C.onSurfaceVariant}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={() => sendMessage()} disabled={!input.trim()} style={[s.sendBtn, !input.trim() && { opacity: 0.4 }]}>
            <Ionicons name="send" size={18} color={C.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={s.attachBtn}>
          <Ionicons name="attach" size={20} color={C.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={s.micRoundBtn} onPress={toggleListen}>
          <Ionicons name="mic-outline" size={20} color={C.onPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background, flexDirection: 'column' },

  // Top nav
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.outlineVariant, shadowColor: '#4b2c20', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  brandName: { fontSize: 22, fontWeight: '900', color: C.primary },
  langRow: { flexDirection: 'row', gap: 6 },
  langChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: C.outlineVariant, backgroundColor: C.surfaceContainerLowest },
  langChipActive: { backgroundColor: C.secondaryContainer },
  langChipText: { fontSize: 10, color: C.onSurfaceVariant, fontWeight: '600' },
  langChipTextActive: { color: C.onSurface },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { width: 1, height: 24, backgroundColor: C.outlineVariant },
  avatar: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: C.primary },
  managerName: { fontSize: 13, fontWeight: '700', color: C.primary },

  // Canvas
  canvas: { padding: 16, paddingBottom: 20 },

  // Voice orb
  voiceOrb: {
    alignItems: 'center', paddingVertical: 24,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)',
    marginBottom: 16,
    shadowColor: '#4b2c20', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 3,
  },
  micWrapper: { width: 96, height: 96, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  ripple1: { position: 'absolute', width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(50,23,13,0.15)' },
  ripple2: { position: 'absolute', width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(50,23,13,0.08)' },
  micBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8 },
  listeningText: { fontSize: 14, fontWeight: '700', color: C.primary },

  // Bento
  bento: { gap: 12 },
  bentoRow: { flexDirection: 'row', gap: 12 },
  bentoPanelHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  bentoPanelTitle: { fontSize: 14, fontWeight: '700', color: C.primary },

  // Recent queries
  queryCard: {
    backgroundColor: C.surfaceContainerLowest, borderRadius: 10, padding: 12,
    borderLeftWidth: 4, marginBottom: 8,
    shadowColor: '#4b2c20', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  queryText: { fontSize: 13, fontWeight: '700', color: C.primary, marginBottom: 4 },
  queryMeta: { fontSize: 11, color: C.onSurfaceVariant, fontStyle: 'italic' },

  // Intelligence card
  intelligenceCard: {
    flex: 1, backgroundColor: C.primaryContainer, borderRadius: 16, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 6, overflow: 'hidden',
  },
  intelligenceHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  intelligenceLabel: { fontSize: 8, fontWeight: '900', color: C.tertiaryFixed, letterSpacing: 1.5 },
  intelligenceTitle: { fontSize: 14, fontWeight: '900', color: C.onPrimary, marginBottom: 6 },
  intelligenceBody: { fontSize: 12, color: C.onPrimaryContainer, lineHeight: 18, marginBottom: 12 },
  confRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  confTrack: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  confFill: { height: '100%', width: '86%', backgroundColor: C.tertiaryFixed, borderRadius: 3 },
  confScore: { fontSize: 18, fontWeight: '900', color: C.tertiaryFixed },
  confLabel: { fontSize: 10, color: C.onPrimaryContainer, marginTop: 3 },

  // Metric cards
  metricsRow: { flexDirection: 'row', gap: 8 },
  metricCard: {
    flex: 1, backgroundColor: C.surfaceContainerLowest, borderRadius: 12, padding: 12,
    shadowColor: '#4b2c20', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  metricCardGreen: { borderTopWidth: 3, borderTopColor: C.onTertiaryContainer },
  metricCardRed: { borderTopWidth: 3, borderTopColor: C.error },
  metricTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  metricIcon: { width: 30, height: 30, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  metricDelta: { fontSize: 12, fontWeight: '900', color: C.onTertiaryContainer },
  metricLabel: { fontSize: 9, color: C.onSurfaceVariant, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  metricValue: { fontSize: 18, fontWeight: '900', color: C.primary, marginTop: 2 },
  metricSub: { fontSize: 10, color: C.onTertiaryFixedVariant, marginTop: 4 },
  optimalBadge: { backgroundColor: C.tertiaryFixed, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999 },
  optimalBadgeText: { fontSize: 9, fontWeight: '800', color: C.onTertiaryFixed },
  alertText: { fontSize: 12, fontWeight: '900', color: C.error },

  // Chat
  chatSection: { backgroundColor: C.surfaceContainerLowest, borderRadius: 12, padding: 12 },
  bubble: { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-end' },
  userBubble: { justifyContent: 'flex-end' },
  aiBubble: { justifyContent: 'flex-start' },
  aiAvatar: { fontSize: 20, marginRight: 8, marginBottom: 2 },
  bubbleContent: { maxWidth: '78%', borderRadius: 14, padding: 10 },
  userContent: { backgroundColor: C.primary, borderBottomRightRadius: 3 },
  aiContent: { backgroundColor: C.surfaceContainerLow, borderBottomLeftRadius: 3, borderWidth: 1, borderColor: C.outlineVariant },
  bubbleText: { fontSize: 13, color: C.onSurface, lineHeight: 20 },
  userText: { color: C.onPrimary },

  // Quick chips
  chipsSection: { gap: 8 },
  chipsLabel: { fontSize: 11, fontWeight: '700', color: C.secondary },
  chip: { backgroundColor: C.surfaceContainerLowest, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: C.outlineVariant },
  chipText: { fontSize: 11, color: C.primary, fontWeight: '600' },

  // Input bar
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, paddingBottom: 16, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.outlineVariant },
  inputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F7F5', borderWidth: 1, borderColor: C.outlineVariant, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 },
  textInput: { flex: 1, fontSize: 14, color: C.onSurface },
  sendBtn: { padding: 4 },
  attachBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.secondaryContainer, justifyContent: 'center', alignItems: 'center' },
  micRoundBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 },
});
