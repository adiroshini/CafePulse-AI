import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, Alert, TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

export default function OTPScreen() {
  const router = useRouter();
  const { email, dev_otp } = useLocalSearchParams<{ email: string; dev_otp: string }>();
  const { verifyOTP } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1);
    setOtp(newOtp);
    if (text && index < 5) inputs.current[index + 1]?.focus();
    if (!text && index > 0) inputs.current[index - 1]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      await verifyOTP(email, otpString);
      Alert.alert('Verified!', 'Your account is verified. Please log in.', [
        { text: 'OK', onPress: () => router.push('/auth/login') },
      ]);
    } catch (e: any) {
      Alert.alert('Invalid OTP', e?.response?.data?.detail || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📱</Text>
      <Text style={styles.title}>Verify Your Number</Text>
      <Text style={styles.subtitle}>Enter the 6-digit OTP sent to {email}</Text>
      {dev_otp && (
        <Text style={styles.devNote}>Dev OTP: {dev_otp}</Text>
      )}

      <View style={styles.otpRow}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={(el) => { if (el) inputs.current[i] = el; }}
            style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
            value={digit}
            onChangeText={(t) => handleChange(t, i)}
            keyboardType="numeric"
            maxLength={1}
            textAlign="center"
            autoFocus={i === 0}
          />
        ))}
      </View>

      <Button
        title="Verify OTP"
        onPress={handleVerify}
        loading={loading}
        size="lg"
        style={styles.btn}
      />

      <TouchableOpacity style={styles.resend}>
        <Text style={styles.resendText}>Didn't receive? </Text>
        <Text style={styles.resendLink}>Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 64, marginBottom: SPACING.md },
  title: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.text },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  devNote: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.accent,
    backgroundColor: COLORS.surfaceAlt,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.lg,
    fontWeight: '600',
  },
  otpRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  otpBox: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  otpBoxFilled: { borderColor: COLORS.primary },
  btn: { width: '100%' },
  resend: { flexDirection: 'row', marginTop: SPACING.lg },
  resendText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md },
  resendLink: { color: COLORS.primary, fontSize: FONTS.sizes.md, fontWeight: '700' },
});
