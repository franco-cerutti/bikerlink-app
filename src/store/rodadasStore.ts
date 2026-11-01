// src/store/rodadasStore.ts
// Estado global con Zustand: la lista de rodadas vive acá y no dentro de una pantalla.
// Así el listado, el formulario y el detalle leen y modifican los MISMOS datos
// sin tener que pasarlos por props de pantalla en pantalla (prop drilling).
//
// persist(...) guarda las rodadas en AsyncStorage cada vez que cambian y las recupera
// al abrir la app. Así las rodadas creadas y las asistencias no se pierden al cerrarla.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { RODADAS_INICIALES } from '../data/mockData';
import { USUARIO_ACTUAL } from '../data/usuario';
import { Rodada } from '../types/rodada';
import { cupoCompleto, esOrganizador, estaConfirmado } from '../utils/asistencia';
import { almacenamientoLocal } from './almacenamiento';

interface RodadasState {
  rodadas: Rodada[];
  agregarRodada: (nueva: Rodada) => void;
  confirmarAsistencia: (rodadaId: string) => void;
  cancelarAsistencia: (rodadaId: string) => void;
  restablecerDatos: () => void;
}

// create<T>()(...) con doble paréntesis: es la forma que pide TypeScript al usar middlewares.
export const useRodadasStore = create<RodadasState>()(
  persist(
    (set) => ({
      // Estado inicial
      rodadas: RODADAS_INICIALES,

      // Acción: set() recibe el estado actual y devuelve lo que cambia.
      // Creamos un array NUEVO (spread) en lugar de modificar el existente (inmutabilidad).
      agregarRodada: (nueva) => set((state) => ({ rodadas: [nueva, ...state.rodadas] })),

      // Agrega al usuario actual a la lista de asistentes de UNA rodada.
      // .map() recorre todas: la que coincide se reemplaza por una copia modificada,
      // el resto se devuelve igual. Nunca se hace rodada.asistentes.push(...).
      confirmarAsistencia: (rodadaId) =>
        set((state) => ({
          rodadas: state.rodadas.map((rodada) => {
            if (rodada.id !== rodadaId) return rodada;
            // Reglas: no duplicar al usuario y no superar el cupo.
            if (estaConfirmado(rodada, USUARIO_ACTUAL.id) || cupoCompleto(rodada)) return rodada;
            return { ...rodada, asistentes: [...rodada.asistentes, USUARIO_ACTUAL] };
          }),
        })),

      // Saca al usuario actual de la lista. .filter() también devuelve un array nuevo.
      cancelarAsistencia: (rodadaId) =>
        set((state) => ({
          rodadas: state.rodadas.map((rodada) => {
            if (rodada.id !== rodadaId) return rodada;
            // Regla: el organizador no puede darse de baja de su propia rodada.
            if (esOrganizador(rodada, USUARIO_ACTUAL.id)) return rodada;
            return {
              ...rodada,
              asistentes: rodada.asistentes.filter((asistente) => asistente.id !== USUARIO_ACTUAL.id),
            };
          }),
        })),

      // Vuelve a los datos de ejemplo (útil para probar la app desde cero).
      restablecerDatos: () => set({ rodadas: RODADAS_INICIALES }),
    }),
    {
      name: 'bikerlink-rodadas', // clave con la que se guarda en AsyncStorage
      storage: almacenamientoLocal,
      // Guardamos SOLO los datos. Las acciones (funciones) no se pueden pasar a JSON.
      partialize: (state) => ({ rodadas: state.rodadas }),
      // Si en el futuro cambia la forma de Rodada, subimos version y migramos lo guardado.
      version: 1,
    },
  ),
);
