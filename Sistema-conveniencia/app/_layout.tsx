import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen'; // 1. Importa a Splash Screen
import 'react-native-reanimated';

import { ThemeProvider, useTheme } from './context/themeContext';
import { api } from '../services/api';

// 2. Impede que a tela de loading desapareça automaticamente
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const { theme } = useTheme();

  return (
    <NavigationThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepareApp() {
      try {
        // Inicia o banco de dados SQLite
        api.initDatabase();

        // (Opcional) Podes colocar um pequeno atraso de 1 segundo para o utilizador ver a tua logo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error("Erro ao inicializar o banco de dados:", error);
      } finally {
        // Diz que o app terminou de carregar as configurações
        setAppIsReady(true);
      }
    }

    prepareApp();
  }, []);

  // 3. Esconde a tela de loading quando tudo estiver pronto
  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Enquanto não estiver pronto, não renderiza a navegação (mantém a Splash)
  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}