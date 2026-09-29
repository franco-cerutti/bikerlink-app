// src/components/Boton.tsx
// Botón reutilizable con dos variantes:
//  - 'primario': fondo rojo, para la acción principal (Publicar, Confirmar).
//  - 'secundario': borde rojo y fondo blanco, para acciones de menor peso (Cancelar).
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import styled, { useTheme } from 'styled-components/native';

type Variante = 'primario' | 'secundario';

interface BotonProps {
  texto: string;
  onPress: () => void;
  variante?: Variante; // si no se pasa, es 'primario'
  icono?: ComponentProps<typeof Ionicons>['name'];
  deshabilitado?: boolean;
}

export default function Boton({
  texto,
  onPress,
  variante = 'primario',
  icono,
  deshabilitado = false,
}: BotonProps) {
  const theme = useTheme();
  const colorTexto = variante === 'primario' ? theme.colores.blanco : theme.colores.primario;

  return (
    <Contenedor
      $variante={variante}
      $deshabilitado={deshabilitado}
      onPress={onPress}
      disabled={deshabilitado} // un botón deshabilitado no responde al toque
      activeOpacity={0.8}
    >
      {icono && <Ionicons name={icono} size={20} color={colorTexto} />}
      <Texto $color={colorTexto}>{texto}</Texto>
    </Contenedor>
  );
}

const Contenedor = styled.TouchableOpacity<{ $variante: Variante; $deshabilitado: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 15px;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colores.primario};
  background-color: ${({ theme, $variante }) =>
    $variante === 'primario' ? theme.colores.primario : theme.colores.superficie};
  opacity: ${({ $deshabilitado }) => ($deshabilitado ? 0.4 : 1)};
`;

const Texto = styled.Text<{ $color: string }>`
  font-size: 16px;
  font-weight: bold;
  color: ${({ $color }) => $color};
`;
