// src/data/mockData.ts
// Datos de prueba para arrancar la app con contenido.
// Las fechas se calculan a partir de HOY, así los datos de ejemplo nunca quedan
// en el pasado y los filtros por fecha siempre tienen algo para mostrar.
import { Rodada } from '../types/rodada';
import { hoyISO, sumarDias } from '../utils/formato';

const hoy = hoyISO();

export const RODADAS_INICIALES: Rodada[] = [
  {
    id: '1',
    titulo: 'Café y Curvas en Altas Cumbres',
    tipo: 'Vuelta corta',
    puntoEncuentro: 'YPF Carlos Paz',
    destino: 'Parador El Cóndor',
    fecha: sumarDias(hoy, 4),
    hora: '08:30',
    distanciaKm: 140,
    asistentes: 5,
    descripcion: 'Salida tranquila por la mañana para tomar café y volver a almorzar a casa.',
  },
  {
    id: '2',
    titulo: 'Caravana al Motoencuentro Anual',
    tipo: 'Motoencuentro',
    puntoEncuentro: 'Estación YPF Rosario',
    destino: 'Diamante, Entre Ríos',
    fecha: sumarDias(hoy, 52),
    hora: '06:00',
    distanciaKm: 450,
    asistentes: 12,
    descripcion: 'Rodada masiva en grupo hacia el predio. Ritmo crucero 100-110 km/h.',
  },
  {
    id: '3',
    titulo: 'Travesía Sierras Chicas y Tierra',
    tipo: 'Trail / Off-Road',
    puntoEncuentro: 'Servicentro Alta Gracia',
    destino: 'La Cumbrecita',
    fecha: sumarDias(hoy, 18),
    hora: '09:00',
    distanciaKm: 210,
    asistentes: 4,
    descripcion: 'Ruta mixta con tramos de ripio. Obligatorio cubiertas mixtas y cubrecárter.',
  },
  {
    id: '4',
    titulo: 'Finde en Los Reartes con Carpa',
    tipo: 'Fin de semana',
    puntoEncuentro: 'Peaje Ruta 5',
    destino: 'Camping Los Reartes',
    fecha: sumarDias(hoy, 25),
    hora: '07:00',
    distanciaKm: 180,
    asistentes: 8,
    descripcion: 'Viaje de 2 días. Llevamos carpa, bolsa de dormir y equipo para asado.',
  },
  {
    id: '5',
    titulo: 'Atardecer en el Dique Los Molinos',
    tipo: 'Vuelta corta',
    puntoEncuentro: 'Shell Av. Vélez Sarsfield, Córdoba',
    destino: 'Dique Los Molinos',
    fecha: sumarDias(hoy, 9),
    hora: '17:00',
    distanciaKm: 95,
    asistentes: 6,
    descripcion: 'Vuelta corta para ver el atardecer en el dique. Llevar abrigo para la vuelta.',
  },
  {
    id: '6',
    titulo: 'Cruce a las Altas Cumbres por Mina Clavero',
    tipo: 'Fin de semana',
    puntoEncuentro: 'YPF Carlos Paz',
    destino: 'Mina Clavero',
    fecha: sumarDias(hoy, 70),
    hora: '08:00',
    distanciaKm: null,
    asistentes: 3,
    descripcion: 'Recorrido a confirmar. Dormimos una noche en Mina Clavero.',
  },
];
