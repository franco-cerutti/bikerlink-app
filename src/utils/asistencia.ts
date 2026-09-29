// src/utils/asistencia.ts
// Reglas de la Feature 3 (gestión de asistencia), como funciones puras.
// Las usan la tarjeta del listado, la pantalla de detalle y el store.
import { Rodada } from '../types/rodada';

/** ¿El usuario ya confirmó que va? */
export function estaConfirmado(rodada: Rodada, usuarioId: string): boolean {
  return rodada.asistentes.some((asistente) => asistente.id === usuarioId);
}

/** ¿El usuario es quien organiza la rodada? */
export function esOrganizador(rodada: Rodada, usuarioId: string): boolean {
  return rodada.organizadorId === usuarioId;
}

/** Lugares libres. Devuelve null si la rodada no tiene cupo máximo. */
export function lugaresDisponibles(rodada: Rodada): number | null {
  if (rodada.cupoMaximo === null) return null;
  return Math.max(rodada.cupoMaximo - rodada.asistentes.length, 0);
}

/** ¿Se llenó el cupo? (Si no hay cupo máximo, nunca se llena.) */
export function cupoCompleto(rodada: Rodada): boolean {
  return lugaresDisponibles(rodada) === 0;
}

/** Texto corto para mostrar la asistencia: '5 confirmados' o '4 de 6 lugares'. */
export function resumenAsistencia(rodada: Rodada): string {
  const cantidad = rodada.asistentes.length;
  if (rodada.cupoMaximo === null) {
    return `${cantidad} ${cantidad === 1 ? 'confirmado' : 'confirmados'}`;
  }
  return `${cantidad} de ${rodada.cupoMaximo} lugares`;
}

/** Iniciales para el "avatar" de cada asistente: 'Carla Benítez' -> 'CB'. */
export function iniciales(nombre: string): string {
  return nombre
    .split(' ')
    .filter((parte) => parte.length > 0)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join('');
}
