// src/components/CampoTexto.tsx
// Etiqueta + TextInput con el estilo de la app. Recibe todas las props normales
// de un TextInput (value, onChangeText, placeholder, keyboardType...) y las reenvía.
import { TextInputProps } from 'react-native';
import styled from 'styled-components/native';

interface CampoTextoProps extends TextInputProps {
  etiqueta: string;
}

export default function CampoTexto({ etiqueta, multiline, ...propsDelInput }: CampoTextoProps) {
  return (
    <Grupo>
      <Etiqueta>{etiqueta}</Etiqueta>
      <Input
        {...propsDelInput}
        multiline={multiline}
        $multilinea={!!multiline}
        placeholderTextColor="#8E8E93"
      />
    </Grupo>
  );
}

const Grupo = styled.View`
  flex: 1;
  margin-bottom: 18px;
`;

const Etiqueta = styled.Text`
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colores.texto};
`;

const Input = styled.TextInput<{ $multilinea: boolean }>`
  padding: 12px 14px;
  border-radius: 10px;
  border-width: 1px;
  font-size: 15px;
  height: ${({ $multilinea }) => ($multilinea ? '90px' : 'auto')};
  text-align-vertical: ${({ $multilinea }) => ($multilinea ? 'top' : 'center')};
  border-color: ${({ theme }) => theme.colores.borde};
  background-color: ${({ theme }) => theme.colores.campo};
  color: ${({ theme }) => theme.colores.texto};
`;
