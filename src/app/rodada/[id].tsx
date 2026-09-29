// src/app/rodada/[id].tsx  →  ruta dinámica "/rodada/<id>"
// Detalle de una rodada + gestión de asistencia (Feature 3).
// Los corchetes en el nombre del archivo indican que "id" es un parámetro:
// /rodada/1, /rodada/2, etc. abren esta misma pantalla con distinto id.
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import Boton from '../../components/Boton';
import Encabezado from '../../components/Encabezado';
import FilaAsistente from '../../components/FilaAsistente';
import InfoFila from '../../components/InfoFila';
import { USUARIO_ACTUAL } from '../../data/usuario';
import { useRodadasStore } from '../../store/rodadasStore';
import {
  cupoCompleto,
  esOrganizador,
  estaConfirmado,
  lugaresDisponibles,
  resumenAsistencia,
} from '../../utils/asistencia';
import { formatearDistancia, formatearFechaHora } from '../../utils/formato';

export default function DetalleRodada() {
  const router = useRouter();

  // Leemos el parámetro que mandó el listado con router.push(...).
  const { id } = useLocalSearchParams<{ id: string }>();

  // Por params viaja solo el id. La rodada completa la buscamos en el store.
  // Como la pantalla está suscripta, cuando confirmamos o cancelamos se vuelve a dibujar sola.
  const rodada = useRodadasStore((state) => state.rodadas.find((r) => r.id === id));
  const confirmarAsistencia = useRodadasStore((state) => state.confirmarAsistencia);
  const cancelarAsistencia = useRodadasStore((state) => state.cancelarAsistencia);

  if (!rodada) {
    return (
      <Pantalla>
        <Encabezado titulo="Rodada no encontrada" onVolver={() => router.back()} />
        <Mensaje>La rodada que buscás no existe o fue eliminada.</Mensaje>
      </Pantalla>
    );
  }

  // Valores derivados para decidir qué mostrar.
  const confirmado = estaConfirmado(rodada, USUARIO_ACTUAL.id);
  const organizo = esOrganizador(rodada, USUARIO_ACTUAL.id);
  const lleno = cupoCompleto(rodada);
  const libres = lugaresDisponibles(rodada);

  const handleConfirmar = () => {
    confirmarAsistencia(rodada.id);
    Alert.alert('¡Estás adentro!', `Confirmaste tu lugar en "${rodada.titulo}".`);
  };

  // Antes de cancelar pedimos confirmación: es una acción que el usuario puede tocar sin querer.
  const handleCancelar = () => {
    Alert.alert('Cancelar asistencia', '¿Seguro que ya no vas a esta rodada?', [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, cancelar', style: 'destructive', onPress: () => cancelarAsistencia(rodada.id) },
    ]);
  };

  // Renderizado condicional: según el caso, la barra inferior muestra una cosa u otra.
  const renderAccion = () => {
    if (organizo) {
      return <TextoAviso>Sos el organizador de esta rodada.</TextoAviso>;
    }
    if (confirmado) {
      return (
        <Boton
          texto="Cancelar asistencia"
          variante="secundario"
          icono="person-remove-outline"
          onPress={handleCancelar}
        />
      );
    }
    if (lleno) {
      return (
        <Boton texto="Cupo completo" icono="lock-closed-outline" deshabilitado onPress={() => {}} />
      );
    }
    return <Boton texto="Confirmar asistencia" icono="person-add-outline" onPress={handleConfirmar} />;
  };

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
          <InfoFila
            icono="speedometer-outline"
            texto={`Distancia: ${formatearDistancia(rodada.distanciaKm)}`}
          />
        </Bloque>

        <Bloque>
          <TituloBloque>Cuándo</TituloBloque>
          <InfoFila icono="calendar-outline" texto={formatearFechaHora(rodada.fecha, rodada.hora)} />
        </Bloque>

        {rodada.descripcion ? (
          <Bloque>
            <TituloBloque>Recomendaciones</TituloBloque>
            <Descripcion>{rodada.descripcion}</Descripcion>
          </Bloque>
        ) : null}

        <Bloque>
          <TituloBloque>Asistentes</TituloBloque>
          <InfoFila icono="people-outline" texto={resumenAsistencia(rodada)} />
          {libres !== null && (
            <TextoCupo $lleno={lleno}>
              {lleno ? 'No quedan lugares' : `${libres} ${libres === 1 ? 'lugar libre' : 'lugares libres'}`}
            </TextoCupo>
          )}

          {/* La lista es corta, por eso alcanza con .map() dentro del ScrollView.
              Para listas largas usaríamos FlatList. */}
          {rodada.asistentes.map((asistente) => (
            <FilaAsistente
              key={asistente.id}
              asistente={asistente}
              esOrganizador={asistente.id === rodada.organizadorId}
              esUsuarioActual={asistente.id === USUARIO_ACTUAL.id}
            />
          ))}
        </Bloque>
      </ScrollView>

      <BarraInferior>{renderAccion()}</BarraInferior>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  contenido: { padding: 20, paddingBottom: 30 },
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

const TextoCupo = styled.Text<{ $lleno: boolean }>`
  margin: 0 0 6px 24px;
  font-size: 13px;
  font-weight: bold;
  color: ${({ theme, $lleno }) => ($lleno ? theme.colores.primario : theme.colores.textoSecundario)};
`;

const BarraInferior = styled.View`
  padding: 12px 20px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colores.borde};
  background-color: ${({ theme }) => theme.colores.superficie};
`;

const TextoAviso = styled.Text`
  padding: 12px 0;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colores.textoSecundario};
`;

const Mensaje = styled.Text`
  margin: 40px 20px;
  text-align: center;
  font-size: 15px;
  color: ${({ theme }) => theme.colores.textoTenue};
`;
