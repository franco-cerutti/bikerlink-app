// src/app/(tabs)/mis-rodadas.tsx  →  ruta "/mis-rodadas" (pestaña Mis rodadas)
// Consultar mis rodadas: las salidas a las que voy y las que organizo.
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';

import Boton from '../../components/Boton';
import Chip from '../../components/Chip';
import Encabezado from '../../components/Encabezado';
import RodadaCard from '../../components/RodadaCard';
import { USUARIO_ACTUAL } from '../../data/usuario';
import { useChecklistStore } from '../../store/checklistStore';
import { useRodadasStore } from '../../store/rodadasStore';
import { filtrarMisRodadas, VistaMisRodadas } from '../../utils/asistencia';
import { ordenarPorFecha } from '../../utils/filtros';

const VISTAS: { id: VistaMisRodadas; etiqueta: string; vacio: string }[] = [
  { id: 'voy', etiqueta: 'Voy', vacio: 'Todavía no confirmaste ninguna rodada.' },
  { id: 'organizo', etiqueta: 'Organizo', vacio: 'Todavía no organizaste ninguna rodada.' },
];

export default function MisRodadas() {
  const router = useRouter();
  const theme = useTheme();

  // Mismo store que la pestaña Explorar: si confirmo allá, aparece acá sin hacer nada más.
  const rodadas = useRodadasStore((state) => state.rodadas);
  const restablecerDatos = useRodadasStore((state) => state.restablecerDatos);
  const borrarChecklists = useChecklistStore((state) => state.borrarTodo);
  const [vista, setVista] = useState<VistaMisRodadas>('voy');

  // Los datos quedan guardados en el celular. Esto los vuelve al estado inicial
  // (sirve para mostrar la app desde cero en una presentación).
  const handleRestablecer = () => {
    Alert.alert(
      'Restablecer datos',
      'Se borran las rodadas que creaste, tus asistencias y tus check-lists, y vuelven los datos de ejemplo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restablecer',
          style: 'destructive',
          onPress: () => {
            restablecerDatos();
            borrarChecklists();
          },
        },
      ],
    );
  };

  const misRodadas = ordenarPorFecha(filtrarMisRodadas(rodadas, USUARIO_ACTUAL.id, vista));
  const vistaActual = VISTAS.find((v) => v.id === vista)!;

  return (
    <Pantalla edges={['top']}>
      <Encabezado titulo="Mis rodadas" subtitulo="Tus próximas salidas en un solo lugar" />

      <BarraVistas>
        {VISTAS.map((v) => (
          <Chip
            key={v.id}
            texto={v.etiqueta}
            seleccionado={v.id === vista}
            onPress={() => setVista(v.id)}
          />
        ))}
      </BarraVistas>

      <FlatList
        data={misRodadas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <RodadaCard
            rodada={item}
            onPress={() => router.push({ pathname: '/rodada/[id]', params: { id: item.id } })}
          />
        )}
        ListFooterComponent={
          <BotonRestablecer onPress={handleRestablecer}>
            <TextoRestablecer>Restablecer datos de ejemplo</TextoRestablecer>
          </BotonRestablecer>
        }
        ListEmptyComponent={
          <Vacio>
            <Ionicons name="bicycle-outline" size={48} color={theme.colores.textoTenue} />
            <TextoVacio>{vistaActual.vacio}</TextoVacio>
            <ContenedorBoton>
              {vista === 'voy' ? (
                // navigate cambia a la pestaña Explorar (no apila una pantalla nueva).
                <Boton texto="Explorar rodadas" icono="compass-outline" onPress={() => router.navigate('/')} />
              ) : (
                <Boton texto="Crear una rodada" icono="add" onPress={() => router.push('/crear')} />
              )}
            </ContenedorBoton>
          </Vacio>
        }
      />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  lista: { padding: 16, flexGrow: 1 },
});

const Pantalla = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colores.fondo};
`;

const BarraVistas = styled.View`
  flex-direction: row;
  gap: 10px;
  padding: 4px 16px 12px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colores.borde};
  background-color: ${({ theme }) => theme.colores.superficie};
`;

const Vacio = styled.View`
  align-items: center;
  margin-top: 60px;
  gap: 12px;
`;

const TextoVacio = styled.Text`
  text-align: center;
  font-size: 15px;
  color: ${({ theme }) => theme.colores.textoTenue};
`;

const ContenedorBoton = styled.View`
  align-self: stretch;
  margin: 8px 24px 0 24px;
`;

const BotonRestablecer = styled.TouchableOpacity`
  align-self: center;
  margin-top: 24px;
  padding: 8px;
`;

const TextoRestablecer = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colores.textoTenue};
  text-decoration-line: underline;
`;
