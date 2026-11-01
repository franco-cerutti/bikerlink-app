// src/hooks/useChecklist.ts
// Junta todo lo que necesita una pantalla para mostrar el check-list de una rodada:
// los ítems sugeridos según el tipo, cuáles están tildados y el progreso.
// Lo usan el detalle (resumen) y la pantalla del check-list (lista completa).
import { itemsParaTipo } from '../data/checklist';
import { useChecklistStore } from '../store/checklistStore';
import { Rodada } from '../types/rodada';
import { calcularProgreso } from '../utils/checklist';

// Constante fuera del hook: si el selector devolviera un [] nuevo en cada render,
// Zustand pensaría que el dato cambió y volvería a dibujar sin parar.
const SIN_TILDADOS: string[] = [];

export function useChecklist(rodada: Rodada) {
  const tildados = useChecklistStore((state) => state.tildados[rodada.id] ?? SIN_TILDADOS);
  const items = itemsParaTipo(rodada.tipo);
  return { items, tildados, progreso: calcularProgreso(items, tildados) };
}
