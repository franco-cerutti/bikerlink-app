// src/app/rodada/[id].tsx  →  ruta dinámica "/rodada/<id>"
// Los corchetes en el nombre del archivo indican que "id" es un parámetro:
// /rodada/1, /rodada/2, etc. abren esta misma pantalla con distinto id.
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import Encabezado from '../../components/Encabezado';
import InfoFila from '../../components/InfoFila';
import { useRodadasStore } from '../../store/rodadasStore';
import { formatearDistancia, formatearFechaHora } from '../../utils/formato';

export default function DetalleRodada() {
  const router = useRouter();

  // Leemos el parámetro que mandó el listado con router.push(...).
  const { id } = useLocalSearchParams<{ id: string }>();

  // Por params viaja solo el id (un dato simple). La rodada completa la buscamos en el store.
  const rodada = useRodadasStore((state) => state.rodadas.find((r) => r.id === id));

  // Si el id no existe (por ejemplo, un link viejo), mostramos un mensaje en vez de romper.
  if (!rodada) {
    return (
      <Pantalla>
        <Encabezado titulo="Rodada no encontrada" onVolver={() => router.back()} />
        <Mensaje>La rodada que buscás no existe o fue eliminada.</Mensaje>
      </Pantalla>
    );
  }

  return (
    <Pantalla>
      <Encabezado titulo="Detalle" onVolver={() => router.back()} />

      <ScrollView contentContainerStyle={styles.contenido}>
        <Etiqueta>{rodada.tipo}</Etiqueta>
        <Titulo>{rodada.titulo}</Titulo>

        <Bloque>
          <TituloBloque>Recorrido</TituloBloque>
          <InfoFila icono="flag-outline" texto={`Punto de encuentro: ${rodada.puntoEncuentro}`} />
          <InfoFila icono="location-outline" texto={`Destino: ${rodada.destino}`} />
          <InfoFila icono="speedometer-outline" texto={`Distancia: ${formatearDistancia(rodada.distanciaKm)}`} />
        </Bloque>

        <Bloque>
          <TituloBloque>Cuándo</TituloBloque>
          <InfoFila icono="calendar-outline" texto={formatearFechaHora(rodada.fecha, rodada.hora)} />
        </Bloque>

        <Bloque>
          <TituloBloque>Asistencia</TituloBloque>
          <InfoFila icono="people-outline" texto={`${rodada.asistentes} moteros confirmados`} />
        </Bloque>

        {rodada.descripcion ? (
          <Bloque>
            <TituloBloque>Recomendaciones</TituloBloque>
            <Descripcion>{rodada.descripcion}</Descripcion>
          </Bloque>
        ) : null}
      </ScrollView>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  contenido: { padding: 20 },
});

const Pantalla = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colores.fondo};
`;

const Etiqueta = styled.Text`
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 6px;
  overflow: hidden;
  font-size: 12px;
  font-weight: bold;
  background-color: ${({ theme }) => theme.colores.primarioSuave};
  color: ${({ theme }) => theme.colores.primarioOscuro};
`;

const Titulo = styled.Text`
  margin: 10px 0 16px 0;
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colores.texto};
`;

const Bloque = styled.View`
  margin-bottom: 14px;
  padding: 16px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colores.superficie};
`;

const TituloBloque = styled.Text`
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: bold;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colores.textoSecundario};
`;

const Descripcion = styled.Text`
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.colores.texto};
`;

const Mensaje = styled.Text`
  margin: 40px 20px;
  text-align: center;
  font-size: 15px;
  color: ${({ theme }) => theme.colores.textoTenue};
`;
