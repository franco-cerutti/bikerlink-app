// src/app/rodada/[id]/fotos.tsx  →  ruta "/rodada/<id>/fotos"
// Galería de fotos del destino con SCROLL INFINITO (paginación).
// FlatList avisa con onEndReached cuando el usuario se acerca al final,
// y en ese momento pedimos la página siguiente con fetchNextPage().
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Linking, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';

import Encabezado from '../../../components/Encabezado';
import FotoRemota from '../../../components/FotoRemota';
import { useFotosDestino } from '../../../hooks/useFotosDestino';
import { useRodadasStore } from '../../../store/rodadasStore';

const COLUMNAS = 2;
const ESPACIO = 8;

export default function GaleriaFotos() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const rodada = useRodadasStore((state) => state.rodadas.find((r) => r.id === id));

  // Ancho de cada foto según el ancho de la pantalla: (pantalla - márgenes) / columnas.
  const { width } = useWindowDimensions();
  const anchoFoto = (width - ESPACIO * (COLUMNAS + 1)) / COLUMNAS;

  // Si la rodada no existe, buscamos con texto vacío: el hook igual tiene que llamarse
  // siempre (los hooks no se pueden poner dentro de un if).
  const { fotos, cargando, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFotosDestino(rodada?.destino ?? '');

  if (!rodada) {
    return (
      <Pantalla>
        <Encabezado titulo="Rodada no encontrada" onVolver={() => router.back()} />
      </Pantalla>
    );
  }

  // Se llama cuando el usuario llega cerca del final de la lista.
  const cargarMas = () => {
    // Evitamos pedir dos veces la misma página o pedir cuando ya no hay más.
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  return (
    <Pantalla>
      <Encabezado titulo="Fotos del destino" subtitulo={rodada.destino} onVolver={() => router.back()} />

      {cargando ? (
        <Centrado>
          <ActivityIndicator size="large" color={theme.colores.primario} />
        </Centrado>
      ) : isError ? (
        <Centrado>
          <Ionicons name="cloud-offline-outline" size={40} color={theme.colores.textoTenue} />
          <TextoTenue>No pudimos cargar las fotos ({error?.message}).</TextoTenue>
          <BotonTexto onPress={() => refetch()}>
            <TextoBoton>Reintentar</TextoBoton>
          </BotonTexto>
        </Centrado>
      ) : (
        <FlatList
          data={fotos}
          keyExtractor={(foto) => foto.id}
          numColumns={COLUMNAS} // grilla de 2 columnas
          columnWrapperStyle={styles.fila}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            // Al tocar una foto abrimos su página en Wikimedia (autor y licencia).
            <Celda onPress={() => Linking.openURL(item.pagina)} activeOpacity={0.8}>
              <FotoRemota url={item.url} estilo={[styles.foto, { width: anchoFoto, height: anchoFoto * 0.75 }]} />
              <Leyenda numberOfLines={1} style={{ width: anchoFoto }}>
                {item.titulo}
              </Leyenda>
            </Celda>
          )}
          // ----- Scroll infinito -----
          onEndReached={cargarMas}
          onEndReachedThreshold={0.5} // pedir más cuando falta medio "alto de pantalla" para el final
          ListFooterComponent={
            isFetchingNextPage ? (
              <Pie>
                <ActivityIndicator size="small" color={theme.colores.primario} />
              </Pie>
            ) : !hasNextPage && fotos.length > 0 ? (
              <Pie>
                <TextoTenue>No hay más fotos · Fuente: Wikimedia Commons</TextoTenue>
              </Pie>
            ) : null
          }
          ListEmptyComponent={
            <Centrado>
              <Ionicons name="images-outline" size={40} color={theme.colores.textoTenue} />
              <TextoTenue>No encontramos fotos de este destino.</TextoTenue>
            </Centrado>
          }
        />
      )}
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  lista: { padding: ESPACIO, paddingBottom: 30 },
  fila: { gap: ESPACIO },
  foto: { borderRadius: 8, backgroundColor: '#E5E5EA' },
});

const Pantalla = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colores.fondo};
`;

const Centrado = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px 20px;
`;

const Celda = styled.TouchableOpacity`
  margin-bottom: ${ESPACIO}px;
`;

const Leyenda = styled.Text`
  margin-top: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.colores.textoSecundario};
`;

const Pie = styled.View`
  align-items: center;
  padding: 16px;
`;

const TextoTenue = styled.Text`
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colores.textoTenue};
`;

const BotonTexto = styled.TouchableOpacity`
  padding: 6px 12px;
`;

const TextoBoton = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.colores.primario};
`;
