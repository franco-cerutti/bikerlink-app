// src/data/checklist.ts
// Ítems sugeridos del check-list. Hay una base que sirve para cualquier salida
// y ítems extra que dependen del tipo de rodada.
import { ItemChecklist } from '../types/checklist';
import { TipoSalida } from '../types/rodada';

// Para TODAS las salidas.
const ITEMS_BASE: ItemChecklist[] = [
  { id: 'cubiertas', texto: 'Presión y estado de las cubiertas', categoria: 'Moto' },
  { id: 'aceite', texto: 'Nivel de aceite', categoria: 'Moto' },
  { id: 'luces', texto: 'Luces, guiños y luz de freno', categoria: 'Moto' },
  { id: 'cadena', texto: 'Cadena tensada y lubricada', categoria: 'Moto' },
  { id: 'nafta', texto: 'Tanque lleno', categoria: 'Moto' },
  { id: 'casco', texto: 'Casco', categoria: 'Equipo' },
  { id: 'guantes', texto: 'Guantes', categoria: 'Equipo' },
  { id: 'campera', texto: 'Campera con protecciones', categoria: 'Equipo' },
  { id: 'licencia', texto: 'Licencia de conducir', categoria: 'Documentación' },
  { id: 'cedula', texto: 'Cédula de la moto', categoria: 'Documentación' },
  { id: 'seguro', texto: 'Comprobante del seguro', categoria: 'Documentación' },
];

// Extras según el tipo de salida. Record<TipoSalida, ...> obliga a definir los 4 tipos:
// si agregamos un tipo nuevo en types/rodada.ts, TypeScript avisa que falta acá.
const ITEMS_POR_TIPO: Record<TipoSalida, ItemChecklist[]> = {
  'Vuelta corta': [
    { id: 'lluvia', texto: 'Equipo de lluvia', categoria: 'Para este viaje' },
    { id: 'agua', texto: 'Agua', categoria: 'Para este viaje' },
  ],
  'Fin de semana': [
    { id: 'lluvia', texto: 'Equipo de lluvia', categoria: 'Para este viaje' },
    { id: 'ropa', texto: 'Ropa para 2 días', categoria: 'Para este viaje' },
    { id: 'pulpo', texto: 'Pulpos o red para el equipaje', categoria: 'Para este viaje' },
    { id: 'herramientas', texto: 'Kit de herramientas', categoria: 'Para este viaje' },
    { id: 'reserva', texto: 'Reserva de alojamiento', categoria: 'Para este viaje' },
  ],
  Motoencuentro: [
    { id: 'carpa', texto: 'Carpa y bolsa de dormir', categoria: 'Para este viaje' },
    { id: 'entrada', texto: 'Entrada o inscripción al encuentro', categoria: 'Para este viaje' },
    { id: 'linterna', texto: 'Linterna', categoria: 'Para este viaje' },
    { id: 'herramientas', texto: 'Kit de herramientas', categoria: 'Para este viaje' },
  ],
  'Trail / Off-Road': [
    { id: 'parches', texto: 'Kit de parches e inflador', categoria: 'Para este viaje' },
    { id: 'botas', texto: 'Botas de enduro', categoria: 'Para este viaje' },
    { id: 'botiquin', texto: 'Botiquín', categoria: 'Para este viaje' },
    { id: 'herramientas', texto: 'Kit de herramientas', categoria: 'Para este viaje' },
    { id: 'agua', texto: 'Agua (al menos 2 litros)', categoria: 'Para este viaje' },
  ],
};

/** Lista completa de ítems sugeridos para un tipo de salida. */
export function itemsParaTipo(tipo: TipoSalida): ItemChecklist[] {
  return [...ITEMS_BASE, ...ITEMS_POR_TIPO[tipo]];
}
