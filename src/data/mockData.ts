// src/data/mockData.ts
// Datos de prueba para arrancar la app con contenido.
// Más adelante estos datos vendrán de almacenamiento local o de una API.
import { Rodada } from '../types/rodada';

export const RODADAS_INICIALES: Rodada[] = [
  {
    id: '1',
    titulo: 'Café y Curvas en Altas Cumbres',
    tipo: 'Vuelta corta',
    puntoEncuentro: 'YPF Carlos Paz',
    destino: 'Parador El Cóndor',
    fecha: '2026-10-10',
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
    fecha: '2026-11-20',
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
    fecha: '2026-11-15',
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
    fecha: '2026-10-24',
    hora: '07:00',
    distanciaKm: 180,
    asistentes: 8,
    descripcion: 'Viaje de 2 días. Llevamos carpa, bolsa de dormir y equipo para asado.',
  },
];
