// src/app/(tabs)/_layout.tsx
// Navegación por pestañas (Tabs). Cada archivo de esta carpeta es una pestaña:
//   index.tsx        →  "Explorar"
//   mis-rodadas.tsx  →  "Mis rodadas"
// Los paréntesis en "(tabs)" crean un GRUPO: ordenan los archivos pero no aparecen
// en la URL. Por eso la pestaña Explorar sigue siendo la ruta "/".
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';
import { useTheme } from 'styled-components/native';

import { USUARIO_ACTUAL } from '../../data/usuario';
import { useRodadasStore } from '../../store/rodadasStore';
import { estaConfirmado } from '../../utils/asistencia';

export default function TabsLayout() {
  const theme = useTheme();

  // Cantidad de rodadas a las que voy, para mostrarla como "badge" en la pestaña.
  // Se recalcula sola cuando confirmo o cancelo, porque viene del store.
  const cantidadQueVoy = useRodadasStore(
    (state) => state.rodadas.filter((rodada) => estaConfirmado(rodada, USUARIO_ACTUAL.id)).length,
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // cada pantalla dibuja su propio Encabezado
        tabBarActiveTintColor: theme.colores.primario,
        tabBarInactiveTintColor: theme.colores.textoTenue,
        tabBarStyle: { backgroundColor: theme.colores.superficie },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explorar',
          // tabBarIcon recibe el color (activo o inactivo) y el tamaño que corresponde.
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'compass' : 'compass-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mis-rodadas"
        options={{
          title: 'Mis rodadas',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'bicycle' : 'bicycle-outline'} size={size} color={color} />
          ),
          // undefined = no mostrar badge
          tabBarBadge: cantidadQueVoy > 0 ? cantidadQueVoy : undefined,
          tabBarBadgeStyle: { backgroundColor: theme.colores.primario },
        }}
      />
    </Tabs>
  );
}
