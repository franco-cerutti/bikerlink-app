// src/components/RodadaCard.tsx
// Tarjeta de una rodada en el listado. Recibe la rodada por props y avisa
// al padre cuando la tocan (onPress). No sabe nada de navegación: eso lo decide la pantalla.
import { Ionicons } from '@expo/vector-icons';
import styled, { useTheme } from 'styled-components/native';

import { Rodada } from '../types/rodada';
import { formatearDistancia, formatearFechaHora } from '../utils/formato';
import InfoFila from './InfoFila';

interface RodadaCardProps {
  rodada: Rodada;
  onPress: () => void;
}

export default function RodadaCard({ rodada, onPress }: RodadaCardProps) {
  const theme = useTheme();

  return (
    <Tarjeta onPress={onPress} activeOpacity={0.8}>
      <Cabecera>
        <Titulo>{rodada.titulo}</Titulo>
        <Etiqueta>{rodada.tipo}</Etiqueta>
      </Cabecera>

      <InfoFila icono="flag-outline" texto={`Salida: ${rodada.puntoEncuentro}`} />
      <InfoFila icono="location-outline" texto={`Destino: ${rodada.destino}`} />
      <InfoFila icono="calendar-outline" texto={formatearFechaHora(rodada.fecha, rodada.hora)} />
      <InfoFila icono="speedometer-outline" texto={formatearDistancia(rodada.distanciaKm)} />

      <Pie>
        <InfoFila icono="people-outline" texto={`${rodada.asistentes} moteros confirmados`} />
        <Ionicons name="chevron-forward" size={20} color={theme.colores.textoTenue} />
      </Pie>
    </Tarjeta>
  );
}

const Tarjeta = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colores.superficie};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
`;

const Cabecera = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Titulo = styled.Text`
  flex: 1;
  margin-right: 8px;
  font-size: 17px;
  font-weight: bold;
  color: ${({ theme }) => theme.colores.texto};
`;

const Etiqueta = styled.Text`
  padding: 4px 8px;
  border-radius: 6px;
  overflow: hidden;
  font-size: 12px;
  font-weight: bold;
  background-color: ${({ theme }) => theme.colores.primarioSuave};
  color: ${({ theme }) => theme.colores.primarioOscuro};
`;

const Pie = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 6px;
  padding-top: 10px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colores.campo};
`;
