// src/utils/checklist.ts
// Funciones puras del check-list: progreso y agrupación por categoría.
import { CATEGORIAS_CHECKLIST, CategoriaChecklist, ItemChecklist } from '../types/checklist';

export interface Progreso {
  hechos: number;
  total: number;
  porcentaje: number; // 0 a 100
}

/** Cuántos ítems están tildados. Solo cuenta los que siguen en la lista. */
export function calcularProgreso(items: ItemChecklist[], tildados: string[]): Progreso {
  const hechos = items.filter((item) => tildados.includes(item.id)).length;
  const total = items.length;
  return { hechos, total, porcentaje: total === 0 ? 0 : Math.round((hechos / total) * 100) };
}

// Formato que pide SectionList: un arreglo de secciones, cada una con title y data.
export interface SeccionChecklist {
  title: CategoriaChecklist;
  data: ItemChecklist[];
}

/** Agrupa los ítems por categoría, en el orden de CATEGORIAS_CHECKLIST. */
export function agruparPorCategoria(items: ItemChecklist[]): SeccionChecklist[] {
  return CATEGORIAS_CHECKLIST.map((categoria) => ({
    title: categoria,
    data: items.filter((item) => item.categoria === categoria),
  })).filter((seccion) => seccion.data.length > 0); // sin secciones vacías
}
