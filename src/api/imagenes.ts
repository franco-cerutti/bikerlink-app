// src/api/imagenes.ts
// Descarga una imagen con fetch y la convierte en un "data URI"
// (el archivo entero escrito como texto: 'data:image/jpeg;base64,...').
//
// ¿Por qué no le pasamos la URL directo a <Image>? En Android, <Image> descarga la
// foto por su cuenta y Wikimedia rechaza esas descargas. En cambio fetch sí funciona
// (con él traemos el listado de fotos), así que descargamos con fetch y le damos a
// <Image> la imagen ya descargada.
import { ENCABEZADOS } from './http';

export async function descargarImagen(url: string): Promise<string> {
  let respuesta: Response;
  try {
    respuesta = await fetch(url, { headers: ENCABEZADOS });
  } catch {
    throw new Error('Sin conexión a internet');
  }
  if (!respuesta.ok) {
    console.warn(`[Imagen] ${respuesta.status} en ${url}`);
    throw new Error(`La imagen respondió con el código ${respuesta.status}`);
  }

  // blob = el archivo en bruto. FileReader lo pasa a texto base64 que <Image> entiende.
  const archivo = await respuesta.blob();
  return new Promise<string>((resolver, rechazar) => {
    const lector = new FileReader();
    lector.onloadend = () => resolver(lector.result as string);
    lector.onerror = () => rechazar(new Error('No se pudo leer la imagen'));
    lector.readAsDataURL(archivo);
  });
}
