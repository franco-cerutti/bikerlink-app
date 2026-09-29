// src/components/FilaAsistente.tsx
// Una fila de la lista de asistentes: avatar con iniciales, nombre, moto y etiquetas.
import styled from 'styled-components/native';

import { Asistente } from '../types/rodada';
import { iniciales } from '../utils/asistencia';

interface FilaAsistenteProps {
  asistente: Asistente;
  esOrganizador: boolean;
  esUsuarioActual: boolean;
}

export default function FilaAsistente({ asistente, esOrganizador, esUsuarioActual }: FilaAsistenteProps) {
  return (
    <Fila>
      <Avatar $destacado={esUsuarioActual}>
        <TextoAvatar $destacado={esUsuarioActual}>{esUsuarioActual ? 'VOS' : iniciales(asistente.nombre)}</TextoAvatar>
      </Avatar>

      <Datos>
        <Nombre>{asistente.nombre}</Nombre>
        {asistente.moto && <Moto>{asistente.moto}</Moto>}
      </Datos>

      {esOrganizador && <Etiqueta>Organiza</Etiqueta>}
    </Fila>
  );
}

const Fila = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colores.campo};
`;

const Avatar = styled.View<{ $destacado: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, $destacado }) =>
    $destacado ? theme.colores.primario : theme.colores.primarioSuave};
`;

const TextoAvatar = styled.Text<{ $destacado: boolean }>`
  font-size: 13px;
  font-weight: bold;
  color: ${({ theme, $destacado }) =>
    $destacado ? theme.colores.blanco : theme.colores.primarioOscuro};
`;

const Datos = styled.View`
  flex: 1;
  margin-left: 12px;
`;

const Nombre = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colores.texto};
`;

const Moto = styled.Text`
  margin-top: 2px;
  font-size: 13px;
  color: ${({ theme }) => theme.colores.textoSecundario};
`;

const Etiqueta = styled.Text`
  padding: 3px 8px;
  border-radius: 6px;
  overflow: hidden;
  font-size: 11px;
  font-weight: bold;
  background-color: ${({ theme }) => theme.colores.texto};
  color: ${({ theme }) => theme.colores.blanco};
`;
