// src/hooks/usePronostico.ts
// Pronóstico del clima para el destino y la fecha de una rodada.
// Es una "consulta dependiente": necesita las coordenadas, así que espera a que
// termine useUbicacion. Eso se logra con la opción enabled.
import { useQuery } from '@tanstack/react-query';

import { obtenerPronostico } from '../api/clima';
import { Rodada } from '../types/rodada';
import { disponibilidadPronostico } from '../utils/clima';
import { useUbicacion } from './useUbicacion';

export function usePronostico(rodada: Rodada) {
  const ubicacion = useUbicacion(rodada.destino);
  const disponibilidad = disponibilidadPronostico(rodada.fecha);

  const pronostico = useQuery({
    // Si cambia cualquier parte de la key (otro lugar u otra fecha), TanStack pide el dato de nuevo.
    queryKey: ['pronostico', ubicacion.data?.latitud, ubicacion.data?.longitud, rodada.fecha],
    queryFn: () => obtenerPronostico(ubicacion.data!, rodada.fecha),
    // Solo se ejecuta si encontramos el lugar y la fecha está dentro de los 16 días del pronóstico.
    enabled: !!ubicacion.data && disponibilidad.estado === 'disponible',
    staleTime: 1000 * 60 * 30, // 30 minutos: después de eso, al volver a la pantalla lo actualiza
  });

  return { ubicacion, pronostico, disponibilidad };
}
