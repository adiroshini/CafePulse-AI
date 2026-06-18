import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ACTIVE   = '#32170d';
const INACTIVE = '#B8A99A';
const BG       = '#f8f9ff';
const BORDER   = '#d5c3bd';

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const insets    = useSafeAreaInsets();
  const isSmall   = width < 400;

  // Dynamic values based on screen width
  const labelSize  = isSmall ? 9  : 11;
  const iconSize   = isSmall ? 20 : 22;
  const tabHeight  = 48 + insets.bottom; // touch target 48px + safe area
  const totalHeight = tabHeight + (isSmall ? 0 : 4); // clamp 48–72px range

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:   ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor:    BG,
          borderTopColor:     BORDER,
          borderTopWidth:     1,
          height:             totalHeight,
          paddingBottom:      insets.bottom > 0 ? insets.bottom : 6,
          paddingTop:         4,
          paddingHorizontal:  0,
          // Fixed at bottom, no overflow
          position:           'absolute',
          bottom:             0,
          left:               0,
          right:              0,
          // Flex layout — equal width items, no overflow
          display:            'flex',
          flexDirection:      'row',
          justifyContent:     'space-evenly',
          overflow:           'hidden',
        },
        tabBarLabelStyle: {
          fontSize:       labelSize,
          fontWeight:     '700',
          marginTop:      2,
          includeFontPadding: false,
          // Prevent text wrapping / overflow
          flexShrink:     1,
        },
        tabBarItemStyle: {
          flex:           1,
          minWidth:       0,          // allow shrinking
          alignItems:     'center',
          justifyContent: 'center',
          minHeight:      44,         // minimum touch target
          paddingHorizontal: 0,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reviews"
        options={{
          title: 'Reviews',
          tabBarIcon: ({ color }) => (
            <Ionicons name="bar-chart" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => (
            <Ionicons name="restaurant" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="whatif"
        options={{
          title: 'Simulator',
          tabBarIcon: ({ color }) => (
            <Ionicons name="trending-up" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-ellipses" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="data"
        options={{
          title: 'Data',
          tabBarIcon: ({ color }) => (
            <Ionicons name="cloud-upload" size={iconSize} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
