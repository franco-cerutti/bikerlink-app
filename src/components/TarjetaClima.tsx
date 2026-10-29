// src/components/TarjetaClima.tsx
// Pronóstico del clima del destino para el día de la rodada (Feature 4).
// Muestra los 3 estados de una consulta: cargando, error y datos.
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { usePronostico } from '../hooks/usePronostico';
import { Rodada } from '../types/rodada';
import { consejosParaRodar, describirClima } from '../utils/clima';
import { formatearFecha } from '../utils/formato';

interface TarjetaClimaProps {
  rodada: Rodada;
}

export default function TarjetaClima({ rodada }: TarjetaClimaProps) {
  const theme = useTheme();
  const { ubicacion, pronostico, disponibilidad } = usePronostico(rodada);

  // --- Casos en los que no hay nada que pedir a la API ---
  if (disponibilidad.estado === 'pasada') {
    return <Aviso icono="time-outline" texto="La rodada ya pasó." />;
  }
  if (disponibilidad.estado === 'muyLejos') {
    const desde = formatearFecha(disponibilidad.disponibleDesde);
    return (
      <Aviso
        icono="time-outline"
        texto={`El pronóstico se puede consultar hasta 16 días antes. Vas a poder verlo desde el ${desde}.`}
      />
    );
  }

  // --- Estado 1: cargando (primero la ubicación, después el pronóstico) ---
  if (ubicacion.isLoading || pronostico.isLoading) {
    return (
      <Centrado>
        <ActivityIndicator size="small" color={theme.colores.primario} />
        <TextoTenue>Consultando el pronóstico…</TextoTenue>
      </Centrado>
    );
  }

  // --- Estado 2: error (sin conexión, la API no responde, etc.) ---
  if (ubicacion.isError || pronostico.isError) {
    return (
      <Centrado>
        <Ionicons name="cloud-offline-outline" size={28} color={theme.colores.textoTenue} />
        <TextoTenue>
          No pudimos obtener el pronóstico ({(ubicacion.error ?? pronostico.error)?.message}).
        </TextoTenue>
        {/* refetch vuelve a ejecutar la consulta que falló */}
        <BotonTexto onPress={() => (ubicacion.isError ? ubicacion.refetch() : pronostico.refetch())}>
          <TextoBoton>Reintentar</TextoBoton>
        </BotonTexto>
      </Centrado>
    );
  }

  // La API de lugares respondió bien, pero no conoce ese destino.
  if (ubicacion.data === null) {
    return (
      <Aviso
        icono="location-outline"
        texto={`No encontramos "${rodada.destino}" para consultar el clima. Probá escribir la localidad (ej: Mina Clavero).`}
      />
    );
  }

  // --- Estado 3: datos ---
  const datos = pronostico.data;
  if (!datos) return null;
  const { texto, icono } = describirClima(datos.codigoClima);

  return (
    <>
      <Lugar>
        {ubicacion.data?.nombre}
        {ubicacion.data?.provincia ? `, ${ubicacion.data.provincia}` : ''}
      </Lugar>

      <Principal>
        <Ionicons name={icono} size={44} color={theme.colores.primario} />
        <Textos>
          <Estado>{texto}</Estado>
          <Temperaturas>
            {datos.maxima}° / {datos.minima}°
          </Temperaturas>
        </Textos>
      </Principal>

      <Detalles>
        <Dato>
          <Ionicons name="umbrella-outline" size={16} color={theme.colores.textoSecundario} />
          <TextoDato>Lluvia {datos.probabilidadLluvia}%</TextoDato>
        </Dato>
        <Dato>
          <Ionicons name="flag-outline" size={16} color={theme.colores.textoSecundario} />
          <TextoDato>Viento {datos.vientoMaximo} km/h</TextoDato>
        </Dato>
      </Detalles>

      {consejosParaRodar(datos).map((consejo) => (
        <Consejo key={consejo}>• {consejo}</Consejo>
      ))}

      <Fuente>Datos: Open-Meteo.com</Fuente>
    </>
  );
}

// Mensaje simple con ícono, para los casos sin datos.
function Aviso({ icono, texto }: { icono: 'time-outline' | 'location-outline'; texto: string }) {
  const theme = useTheme();
  return (
    <FilaAviso>
      <Ionicons name={icono} size={18} color={theme.colores.textoTenue} />
      <TextoAviso>{texto}</TextoAviso>
    </FilaAviso>
  );
}

const Centrado = styled.View`
  align-items: center;
  gap: 8px;
  padding: 8px 0;
`;

const TextoTenue = styled.Text`
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colores.textoTenue};
`;

const BotonTexto = styled.TouchableOpacity`
  padding: 6px 12px;
`;

const TextoBoton = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.colores.primario};
`;

const Lugar = styled.Text`
  margin-bottom: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colores.textoSecundario};
`;

const Principal = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Textos = styled.View`
  margin-left: 14px;
`;

const Estado = styled.Text`
  font-size: 17px;
  font-weight: bold;
  color: ${({ theme }) => theme.colores.texto};
`;

const Temperaturas = styled.Text`
  margin-top: 2px;
  font-size: 15px;
  color: ${({ theme }) => theme.colores.texto};
`;

const Detalles = styled.View`
  flex-direction: row;
  gap: 18px;
  margin: 12px 0 8px 0;
`;

const Dato = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const TextoDato = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colores.textoSecundario};
`;

const Consejo = styled.Text`
  margin-top: 4px;
  font-size: 14px;
  color: ${({ theme }) => theme.colores.texto};
`;

const Fuente = styled.Text`
  margin-top: 10px;
  font-size: 11px;
  color: ${({ theme }) => theme.colores.textoTenue};
`;

const FilaAviso = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
`;

const TextoAviso = styled.Text`
  flex: 1;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colores.textoSecundario};
`;
