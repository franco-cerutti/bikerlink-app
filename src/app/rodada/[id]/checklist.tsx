// src/app/rodada/[id]/checklist.tsx  →  ruta "/rodada/<id>/checklist"
// Check-list de preparación (Feature 6). Los ítems cambian según el tipo de salida,
// se muestran agrupados por categoría con SectionList y los tildes quedan guardados
// en el celular (AsyncStorage) aunque se cierre la app.
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, SectionList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import BarraProgreso from '../../../components/BarraProgreso';
import Encabezado from '../../../components/Encabezado';
import FilaChecklist from '../../../components/FilaChecklist';
import { useChecklist } from '../../../hooks/useChecklist';
import { useChecklistStore } from '../../../store/checklistStore';
import { useRodadasStore } from '../../../store/rodadasStore';
import { Rodada } from '../../../types/rodada';
import { agruparPorCategoria } from '../../../utils/checklist';

export default function PantallaChecklist() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const rodada = useRodadasStore((state) => state.rodadas.find((r) => r.id === id));

  if (!rodada) {
    return (
      <Pantalla>
        <Encabezado titulo="Rodada no encontrada" onVolver={() => router.back()} />
      </Pantalla>
    );
  }

  // La lista va en un componente aparte porque usa hooks que necesitan la rodada:
  // los hooks no pueden ir después de un "return" condicional.
  return <ListaChecklist rodada={rodada} onVolver={() => router.back()} />;
}

function ListaChecklist({ rodada, onVolver }: { rodada: Rodada; onVolver: () => void }) {
  const { items, tildados, progreso } = useChecklist(rodada);
  const alternarItem = useChecklistStore((state) => state.alternarItem);
  const reiniciarChecklist = useChecklistStore((state) => state.reiniciarChecklist);

  const handleReiniciar = () => {
    Alert.alert('Reiniciar check-list', '¿Destildar todos los ítems?', [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, reiniciar', style: 'destructive', onPress: () => reiniciarChecklist(rodada.id) },
    ]);
  };

  const completo = progreso.hechos === progreso.total;

  return (
    <Pantalla>
      <Encabezado titulo="Check-list" subtitulo={rodada.titulo} onVolver={onVolver} />

      <Resumen>
        <FilaResumen>
          <TextoProgreso>
            {completo ? '¡Todo listo para salir!' : `${progreso.hechos} de ${progreso.total} listos`}
          </TextoProgreso>
          {progreso.hechos > 0 && (
            <BotonTexto onPress={handleReiniciar}>
              <TextoBoton>Reiniciar</TextoBoton>
            </BotonTexto>
          )}
        </FilaResumen>
        <BarraProgreso porcentaje={progreso.porcentaje} />
        <Ayuda>Los ítems de "Para este viaje" dependen del tipo de salida: {rodada.tipo}.</Ayuda>
      </Resumen>

      {/* SectionList: como FlatList, pero con la lista dividida en secciones con título. */}
      <SectionList
        sections={agruparPorCategoria(items)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        stickySectionHeadersEnabled // el título de la sección queda fijo arriba al hacer scroll
        renderSectionHeader={({ section }) => (
          <TituloSeccion>
            {section.title} ({section.data.filter((item) => tildados.includes(item.id)).length}/
            {section.data.length})
          </TituloSeccion>
        )}
        renderItem={({ item }) => (
          <FilaChecklist
            texto={item.texto}
            tildado={tildados.includes(item.id)}
            onPress={() => alternarItem(rodada.id, item.id)}
          />
        )}
      />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  lista: { paddingBottom: 30 },
});

const Pantalla = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colores.fondo};
`;

const Resumen = styled.View`
  gap: 10px;
  padding: 4px 20px 14px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colores.borde};
  background-color: ${({ theme }) => theme.colores.superficie};
`;

const FilaResumen = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TextoProgreso = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colores.texto};
`;

const Ayuda = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colores.textoSecundario};
`;

const TituloSeccion = styled.Text`
  padding: 14px 16px 6px 16px;
  font-size: 13px;
  font-weight: bold;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colores.textoSecundario};
  background-color: ${({ theme }) => theme.colores.fondo};
`;

const BotonTexto = styled.TouchableOpacity`
  padding: 4px 0;
`;

const TextoBoton = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.colores.primario};
`;
