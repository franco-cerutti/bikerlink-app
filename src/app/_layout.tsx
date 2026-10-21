// src/app/_layout.tsx
// Layout raíz de Expo Router. Envuelve a TODAS las pantallas, por eso acá van:
// - ThemeProvider: comparte el tema (colores) con todos los styled components.
// - Stack: navegación tipo pila (push agrega una pantalla arriba, back la saca).
//
// Navegación anidada: el primer elemento del Stack es el grupo "(tabs)", que tiene
// su propia barra de pestañas. "crear" y "rodada/[id]" se abren ENCIMA de las pestañas,
// por eso al entrar al detalle la barra de abajo desaparece y "atrás" vuelve a la pestaña.
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from 'styled-components/native';

import { tema } from '../styles/theme';

export default function RootLayout() {
  return (
    <ThemeProvider theme={tema}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="crear" />
        <Stack.Screen name="rodada/[id]" />
      </Stack>
    </ThemeProvider>
  );
}
