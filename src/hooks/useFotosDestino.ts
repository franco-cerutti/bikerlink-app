// src/hooks/useFotosDestino.ts
// Fotos del destino con scroll infinito (useInfiniteQuery).
// Cada "página" es una llamada a la API con 12 fotos. Las páginas se van acumulando
// en data.pages a medida que el usuario llega al final de la lista.
import { useInfiniteQuery } from '@tanstack/react-query';

import { buscarFotos, ParametroPagina } from '../api/fotos';
import { useUbicacion } from './useUbicacion';

export function useFotosDestino(destino: string) {
  const ubicacion = useUbicacion(destino);

  // Con qué textos buscar, del más preciso al más general.
  // Ej: 'Nono Córdoba' → 'Nono' → 'Nono' (lo que escribió el usuario, sin comas).
  // Mientras la ubicación se está cargando, todavía no sabemos qué buscar (null).
  let terminos: string[] | null = null;
  if (!ubicacion.isPending || destino.trim() === '') {
    const candidatos = ubicacion.data
      ? [`${ubicacion.data.nombre} ${ubicacion.data.provincia}`.trim(), ubicacion.data.nombre]
      : [];
    candidatos.push(destino.replace(',', '').trim());
    // new Set saca los repetidos; filter saca los vacíos.
    terminos = [...new Set(candidatos)].filter((t) => t !== '');
  }

  const consulta = useInfiniteQuery({
    queryKey: ['fotos', terminos],
    queryFn: ({ pageParam }) => buscarFotos(pageParam),
    // La primera página prueba todos los términos, desde la posición 0.
    initialPageParam: { terminos: terminos ?? [], offset: 0 } as ParametroPagina,
    // Las siguientes usan solo el término que funcionó. undefined = no hay más páginas.
    getNextPageParam: (ultimaPagina): ParametroPagina | undefined =>
      ultimaPagina.siguienteOffset === null
        ? undefined
        : { terminos: [ultimaPagina.termino], offset: ultimaPagina.siguienteOffset },
    enabled: !!terminos && terminos.length > 0,
    staleTime: 1000 * 60 * 60, // 1 hora
  });

  // Juntamos todas las páginas en una sola lista para el FlatList.
  const fotos = consulta.data?.pages.flatMap((pagina) => pagina.fotos) ?? [];

  return {
    ...consulta,
    fotos,
    // "Cargando" incluye el tiempo en que esperamos la ubicación.
    cargando: terminos === null || consulta.isLoading,
  };
}
