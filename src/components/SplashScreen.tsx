import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { APP_CONFIG } from '../constants/app';
import { COLORS } from '../constants/colors';

export const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Image
        source={require('../../assets/loading.gif')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  image: {
    width: APP_CONFIG.LOADING_ICON_SIZE,
    height: APP_CONFIG.LOADING_ICON_SIZE,
  },
});
