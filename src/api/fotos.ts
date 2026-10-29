// src/api/fotos.ts
// Fotos del destino desde Wikimedia Commons (https://commons.wikimedia.org):
// el archivo de imágenes libres de Wikipedia. API pública, sin clave.
// Devuelve las fotos DE A PÁGINAS: cada llamada trae FOTOS_POR_PAGINA y el número
// desde donde seguir (offset). Eso es lo que usa useInfiniteQuery para el scroll infinito.
import { armarUrl, obtenerJSON } from './http';

export const FOTOS_POR_PAGINA = 12;

export interface Foto {
  id: string;
  titulo: string;
  url: string; // miniatura de 330 px de ancho, para mostrar en la app
  pagina: string; // página de la foto en Wikimedia (autor y licencia)
}

export interface PaginaFotos {
  fotos: Foto[];
  termino: string; // el texto con el que se encontraron estas fotos
  siguienteOffset: number | null; // null = no hay más páginas
}

// Lo que necesita cada página: con qué texto(s) buscar y desde qué posición.
export interface ParametroPagina {
  terminos: string[];
  offset: number;
}

interface RespuestaWikimedia {
  continue?: { gsroffset: number };
  query?: {
    pages: {
      pageid: number;
      title: string;
      index: number; // posición en los resultados de la búsqueda
      imageinfo?: { thumburl?: string; descriptionurl: string }[];
    }[];
  };
}

/** 'File:Mina Clavero - río.jpg' -> 'Mina Clavero - río' */
function limpiarTitulo(titulo: string): string {
  return titulo.replace(/^(File|Archivo):/, '').replace(/\.[a-z0-9]+$/i, '');
}

/** Una búsqueda puntual en Wikimedia. */
async function buscarEnWikimedia(texto: string, offset: number): Promise<PaginaFotos> {
  const url = armarUrl('https://commons.wikimedia.org/w/api.php', {
    action: 'query',
    format: 'json',
    formatversion: 2,
    generator: 'search',
    gsrsearch: `${texto} filetype:bitmap`, // solo fotos (sin PDF ni dibujos)
    gsrnamespace: 6, // 6 = archivos
    gsrlimit: FOTOS_POR_PAGINA,
    gsroffset: offset,
    prop: 'imageinfo',
    iiprop: 'url',
    iiurlwidth: 330, // ancho estándar de Wikimedia: liviano y suficiente para la grilla
    origin: '*',
  });
  const datos = await obtenerJSON<RespuestaWikimedia>(url);

  const fotos = (datos.query?.pages ?? [])
    .sort((a, b) => a.index - b.index) // la API no garantiza el orden
    .filter((pagina) => pagina.imageinfo?.[0]?.thumburl)
    .map((pagina) => ({
      id: String(pagina.pageid),
      titulo: limpiarTitulo(pagina.title),
      url: pagina.imageinfo![0].thumburl!,
      pagina: pagina.imageinfo![0].descriptionurl,
    }));

  return { fotos, termino: texto, siguienteOffset: datos.continue?.gsroffset ?? null };
}

/**
 * Busca una página de fotos.
 * En la PRIMERA página prueba los términos en orden hasta que alguno devuelva fotos
 * (ej: 'Nono Córdoba' y, si no hay nada, 'Nono'). Las páginas siguientes siguen
 * usando el término que funcionó, para que el scroll infinito no mezcle búsquedas.
 */
export async function buscarFotos({ terminos, offset }: ParametroPagina): Promise<PaginaFotos> {
  let ultima: PaginaFotos = { fotos: [], termino: terminos[0] ?? '', siguienteOffset: null };
  for (const termino of terminos) {
    ultima = await buscarEnWikimedia(termino, offset);
    if (ultima.fotos.length > 0) return ultima;
  }
  return ultima;
}
