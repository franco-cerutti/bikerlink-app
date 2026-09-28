// src/store/rodadasStore.ts
// Estado global con Zustand: la lista de rodadas vive acá y no dentro de una pantalla.
// Así el listado, el formulario y el detalle leen y modifican los MISMOS datos
// sin tener que pasarlos por props de pantalla en pantalla (prop drilling).
import { create } from 'zustand';

import { RODADAS_INICIALES } from '../data/mockData';
import { Rodada } from '../types/rodada';

interface RodadasState {
  rodadas: Rodada[];
  agregarRodada: (nueva: Rodada) => void;
}

export const useRodadasStore = create<RodadasState>((set) => ({
  // Estado inicial
  rodadas: RODADAS_INICIALES,

  // Acción: set() recibe el estado actual y devuelve lo que cambia.
  // Creamos un array NUEVO (spread) en lugar de modificar el existente (inmutabilidad).
  agregarRodada: (nueva) => set((state) => ({ rodadas: [nueva, ...state.rodadas] })),
}));
