// src/components/BarraBusqueda.tsx
// Campo de búsqueda con ícono de lupa y botón para borrar el texto.
// Es un componente "controlado": el texto vive en el estado del padre (value + onChangeText).
import { Ionicons } from '@expo/vector-icons';
import styled, { useTheme } from 'styled-components/native';

interface BarraBusquedaProps {
  value: string;
  onChangeText: (texto: string) => void;
  placeholder?: string;
}

export default function BarraBusqueda({ value, onChangeText, placeholder }: BarraBusquedaProps) {
  const theme = useTheme();

  return (
    <Contenedor>
      <Ionicons name="search-outline" size={18} color={theme.colores.textoTenue} />
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colores.textoTenue}
        returnKeyType="search"
        autoCorrect={false}
      />
      {/* La "x" aparece solo cuando hay algo escrito */}
      {value.length > 0 && (
        <BotonBorrar onPress={() => onChangeText('')} accessibilityLabel="Borrar búsqueda">
          <Ionicons name="close-circle" size={18} color={theme.colores.textoTenue} />
        </BotonBorrar>
      )}
    </Contenedor>
  );
}

const Contenedor = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding: 0 12px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colores.campo};
`;

const Input = styled.TextInput`
  flex: 1;
  padding: 10px 8px;
  font-size: 15px;
  color: ${({ theme }) => theme.colores.texto};
`;

const BotonBorrar = styled.TouchableOpacity`
  padding: 4px;
`;
