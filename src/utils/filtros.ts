// src/utils/filtros.ts
// Lógica de búsqueda y filtros de la Feature 2.
// Está separada de la pantalla: recibe la lista y los criterios, y devuelve la lista filtrada.
import { Rodada } from '../types/rodada';
import { hoyISO, sumarDias } from './formato';

// ---------- Opciones de filtro ----------
// Cada opción tiene un id (lo que guardamos en el estado) y una etiqueta (lo que ve el usuario).

export const FILTROS_FECHA = [
  { id: 'todas', etiqueta: 'Cualquier fecha', dias: null },
  { id: '7', etiqueta: 'Próximos 7 días', dias: 7 },
  { id: '30', etiqueta: 'Próximos 30 días', dias: 30 },
  { id: '90', etiqueta: 'Próximos 3 meses', dias: 90 },
] as const;

export const FILTROS_DISTANCIA = [
  { id: 'todas', etiqueta: 'Cualquier distancia', min: null, max: null },
  { id: 'corta', etiqueta: 'Hasta 150 km', min: 0, max: 150 },
  { id: 'media', etiqueta: '151 a 300 km', min: 151, max: 300 },
  { id: 'larga', etiqueta: 'Más de 300 km', min: 301, max: null },
] as const;

// Tipos derivados: solo aceptan los ids definidos arriba.
export type FiltroFecha = (typeof FILTROS_FECHA)[number]['id'];
export type FiltroDistancia = (typeof FILTROS_DISTANCIA)[number]['id'];

export interface CriteriosBusqueda {
  texto: string;
  tipo: string; // 'Todas' o un TipoSalida
  fecha: FiltroFecha;
  distancia: FiltroDistancia;
}

export const CRITERIOS_INICIALES: CriteriosBusqueda = {
  texto: '',
  tipo: 'Todas',
  fecha: 'todas',
  distancia: 'todas',
};

// ---------- Funciones ----------

/** Pasa a minúsculas y saca acentos, para que "condor" encuentre "Cóndor". */
export function normalizarTexto(texto: string): string {
  const sinAcento: Record<string, string> = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u' };
  return texto
    .toLowerCase()
    .trim()
    .replace(/[áéíóúü]/g, (letra) => sinAcento[letra]);
}

/** Cuántos filtros (sin contar el tipo ni el texto) están activos. Sirve para el badge del botón. */
export function contarFiltrosAvanzados(criterios: CriteriosBusqueda): number {
  let cantidad = 0;
  if (criterios.fecha !== 'todas') cantidad++;
  if (criterios.distancia !== 'todas') cantidad++;
  return cantidad;
}

/** ¿Hay algún criterio distinto del inicial? */
export function hayCriteriosActivos(criterios: CriteriosBusqueda): boolean {
  return (
    criterios.texto.trim() !== '' || criterios.tipo !== 'Todas' || contarFiltrosAvanzados(criterios) > 0
  );
}

/**
 * Aplica todos los criterios a la vez (una rodada tiene que cumplir TODOS para aparecer)
 * y devuelve el resultado ordenado por fecha y hora.
 */
export function filtrarRodadas(rodadas: Rodada[], criterios: CriteriosBusqueda): Rodada[] {
  const texto = normalizarTexto(criterios.texto);
  const hoy = hoyISO();

  const opcionFecha = FILTROS_FECHA.find((f) => f.id === criterios.fecha)!;
  const opcionDistancia = FILTROS_DISTANCIA.find((d) => d.id === criterios.distancia)!;

  return rodadas
    .filter((rodada) => {
      // 1) Búsqueda por texto: título, destino o punto de encuentro (zona de partida).
      if (texto) {
        const dondeBuscar = normalizarTexto(
          `${rodada.titulo} ${rodada.destino} ${rodada.puntoEncuentro}`,
        );
        if (!dondeBuscar.includes(texto)) return false;
      }

      // 2) Tipo de salida
      if (criterios.tipo !== 'Todas' && rodada.tipo !== criterios.tipo) return false;

      // 3) Fecha: entre hoy y hoy + N días. Las fechas 'AAAA-MM-DD' se comparan como texto.
      if (opcionFecha.dias !== null) {
        const limite = sumarDias(hoy, opcionFecha.dias);
        if (rodada.fecha < hoy || rodada.fecha > limite) return false;
      }

      // 4) Distancia: si la rodada no tiene distancia cargada, no entra en ningún rango.
      if (opcionDistancia.min !== null) {
        if (rodada.distanciaKm === null) return false;
        if (rodada.distanciaKm < opcionDistancia.min) return false;
        if (opcionDistancia.max !== null && rodada.distanciaKm > opcionDistancia.max) return false;
      }

      return true;
    })
    .sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`));
}
