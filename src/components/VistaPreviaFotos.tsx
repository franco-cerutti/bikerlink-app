// src/components/VistaPreviaFotos.tsx
// Tira horizontal con las primeras fotos del destino + botón "Ver todas".
// Usa el mismo hook (y la misma queryKey) que la galería completa: cuando el usuario
// entra a la galería, las primeras fotos ya están en la caché y aparecen al instante.
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { useFotosDestino } from '../hooks/useFotosDestino';
import FotoRemota from './FotoRemota';

interface VistaPreviaFotosProps {
  destino: string;
  onVerTodas: () => void;
}

const CANTIDAD_PREVIA = 6;

export default function VistaPreviaFotos({ destino, onVerTodas }: VistaPreviaFotosProps) {
  const theme = useTheme();
  const { fotos, cargando, isError, error, refetch } = useFotosDestino(destino);

  if (cargando) {
    return <ActivityIndicator size="small" color={theme.colores.primario} />;
  }

  if (isError) {
    return (
      <>
        {/* error.message dice qué pasó (ej: 'Sin conexión' o 'código 403') */}
        <TextoTenue>No pudimos cargar las fotos ({error?.message}).</TextoTenue>
        <BotonTexto onPress={() => refetch()}>
          <TextoBoton>Reintentar</TextoBoton>
        </BotonTexto>
      </>
    );
  }

  if (fotos.length === 0) {
    return <TextoTenue>No encontramos fotos de este destino.</TextoTenue>;
  }

  return (
    <>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={fotos.slice(0, CANTIDAD_PREVIA)}
        keyExtractor={(foto) => foto.id}
        contentContainerStyle={styles.tira}
        renderItem={({ item }) => <FotoRemota url={item.url} estilo={styles.miniatura} />}
      />
      <BotonTexto onPress={onVerTodas}>
        <Fila>
          <Ionicons name="images-outline" size={16} color={theme.colores.primario} />
          <TextoBoton>Ver todas las fotos</TextoBoton>
        </Fila>
      </BotonTexto>
    </>
  );
}

const styles = StyleSheet.create({
  tira: { gap: 8 },
  // Imagen remota: siempre con ancho y alto explícitos.
  miniatura: { width: 120, height: 90, borderRadius: 8, backgroundColor: '#E5E5EA' },
});

const Fila = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const TextoTenue = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colores.textoTenue};
`;

const BotonTexto = styled.TouchableOpacity`
  align-self: flex-start;
  padding: 10px 0 0 0;
`;

const TextoBoton = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.colores.primario};
`;
