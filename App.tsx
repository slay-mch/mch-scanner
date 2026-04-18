import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScanScreen from './src/screens/ScanScreen';
import ResultsScreen from './src/screens/ResultsScreen';

const Stack = createNativeStackNavigator();

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>🚨 Startup Error</Text>
          <ScrollView style={styles.errorScroll}>
            <Text style={styles.errorMessage}>{this.state.error?.message}</Text>
            <Text style={styles.errorStack}>{this.state.error?.stack}</Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Scan"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Scan" component={ScanScreen} />
          <Stack.Screen name="Results" component={ResultsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: { flex: 1, backgroundColor: '#1a0000', padding: 24, paddingTop: 60 },
  errorTitle: { fontSize: 22, fontWeight: '800', color: '#ff4444', marginBottom: 16 },
  errorScroll: { flex: 1 },
  errorMessage: { fontSize: 15, color: '#ffaaaa', marginBottom: 12, fontWeight: '600' },
  errorStack: { fontSize: 11, color: '#cc7777', fontFamily: 'Courier' },
});
