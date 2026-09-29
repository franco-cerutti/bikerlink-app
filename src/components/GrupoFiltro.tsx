// src/components/GrupoFiltro.tsx
// Un título + una fila de chips que se desliza horizontalmente.
// Es genérico: sirve para cualquier lista de opciones { id, etiqueta }.
import { ScrollView, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import Chip from './Chip';

interface Opcion {
  id: string;
  etiqueta: string;
}

interface GrupoFiltroProps {
  titulo: string;
  opciones: readonly Opcion[];
  seleccionada: string;
  onSeleccionar: (id: string) => void;
}

export default function GrupoFiltro({ titulo, opciones, seleccionada, onSeleccionar }: GrupoFiltroProps) {
  return (
    <Contenedor>
      <Titulo>{titulo}</Titulo>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.fila}
      >
        {opciones.map((opcion) => (
          <Chip
            key={opcion.id}
            texto={opcion.etiqueta}
            seleccionado={opcion.id === seleccionada}
            onPress={() => onSeleccionar(opcion.id)}
          />
        ))}
      </ScrollView>
    </Contenedor>
  );
}

const styles = StyleSheet.create({
  fila: { gap: 10, paddingHorizontal: 16 },
});

const Contenedor = styled.View`
  margin-top: 12px;
`;

const Titulo = styled.Text`
  margin: 0 16px 8px 16px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colores.textoSecundario};
`;
