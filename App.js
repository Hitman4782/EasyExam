import React from 'react';
import { StatusBar } from 'expo-status-bar';
import MainNavigator from './navigator';

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <MainNavigator />
    </>
  );
}
