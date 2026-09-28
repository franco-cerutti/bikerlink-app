// src/components/Chip.tsx
// Botón tipo "píldora". Se usa en los filtros del listado y en el formulario de creación.
import styled from 'styled-components/native';

interface ChipProps {
  texto: string;
  seleccionado: boolean;
  onPress: () => void;
}

export default function Chip({ texto, seleccionado, onPress }: ChipProps) {
  return (
    <Contenedor $seleccionado={seleccionado} onPress={onPress} activeOpacity={0.7}>
      <Texto $seleccionado={seleccionado}>{texto}</Texto>
    </Contenedor>
  );
}

// Las props que empiezan con "$" son "transient props": solo sirven para calcular
// el estilo y no se pasan al componente nativo.
const Contenedor = styled.TouchableOpacity<{ $seleccionado: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  background-color: ${({ theme, $seleccionado }) =>
    $seleccionado ? theme.colores.primario : theme.colores.campo};
`;

const Texto = styled.Text<{ $seleccionado: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme, $seleccionado }) =>
    $seleccionado ? theme.colores.blanco : theme.colores.texto};
`;
