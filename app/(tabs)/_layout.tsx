import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
    initialRouteName='(index)'
      screenOptions={{
        tabBarActiveTintColor: 'rgba(97, 141, 97, 1)',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="(index)"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image
                source={
                  focused
                    ? require('@/assets/images/home-icon-focused.png') // Focused state image
                    : require('@/assets/images/home-icon.png') // Unfocused state image
                }
                style={{
                  width: 24,
                  height: 24,
                 // tintColor: color, // Optional: Apply the color dynamically
                }}
                resizeMode="contain"
              />
          ),
        }}
      />
      <Tabs.Screen
        name="(zllplants)"
        options={{
          title: 'All plants',
          
          tabBarIcon: ({ focused }) => (
            <Image
                source={
                  focused
                    ? require('@/assets/images/allplants-icon-focused.png') // Focused state image
                    : require('@/assets/images/allplants-icon.png') // Unfocused state image
                }
                style={{
                  width: 24,
                  height: 24,
                 // tintColor: color, // Optional: Apply the color dynamically
                }}
                resizeMode="contain"
              />
          ),
        }}
      />
    </Tabs>
  );
}
