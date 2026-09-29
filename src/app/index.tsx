// src/app/index.tsx  →  ruta "/"
// Pantalla principal: listado de rodadas con búsqueda y filtros (Feature 2).
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';

import BarraBusqueda from '../components/BarraBusqueda';
import Encabezado from '../components/Encabezado';
import GrupoFiltro from '../components/GrupoFiltro';
import RodadaCard from '../components/RodadaCard';
import { useRodadasStore } from '../store/rodadasStore';
import { TIPOS_SALIDA } from '../types/rodada';
import {
  contarFiltrosAvanzados,
  CRITERIOS_INICIALES,
  CriteriosBusqueda,
  filtrarRodadas,
  FILTROS_DISTANCIA,
  FILTROS_FECHA,
  FiltroDistancia,
  FiltroFecha,
  hayCriteriosActivos,
} from '../utils/filtros';

// Los tipos de salida con el mismo formato { id, etiqueta } que usan los otros filtros.
const OPCIONES_TIPO = ['Todas', ...TIPOS_SALIDA].map((tipo) => ({ id: tipo, etiqueta: tipo }));

export default function ListadoRodadas() {
  const router = useRouter();
  const theme = useTheme();

  const rodadas = useRodadasStore((state) => state.rodadas);

  // Todos los criterios juntos en UN objeto de estado.
  const [criterios, setCriterios] = useState<CriteriosBusqueda>(CRITERIOS_INICIALES);
  // Si el panel de filtros avanzados (fecha y distancia) está abierto o cerrado.
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Actualiza UN criterio y conserva los demás (spread del objeto anterior).
  const cambiarCriterio = (cambio: Partial<CriteriosBusqueda>) => {
    setCriterios((anteriores) => ({ ...anteriores, ...cambio }));
  };

  const limpiarFiltros = () => setCriterios(CRITERIOS_INICIALES);

  // Valores derivados: se recalculan en cada render a partir del estado.
  const rodadasVisibles = filtrarRodadas(rodadas, criterios);
  const cantidadFiltros = contarFiltrosAvanzados(criterios);
  const hayFiltros = hayCriteriosActivos(criterios);

  return (
    <Pantalla edges={['top']}>
      <Encabezado titulo="BikerLink" subtitulo="Explorá tu próxima rodada en grupo" />

      <Panel>
        <FilaBusqueda>
          <BarraBusqueda
            value={criterios.texto}
            onChangeText={(texto) => cambiarCriterio({ texto })}
            placeholder="Buscar por nombre, destino o salida"
          />
          <BotonFiltros
            $activo={mostrarFiltros || cantidadFiltros > 0}
            onPress={() => setMostrarFiltros(!mostrarFiltros)}
            accessibilityLabel="Mostrar filtros"
          >
            <Ionicons
              name="options-outline"
              size={22}
              color={mostrarFiltros || cantidadFiltros > 0 ? theme.colores.blanco : theme.colores.texto}
            />
            {cantidadFiltros > 0 && (
              <Badge>
                <TextoBadge>{cantidadFiltros}</TextoBadge>
              </Badge>
            )}
          </BotonFiltros>
        </FilaBusqueda>

        <GrupoFiltro
          titulo="Tipo de salida"
          opciones={OPCIONES_TIPO}
          seleccionada={criterios.tipo}
          onSeleccionar={(tipo) => cambiarCriterio({ tipo })}
        />

        {/* Renderizado condicional: los filtros avanzados solo se muestran si el panel está abierto */}
        {mostrarFiltros && (
          <>
            <GrupoFiltro
              titulo="Fecha"
              opciones={FILTROS_FECHA}
              seleccionada={criterios.fecha}
              onSeleccionar={(id) => cambiarCriterio({ fecha: id as FiltroFecha })}
            />
            <GrupoFiltro
              titulo="Distancia"
              opciones={FILTROS_DISTANCIA}
              seleccionada={criterios.distancia}
              onSeleccionar={(id) => cambiarCriterio({ distancia: id as FiltroDistancia })}
            />
          </>
        )}

        <FilaResultados>
          <TextoResultados>
            {rodadasVisibles.length} {rodadasVisibles.length === 1 ? 'rodada' : 'rodadas'}
          </TextoResultados>
          {hayFiltros && (
            <BotonLimpiar onPress={limpiarFiltros}>
              <TextoLimpiar>Limpiar filtros</TextoLimpiar>
            </BotonLimpiar>
          )}
        </FilaResultados>
      </Panel>

      <FlatList
        data={rodadasVisibles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        renderItem={({ item }) => (
          <RodadaCard
            rodada={item}
            onPress={() => router.push({ pathname: '/rodada/[id]', params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={
          <Vacio>
            <Ionicons name="search-outline" size={40} color={theme.colores.textoTenue} />
            <TextoVacio>No encontramos rodadas con esos criterios.</TextoVacio>
            {hayFiltros && (
              <BotonLimpiar onPress={limpiarFiltros}>
                <TextoLimpiar>Limpiar filtros</TextoLimpiar>
              </BotonLimpiar>
            )}
          </Vacio>
        }
      />

      <BotonFlotante
        onPress={() => router.push('/crear')}
        activeOpacity={0.8}
        accessibilityLabel="Crear nueva rodada"
      >
        <Ionicons name="add" size={32} color={theme.colores.blanco} />
      </BotonFlotante>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  lista: { padding: 16, paddingBottom: 110 },
});

const Pantalla = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colores.fondo};
`;

const Panel = styled.View`
  padding-bottom: 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colores.borde};
  background-color: ${({ theme }) => theme.colores.superficie};
`;

const FilaBusqueda = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
`;

const BotonFiltros = styled.TouchableOpacity<{ $activo: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, $activo }) =>
    $activo ? theme.colores.primario : theme.colores.campo};
`;

const Badge = styled.View`
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 9px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colores.texto};
`;

const TextoBadge = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: ${({ theme }) => theme.colores.blanco};
`;

const FilaResultados = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding: 0 16px;
`;

const TextoResultados = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colores.textoSecundario};
`;

const BotonLimpiar = styled.TouchableOpacity`
  padding: 4px 0;
`;

const TextoLimpiar = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: ${({ theme }) => theme.colores.primario};
`;

const Vacio = styled.View`
  align-items: center;
  margin-top: 40px;
  gap: 10px;
`;

const TextoVacio = styled.Text`
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
