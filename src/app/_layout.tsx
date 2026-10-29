// src/app/_layout.tsx
// Layout raíz de Expo Router. Envuelve a TODAS las pantallas, por eso acá van:
// - ThemeProvider: comparte el tema (colores) con todos los styled components.
// - QueryClientProvider: habilita TanStack Query (useQuery / useInfiniteQuery) en toda la app.
// - Stack: navegación tipo pila (push agrega una pantalla arriba, back la saca).
//
// Navegación anidada: el primer elemento del Stack es el grupo "(tabs)", que tiene
// su propia barra de pestañas. "crear" y "rodada/[id]" se abren ENCIMA de las pestañas,
// por eso al entrar al detalle la barra de abajo desaparece y "atrás" vuelve a la pestaña.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from 'styled-components/native';

import { tema } from '../styles/theme';

// El QueryClient guarda la caché de todas las consultas. Se crea UNA sola vez,
// fuera del componente, para que no se reinicie en cada render.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // si una petición falla, reintenta 1 vez antes de mostrar el error
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={tema}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="crear" />
          <Stack.Screen name="rodada/[id]/index" />
          <Stack.Screen name="rodada/[id]/fotos" />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
