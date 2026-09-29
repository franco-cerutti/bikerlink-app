// src/data/mockData.ts
// Datos de prueba para arrancar la app con contenido.
// Las fechas se calculan a partir de HOY, así los datos de ejemplo nunca quedan
// en el pasado y los filtros por fecha siempre tienen algo para mostrar.
import { Asistente, Rodada } from '../types/rodada';
import { hoyISO, sumarDias } from '../utils/formato';
import { USUARIO_ACTUAL } from './usuario';

const hoy = hoyISO();

// Moteros de ejemplo (personas ficticias).
const MOTEROS: Asistente[] = [
  { id: 'm1', nombre: 'Lucas Ferreyra', moto: 'Honda CB 190R' },
  { id: 'm2', nombre: 'Carla Benítez', moto: 'Yamaha XTZ 250' },
  { id: 'm3', nombre: 'Diego Molina', moto: 'Kawasaki Versys 650' },
  { id: 'm4', nombre: 'Paula Sosa', moto: 'Honda Tornado 250' },
  { id: 'm5', nombre: 'Martín Quiroga', moto: 'BMW G 310 GS' },
  { id: 'm6', nombre: 'Sofía Luna', moto: 'Royal Enfield Himalayan' },
  { id: 'm7', nombre: 'Nicolás Paz', moto: 'Bajaj Dominar 400' },
  { id: 'm8', nombre: 'Julieta Ríos', moto: 'Benelli TRK 502' },
  { id: 'm9', nombre: 'Tomás Aguirre', moto: 'Honda XR 150L' },
  { id: 'm10', nombre: 'Valentina Oviedo', moto: 'Suzuki V-Strom 650' },
  { id: 'm11', nombre: 'Gonzalo Herrera', moto: 'Kawasaki Z400' },
  { id: 'm12', nombre: 'Ana Castro', moto: 'Motomel Skua 250' },
];

// Devuelve los moteros cuyos números se piden, en ese orden. El primero es el organizador.
function moteros(...numeros: number[]): Asistente[] {
  return numeros.map((n) => MOTEROS[n - 1]);
}

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
    organizadorId: 'm1',
    asistentes: moteros(1, 4, 7, 9, 12),
    cupoMaximo: null,
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
    organizadorId: 'm3',
    asistentes: moteros(3, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12),
    cupoMaximo: null,
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
    organizadorId: 'm2',
    asistentes: moteros(2, 5, 6, 9),
    cupoMaximo: 5, // queda 1 lugar
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
    organizadorId: 'm8',
    // El usuario actual ya está anotado en esta, para ver cómo se ve "Cancelar asistencia".
    asistentes: [...moteros(8, 3, 4, 10, 11, 1, 6), USUARIO_ACTUAL],
    cupoMaximo: 10,
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
    organizadorId: 'm11',
    asistentes: moteros(11, 7, 12, 2, 4, 1),
    cupoMaximo: 6, // cupo completo
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
    organizadorId: 'm5',
    asistentes: moteros(5, 10, 3),
    cupoMaximo: null,
    descripcion: 'Recorrido a confirmar. Dormimos una noche en Mina Clavero.',
  },
];
