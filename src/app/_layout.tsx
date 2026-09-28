// src/app/_layout.tsx
// Layout raíz de Expo Router. Envuelve a TODAS las pantallas, por eso acá van:
// - ThemeProvider: comparte el tema (colores) con todos los styled components.
// - Stack: navegación tipo pila (push agrega una pantalla arriba, back la saca).
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from 'styled-components/native';

import { tema } from '../styles/theme';

export default function RootLayout() {
  return (
    <ThemeProvider theme={tema}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="crear" />
        <Stack.Screen name="rodada/[id]" />
      </Stack>
    </ThemeProvider>
  );
}
