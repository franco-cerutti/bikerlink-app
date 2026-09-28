// src/components/Encabezado.tsx
// Encabezado reutilizable: título, subtítulo opcional y botón "volver" opcional.
// Si la pantalla le pasa onVolver, se muestra la flecha; si no, no aparece.
import { Ionicons } from '@expo/vector-icons';
import styled, { useTheme } from 'styled-components/native';

interface EncabezadoProps {
  titulo: string;
  subtitulo?: string; // el "?" indica que la prop es opcional
  onVolver?: () => void;
}

export default function Encabezado({ titulo, subtitulo, onVolver }: EncabezadoProps) {
  // useTheme da acceso al tema en código JS (acá lo necesitamos para el color del ícono).
  const theme = useTheme();

  return (
    <Contenedor>
      {onVolver && (
        <BotonVolver onPress={onVolver} accessibilityLabel="Volver">
          <Ionicons name="arrow-back" size={24} color={theme.colores.texto} />
        </BotonVolver>
      )}
      <Textos>
        <Titulo>{titulo}</Titulo>
        {subtitulo && <Subtitulo>{subtitulo}</Subtitulo>}
      </Textos>
    </Contenedor>
  );
}

const Contenedor = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 15px 20px 12px 20px;
  background-color: ${({ theme }) => theme.colores.superficie};
`;

const BotonVolver = styled.TouchableOpacity`
  margin-right: 12px;
  padding: 4px;
`;

const Textos = styled.View`
  flex: 1;
`;

const Titulo = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: ${({ theme }) => theme.colores.texto};
`;

const Subtitulo = styled.Text`
  font-size: 14px;
  margin-top: 2px;
  color: ${({ theme }) => theme.colores.textoSecundario};
`;
