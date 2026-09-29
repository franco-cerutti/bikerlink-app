// src/utils/formato.ts
// Funciones "puras": reciben datos y devuelven un resultado, sin tocar la pantalla.
// Separarlas de los componentes las hace fáciles de reutilizar y de probar.

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/**
 * Convierte lo que escribe el usuario ('DD/MM/AAAA') al formato interno ('AAAA-MM-DD').
 * Devuelve null si el texto no es una fecha real (ej: 31/02/2026).
 */
export function parsearFecha(texto: string): string | null {
  const coincidencia = texto.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!coincidencia) return null;

  const dia = Number(coincidencia[1]);
  const mes = Number(coincidencia[2]);
  const anio = Number(coincidencia[3]);

  // new Date(anio, mes - 1, dia) "corrige" fechas inválidas (31/02 pasa a 03/03).
  // Si al volver a leerla los valores cambiaron, la fecha no existía.
  const fecha = new Date(anio, mes - 1, dia);
  if (fecha.getFullYear() !== anio || fecha.getMonth() !== mes - 1 || fecha.getDate() !== dia) {
    return null;
  }

  return `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

/** Valida una hora en formato 24 hs 'HH:MM' y la normaliza (ej: '8:30' -> '08:30'). */
export function parsearHora(texto: string): string | null {
  const coincidencia = texto.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!coincidencia) return null;

  const horas = Number(coincidencia[1]);
  const minutos = Number(coincidencia[2]);
  if (horas > 23 || minutos > 59) return null;

  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
}

/** Fecha de hoy en formato 'AAAA-MM-DD', para comparar con las fechas guardadas. */
export function hoyISO(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

/** Suma (o resta, con n negativo) días a una fecha 'AAAA-MM-DD'. Ej: ('2026-09-29', 5) -> '2026-10-04' */
export function sumarDias(fechaISO: string, dias: number): string {
  const [anio, mes, dia] = fechaISO.split('-').map(Number);
  // new Date se encarga de pasar de mes o de año si hace falta (30/09 + 5 = 05/10).
  const fecha = new Date(anio, mes - 1, dia + dias);
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mm}-${dd}`;
}

/** '2026-10-10' + '08:30' -> 'Sáb 10/10/2026 · 08:30 hs' */
export function formatearFechaHora(fechaISO: string, hora: string): string {
  const [anio, mes, dia] = fechaISO.split('-').map(Number);
  const diaSemana = DIAS[new Date(anio, mes - 1, dia).getDay()];
  const dd = String(dia).padStart(2, '0');
  const mm = String(mes).padStart(2, '0');
  return `${diaSemana} ${dd}/${mm}/${anio} · ${hora} hs`;
}

/** 140 -> '140 km' | null -> 'A definir' */
export function formatearDistancia(distanciaKm: number | null): string {
  return distanciaKm === null ? 'A definir' : `${distanciaKm} km`;
}
