// src/types/rodada.ts
// Define la "forma" que tiene una rodada en toda la app.
// Si algún archivo intenta crear una rodada sin un campo obligatorio,
// o con un tipo de dato incorrecto, TypeScript lo marca como error.

// Lista única de tipos de salida. Se usa en los filtros y en el formulario.
// "as const" hace que TypeScript conozca los valores exactos del arreglo.
export const TIPOS_SALIDA = [
  'Vuelta corta',
  'Fin de semana',
  'Motoencuentro',
  'Trail / Off-Road',
] as const;

// Tipo derivado del arreglo anterior: solo acepta uno de esos 4 textos.
export type TipoSalida = (typeof TIPOS_SALIDA)[number];

// Una persona que confirmó que va a la rodada.
export interface Asistente {
  id: string;
  nombre: string;
  moto?: string; // opcional: marca y modelo de la moto
}

export interface Rodada {
  id: string;
  titulo: string;
  tipo: TipoSalida;
  puntoEncuentro: string;
  destino: string;
  fecha: string; // Formato 'AAAA-MM-DD' (ej: '2026-10-10'). Permite ordenar y filtrar.
  hora: string; // Formato 'HH:MM' en 24 hs (ej: '08:30').
  distanciaKm: number | null; // null = distancia todavía no definida.
  organizadorId: string; // id del Asistente que creó la rodada
  asistentes: Asistente[]; // lista de confirmados (incluye al organizador)
  cupoMaximo: number | null; // null = sin límite de lugares
  descripcion: string;
}
