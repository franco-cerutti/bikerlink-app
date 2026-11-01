// src/store/checklistStore.ts
// Qué ítems del check-list tildó el usuario en cada rodada.
// Es un store aparte del de rodadas porque es información PERSONAL del usuario
// (cada participante prepara su propia moto), no de la rodada.
//
// persist(...) guarda el estado en AsyncStorage cada vez que cambia y lo recupera
// al abrir la app: si cerrás BikerLink, los tildes siguen ahí.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { almacenamientoLocal } from './almacenamiento';

interface ChecklistState {
  // Clave: id de la rodada. Valor: ids de los ítems tildados. Ej: { '1': ['casco', 'nafta'] }
  tildados: Record<string, string[]>;
  alternarItem: (rodadaId: string, itemId: string) => void;
  reiniciarChecklist: (rodadaId: string) => void;
  borrarTodo: () => void;
}

export const useChecklistStore = create<ChecklistState>()(
  persist(
    (set) => ({
      tildados: {},

      // Si el ítem estaba tildado lo saca, si no lo agrega. Siempre con objetos y arrays NUEVOS.
      alternarItem: (rodadaId, itemId) =>
        set((state) => {
          const actuales = state.tildados[rodadaId] ?? [];
          const nuevos = actuales.includes(itemId)
            ? actuales.filter((id) => id !== itemId)
            : [...actuales, itemId];
          return { tildados: { ...state.tildados, [rodadaId]: nuevos } };
        }),

      reiniciarChecklist: (rodadaId) =>
        set((state) => ({ tildados: { ...state.tildados, [rodadaId]: [] } })),

      borrarTodo: () => set({ tildados: {} }),
    }),
    {
      name: 'bikerlink-checklist', // clave con la que se guarda en AsyncStorage
      storage: almacenamientoLocal,
    },
  ),
);
