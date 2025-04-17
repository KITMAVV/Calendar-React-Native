import React from 'react';
import { StatusBar, View } from 'react-native';
import Calendar from './components/Calendar';

export default function App() {
  return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <Calendar />
      </View>
  );
}
