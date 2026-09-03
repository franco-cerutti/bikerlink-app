// src/data/mockData.js

export const TIPOS_SALIDA = [
  'Todas',
  'Vuelta corta',
  'Fin de semana',
  'Motoencuentro',
  'Trail / Off-Road',
];

export const RODADAS_INICIALES = [
  {
    id: '1',
    titulo: 'Café y Curvas en Altas Cumbres',
    tipo: 'Vuelta corta',
    destino: 'El Cóndor',
    fecha: 'Sábado 10, 08:30 hs',
    distancia: '140 km',
    puntosEncuentro: ['YPF Carlos Paz', 'Parador El Cóndor'],
    asistentes: 5,
    descripcion: 'Salida tranquila por la mañana para tomar café y volver a almorzar a casa.',
  },
  {
    id: '2',
    titulo: 'Caravana al Motoencuentro Anual',
    tipo: 'Motoencuentro',
    destino: 'Diamante, Entre Ríos',
    fecha: 'Viernes 20, 06:00 hs',
    distancia: '450 km',
    puntosEncuentro: ['Estación YPF Rosario', 'Predio Motoencuentro'],
    asistentes: 12,
    descripcion: 'Rodada masiva en grupo hacia el predio. Ritmo crucero 100-110 km/h.',
  },
  {
    id: '3',
    titulo: 'Travesía Sierras Chicas y Tierra',
    tipo: 'Trail / Off-Road',
    destino: 'La Cumbrecita',
    fecha: 'Domingo 15, 09:00 hs',
    distancia: '210 km',
    puntosEncuentro: ['Servicial Alta Gracia', 'La Cumbrecita'],
    asistentes: 4,
    descripcion: 'Ruta mixta con tramos de ripio. Obligatorio cubiertas mixtas y cubrecarter.',
  },
  {
    id: '4',
    titulo: 'Finde en los Reartes con Carpa',
    tipo: 'Fin de semana',
    destino: 'Camping Los Reartes',
    fecha: 'Sábado 27, 07:00 hs',
    distancia: '180 km',
    puntosEncuentro: ['Peaje Ruta 5', 'Camping Los Reartes'],
    asistentes: 8,
    descripcion: 'Viaje de 2 días. Llevamos carpa, bolsa de dormir y equipo para asado.',
  },
];