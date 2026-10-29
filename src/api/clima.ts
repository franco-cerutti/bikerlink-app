// src/api/clima.ts
// Consultas a Open-Meteo (https://open-meteo.com): API pública y gratuita, sin clave.
//  1) Geocoding: convierte el nombre del destino en coordenadas (latitud y longitud).
//  2) Forecast: devuelve el pronóstico para esas coordenadas y una fecha.
import { normalizarTexto } from '../utils/filtros';
import { armarUrl, obtenerJSON } from './http';

export interface Ubicacion {
  nombre: string;
  provincia: string;
  latitud: number;
  longitud: number;
}

export interface PronosticoDia {
  fecha: string;
  codigoClima: number; // código WMO: 0 = despejado, 61 = lluvia, 95 = tormenta, etc.
  maxima: number; // °C
  minima: number; // °C
  probabilidadLluvia: number; // %
  vientoMaximo: number; // km/h
}

// ---------- Formas de las respuestas de la API (solo los campos que usamos) ----------

interface RespuestaGeocoding {
  results?: {
    name: string;
    admin1?: string; // provincia
    latitude: number;
    longitude: number;
  }[];
}

interface RespuestaPronostico {
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
  };
}

// Palabras que suelen ir antes del nombre del lugar y que la API no reconoce.
const PALABRAS_GENERICAS = /^(camping|parador|dique|predio|estaci[oó]n|hotel|caba[nñ]as|complejo|club)\s+/i;

/**
 * Busca las coordenadas de un destino escrito por el usuario.
 * Acepta 'Mina Clavero', 'Diamante, Entre Ríos' o 'Camping Los Reartes'.
 * Devuelve null si no encuentra el lugar (no es un error: simplemente no existe en la API).
 */
export async function buscarUbicacion(destino: string): Promise<Ubicacion | null> {
  // 'Diamante, Entre Ríos' -> lugar 'Diamante', provincia 'Entre Ríos'
  const [lugar, provincia] = destino.split(',').map((parte) => parte.trim());
  const candidatos = [lugar, lugar.replace(PALABRAS_GENERICAS, '')];

  // Probamos primero el nombre completo y, si no aparece, sin la palabra genérica.
  for (const nombre of new Set(candidatos)) {
    const url = armarUrl('https://geocoding-api.open-meteo.com/v1/search', {
      name: nombre,
      count: 5,
      language: 'es',
      countryCode: 'AR',
    });
    const datos = await obtenerJSON<RespuestaGeocoding>(url);
    const resultados = datos.results ?? [];
    if (resultados.length === 0) continue;

    // Si el usuario escribió la provincia, preferimos el resultado de esa provincia.
    const elegido =
      (provincia &&
        resultados.find((r) => normalizarTexto(r.admin1 ?? '').includes(normalizarTexto(provincia)))) ||
      resultados[0];

    return {
      nombre: elegido.name,
      provincia: elegido.admin1 ?? '',
      latitud: elegido.latitude,
      longitud: elegido.longitude,
    };
  }

  return null;
}

/** Pronóstico de UN día (fecha 'AAAA-MM-DD') en unas coordenadas. */
export async function obtenerPronostico(ubicacion: Ubicacion, fecha: string): Promise<PronosticoDia> {
  const url = armarUrl('https://api.open-meteo.com/v1/forecast', {
    latitude: ubicacion.latitud,
    longitude: ubicacion.longitud,
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max',
    timezone: 'auto',
    start_date: fecha,
    end_date: fecha,
  });
  const { daily } = await obtenerJSON<RespuestaPronostico>(url);

  // La API devuelve arreglos (uno por día). Pedimos un solo día, así que usamos la posición 0.
  return {
    fecha: daily.time[0],
    codigoClima: daily.weather_code[0],
    maxima: Math.round(daily.temperature_2m_max[0]),
    minima: Math.round(daily.temperature_2m_min[0]),
    probabilidadLluvia: daily.precipitation_probability_max[0] ?? 0,
    vientoMaximo: Math.round(daily.wind_speed_10m_max[0]),
  };
}
