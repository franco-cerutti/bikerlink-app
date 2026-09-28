// src/app/index.tsx  →  ruta "/"
// Pantalla principal: listado de rodadas con filtro por tipo.
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import Chip from '../components/Chip';
import Encabezado from '../components/Encabezado';
import RodadaCard from '../components/RodadaCard';
import { useRodadasStore } from '../store/rodadasStore';
import { TIPOS_SALIDA } from '../types/rodada';

const FILTROS = ['Todas', ...TIPOS_SALIDA];

export default function ListadoRodadas() {
  const router = useRouter();

  // Suscripción selectiva: la pantalla se vuelve a dibujar solo si cambia "rodadas".
  const rodadas = useRodadasStore((state) => state.rodadas);

  // El filtro elegido es estado de ESTA pantalla, no hace falta que sea global.
  const [filtro, setFiltro] = useState<string>('Todas');

  // Valor derivado: filtrar y ordenar por fecha (la más próxima primero).
  // Usamos [...] para ordenar una COPIA: sort() modifica el array sobre el que se llama.
  const rodadasVisibles = [...rodadas]
    .filter((rodada) => filtro === 'Todas' || rodada.tipo === filtro)
    .sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`));

  return (
    <Pantalla edges={['top']}>
      <Encabezado titulo="BikerLink" subtitulo="Explorá tu próxima rodada en grupo" />

      <BarraFiltros>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTROS}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filtros}
          renderItem={({ item }) => (
            <Chip texto={item} seleccionado={item === filtro} onPress={() => setFiltro(item)} />
          )}
        />
      </BarraFiltros>

      <FlatList
        data={rodadasVisibles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <RodadaCard
            rodada={item}
            // Navegación con parámetro: abrimos /rodada/<id> (ruta dinámica [id]).
            onPress={() => router.push({ pathname: '/rodada/[id]', params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={<TextoVacio>No hay salidas para esta categoría.</TextoVacio>}
      />

      <BotonFlotante
        onPress={() => router.push('/crear')}
        activeOpacity={0.8}
        accessibilityLabel="Crear nueva rodada"
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </BotonFlotante>
    </Pantalla>
  );
}

// FlatList no es un styled component: su contentContainerStyle recibe un objeto de estilo.
const styles = StyleSheet.create({
  filtros: { gap: 10, paddingHorizontal: 16 },
  lista: { padding: 16, paddingBottom: 110 },
});

const Pantalla = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colores.fondo};
`;

const BarraFiltros = styled.View`
  padding: 10px 0 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colores.borde};
  background-color: ${({ theme }) => theme.colores.superficie};
`;

const TextoVacio = styled.Text`
  margin-top: 40px;
  text-align: center;
  font-size: 15px;
  color: ${({ theme }) => theme.colores.textoTenue};
`;

const BotonFlotante = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  bottom: 40px;
  width: 58px;
  height: 58px;
  border-radius: 29px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colores.primario};
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
`;
