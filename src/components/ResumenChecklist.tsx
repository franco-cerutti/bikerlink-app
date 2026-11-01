// src/components/ResumenChecklist.tsx
// Bloque del detalle con el avance del check-list y el botón para abrirlo.
// Solo tiene sentido si el usuario va a la rodada; si no, lo invita a confirmar.
import styled from 'styled-components/native';

import { useChecklist } from '../hooks/useChecklist';
import { Rodada } from '../types/rodada';
import BarraProgreso from './BarraProgreso';
import Boton from './Boton';

interface ResumenChecklistProps {
  rodada: Rodada;
  participa: boolean; // confirmó asistencia o es el organizador
  onAbrir: () => void;
}

export default function ResumenChecklist({ rodada, participa, onAbrir }: ResumenChecklistProps) {
  const { progreso } = useChecklist(rodada);

  if (!participa) {
    return <Texto>Confirmá tu asistencia para preparar tu moto y tu equipo con el check-list.</Texto>;
  }

  return (
    <>
      <Texto>
        {progreso.hechos === progreso.total
          ? '¡Todo listo para salir!'
          : `${progreso.hechos} de ${progreso.total} ítems listos`}
      </Texto>
      <Separacion>
        <BarraProgreso porcentaje={progreso.porcentaje} />
      </Separacion>
      <Boton texto="Abrir check-list" variante="secundario" icono="list-outline" onPress={onAbrir} />
    </>
  );
}

const Texto = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colores.texto};
`;

const Separacion = styled.View`
  margin: 10px 0 14px 0;
`;
