// src/components/InfoFila.tsx
// Una fila "ícono + texto" (ej: 📅 fecha). Reemplaza a los emojis que usábamos antes.
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import styled, { useTheme } from 'styled-components/native';

// Tipo de los nombres de íconos válidos de Ionicons (el editor los autocompleta).
type NombreIcono = ComponentProps<typeof Ionicons>['name'];

interface InfoFilaProps {
  icono: NombreIcono;
  texto: string;
}

export default function InfoFila({ icono, texto }: InfoFilaProps) {
  const theme = useTheme();
  return (
    <Fila>
      <Ionicons name={icono} size={16} color={theme.colores.primario} />
      <Texto>{texto}</Texto>
    </Fila>
  );
}

const Fila = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
`;

const Texto = styled.Text`
  flex: 1;
  margin-left: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colores.texto};
`;
