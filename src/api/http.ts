// src/api/http.ts
// Función base para todas las peticiones HTTP de la app.
// Usa fetch, revisa que la respuesta sea correcta y devuelve el JSON ya convertido.
// Si algo falla, LANZA un error: TanStack Query lo atrapa y pone la consulta en estado "error".

// Identificación de la app. Wikimedia RECHAZA (error 403) las peticiones que no dicen
// qué app son y cómo contactar a quien la hizo. Por eso va el link al repositorio.
export const IDENTIFICACION_APP =
  'BikerLink/1.0 (https://github.com/franco-cerutti/bikerlink-app; proyecto educativo)';

// Encabezados que mandamos en TODAS las peticiones (datos e imágenes).
// - User-Agent: lo lee el servidor para saber quién pide. En Android, si no lo ponemos,
//   se manda uno genérico ("okhttp/...") que Wikimedia bloquea.
// - Api-User-Agent: el mismo dato, en el encabezado que Wikimedia recomienda para apps.
export const ENCABEZADOS = {
  'User-Agent': IDENTIFICACION_APP,
  'Api-User-Agent': IDENTIFICACION_APP,
};

export async function obtenerJSON<T>(url: string): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(url, { headers: ENCABEZADOS });
  } catch {
    // fetch solo lanza error cuando NO hay respuesta: sin internet, DNS, etc.
    throw new Error('Sin conexión a internet');
  }

  // fetch NO lanza error con un 404 o un 500: hay que revisar res.ok a mano.
  if (!respuesta.ok) {
    // Se ve en la terminal donde corre "npx expo start": útil para saber qué falló.
    console.warn(`[API] ${respuesta.status} en ${url}`);
    throw new Error(`La API respondió con el código ${respuesta.status}`);
  }

  return (await respuesta.json()) as T;
}

/** Arma una URL con parámetros: ('https://x.com/api', { a: 1 }) -> 'https://x.com/api?a=1' */
export function armarUrl(base: string, parametros: Record<string, string | number>): string {
  const query = Object.entries(parametros)
    .map(([clave, valor]) => `${clave}=${encodeURIComponent(String(valor))}`)
    .join('&');
  return `${base}?${query}`;
}
