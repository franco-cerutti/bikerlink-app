// src/utils/clima.ts
// Funciones puras para interpretar el pronóstico: qué ícono mostrar, qué texto
// y qué recomendaciones darle a quien va a manejar la moto.
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

import { PronosticoDia } from '../api/clima';
import { diasEntre, hoyISO, sumarDias } from './formato';

type NombreIcono = ComponentProps<typeof Ionicons>['name'];

// Open-Meteo da pronóstico hasta 16 días hacia adelante (hoy + 15).
export const MAX_DIAS_PRONOSTICO = 15;

export type DisponibilidadPronostico =
  | { estado: 'disponible' }
  | { estado: 'muyLejos'; disponibleDesde: string } // fecha desde la que se va a poder ver
  | { estado: 'pasada' };

/** ¿Se puede pedir el pronóstico para esta fecha? */
export function disponibilidadPronostico(fecha: string): DisponibilidadPronostico {
  const dias = diasEntre(hoyISO(), fecha);
  if (dias < 0) return { estado: 'pasada' };
  if (dias > MAX_DIAS_PRONOSTICO) {
    return { estado: 'muyLejos', disponibleDesde: sumarDias(fecha, -MAX_DIAS_PRONOSTICO) };
  }
  return { estado: 'disponible' };
}

/** Código WMO del clima -> texto e ícono. https://open-meteo.com/en/docs (WMO Weather codes) */
export function describirClima(codigo: number): { texto: string; icono: NombreIcono } {
  if (codigo === 0) return { texto: 'Despejado', icono: 'sunny-outline' };
  if (codigo <= 2) return { texto: 'Parcialmente nublado', icono: 'partly-sunny-outline' };
  if (codigo === 3) return { texto: 'Nublado', icono: 'cloudy-outline' };
  if (codigo === 45 || codigo === 48) return { texto: 'Niebla', icono: 'cloudy-outline' };
  if (codigo >= 51 && codigo <= 57) return { texto: 'Llovizna', icono: 'rainy-outline' };
  if ((codigo >= 61 && codigo <= 67) || (codigo >= 80 && codigo <= 82)) {
    return { texto: 'Lluvia', icono: 'rainy-outline' };
  }
  if ((codigo >= 71 && codigo <= 77) || codigo === 85 || codigo === 86) {
    return { texto: 'Nieve', icono: 'snow-outline' };
  }
  if (codigo >= 95) return { texto: 'Tormenta', icono: 'thunderstorm-outline' };
  return { texto: 'Sin datos', icono: 'cloudy-outline' };
}

/** Recomendaciones para la rodada según el pronóstico. */
export function consejosParaRodar(pronostico: PronosticoDia): string[] {
  const consejos: string[] = [];
  if (pronostico.codigoClima >= 95) consejos.push('Hay tormenta pronosticada: evaluá postergar la salida.');
  if (pronostico.probabilidadLluvia >= 50) consejos.push('Llevá equipo de lluvia.');
  if (pronostico.vientoMaximo >= 40) consejos.push('Viento fuerte: cuidado en zonas abiertas y puentes.');
  if (pronostico.minima <= 5) consejos.push('Va a hacer frío: llevá guantes y cuello térmico.');
  if (pronostico.maxima >= 32) consejos.push('Mucho calor: hidratate en cada parada.');
  if (consejos.length === 0) consejos.push('Buen día para rodar.');
  return consejos;
}
