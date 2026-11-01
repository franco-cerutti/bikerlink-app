// src/components/FilaChecklist.tsx
// Un ítem del check-list: casilla + texto. Al tocar toda la fila se tilda o destilda.
import { Ionicons } from '@expo/vector-icons';
import styled, { useTheme } from 'styled-components/native';

interface FilaChecklistProps {
  texto: string;
  tildado: boolean;
  onPress: () => void;
}

export default function FilaChecklist({ texto, tildado, onPress }: FilaChecklistProps) {
  const theme = useTheme();
  return (
    <Fila
      onPress={onPress}
      activeOpacity={0.6}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: tildado }}
    >
      <Ionicons
        name={tildado ? 'checkbox' : 'square-outline'}
        size={24}
        color={tildado ? theme.colores.primario : theme.colores.textoTenue}
      />
      <Texto $tildado={tildado}>{texto}</Texto>
    </Fila>
  );
}

const Fila = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colores.campo};
  background-color: ${({ theme }) => theme.colores.superficie};
`;

// Tachado y en gris cuando ya está hecho.
const Texto = styled.Text<{ $tildado: boolean }>`
  flex: 1;
  font-size: 15px;
  color: ${({ theme, $tildado }) => ($tildado ? theme.colores.textoTenue : theme.colores.texto)};
  text-decoration-line: ${({ $tildado }) => ($tildado ? 'line-through' : 'none')};
`;
