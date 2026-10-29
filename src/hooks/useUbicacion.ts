// src/hooks/useUbicacion.ts
// Coordenadas del destino. La comparten el clima y las fotos.
// Como las dos usan la MISMA queryKey, TanStack hace la petición una sola vez
// y el segundo componente toma el dato de la caché.
import { useQuery } from '@tanstack/react-query';

import { buscarUbicacion } from '../api/clima';

export function useUbicacion(destino: string) {
  return useQuery({
    queryKey: ['ubicacion', destino],
    queryFn: () => buscarUbicacion(destino),
    enabled: destino.trim() !== '', // sin destino no hay nada que buscar
    staleTime: Infinity, // las coordenadas de un lugar no cambian: nunca hace falta volver a pedirlas
  });
}
