import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { theme } from '../theme';

import { HomeScreen } from '../screens/HomeScreen';
import { AnalysisScreen } from '../screens/AnalysisScreen';
import { ResultScreen } from '../screens/ResultScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          title: 'Retard Level Analyzer'
        }}
      />
      <Stack.Screen 
        name="Analysis" 
        component={AnalysisScreen} 
        options={{
          title: 'Analyzing...'
        }}
      />
      <Stack.Screen 
        name="Result" 
        component={ResultScreen} 
        options={{
          title: 'Analysis Result'
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);