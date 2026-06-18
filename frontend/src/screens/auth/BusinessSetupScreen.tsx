import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { useResponsive } from '../../hooks/useResponsive';

const BUSINESS_TYPES = ['Café', 'Restaurant', 'Bakery', 'Food Truck', 'Cloud Kitchen', 'Bar'];

export default function BusinessSetupScreen() {
  const router = useRouter();
  const { setupBusiness } = useAuth();
  const { isMobile, isLargeMobile } = useResponsive();

  const [cafeName, setCafeName] = useState('');
  const [location, setLocation] = useState('');
  const [businessType, setBusinessType] = useState('Café');
  const [numEmployees, setNumEmployees] = useState('');
  const [operatingHours, setOperatingHours] = useState('8 AM - 10 PM');
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    if (!cafeName || !location || !numEmployees) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await setupBusiness({
        cafe_name: cafeName,
        location,
        business_type: businessType,
        num_employees: parseInt(numEmployees) || 1,
        operating_hours: operatingHours,
      });
      router.replace('/(tabs)/dashboard');
    } catch (e: any) {
      Alert.alert('Setup Failed', e?.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.emoji}>🏪</Text>
          <Text style={styles.title}>Set Up Your Business</Text>
          <Text style={styles.subtitle}>Tell us about your café so we can personalize insights</Text>
        </View>

        <Input
          label="Café / Restaurant Name *"
          placeholder="e.g. Ravi's Coffee House"
          value={cafeName}
          onChangeText={setCafeName}
          leftIcon="storefront-outline"
        />

        <Input
          label="Location *"
          placeholder="e.g. Hyderabad, Telangana"
          value={location}
          onChangeText={setLocation}
          leftIcon="location-outline"
        />

        <Text style={styles.sectionLabel}>Business Type</Text>
        <View style={styles.typeGrid}>
          {BUSINESS_TYPES.map((type) => (
            <Button
              key={type}
              title={type}
              onPress={() => setBusinessType(type)}
              variant={businessType === type ? 'primary' : 'outline'}
              size="sm"
              style={[styles.typeBtn, (isMobile || isLargeMobile) && { minWidth: 72 }]}
            />
          ))}
        </View>

        <Input
          label="Number of Employees *"
          placeholder="e.g. 5"
          value={numEmployees}
          onChangeText={setNumEmployees}
          keyboardType="numeric"
          leftIcon="people-outline"
        />

        <Input
          label="Operating Hours"
          placeholder="e.g. 8 AM - 10 PM"
          value={operatingHours}
          onChangeText={setOperatingHours}
          leftIcon="time-outline"
        />

        <Button
          title="Complete Setup →"
          onPress={handleSetup}
          loading={loading}
          size="lg"
          style={styles.btn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  header: { alignItems: 'center', marginBottom: SPACING.xl, paddingTop: SPACING.lg },
  emoji: { fontSize: 56 },
  title: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.text, marginTop: SPACING.sm },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  sectionLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  typeBtn: { flex: 0, minWidth: 90 },
  btn: { marginTop: SPACING.md },
});
