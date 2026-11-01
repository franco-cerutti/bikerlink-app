// src/types/checklist.ts
// Un ítem del check-list de preparación (Feature 6).

export const CATEGORIAS_CHECKLIST = ['Moto', 'Equipo', 'Documentación', 'Para este viaje'] as const;
export type CategoriaChecklist = (typeof CATEGORIAS_CHECKLIST)[number];

export interface ItemChecklist {
  id: string;
  texto: string;
  categoria: CategoriaChecklist;
}
