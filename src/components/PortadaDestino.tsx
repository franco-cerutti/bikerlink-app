// src/components/PortadaDestino.tsx
// Foto grande del destino arriba del detalle. Toma la PRIMERA foto de la galería
// (misma consulta, misma caché). Si todavía no hay fotos, no muestra nada.
import { StyleSheet } from 'react-native';

import { useFotosDestino } from '../hooks/useFotosDestino';
import FotoRemota from './FotoRemota';

export default function PortadaDestino({ destino }: { destino: string }) {
  const { fotos } = useFotosDestino(destino);
  if (fotos.length === 0) return null;
  return <FotoRemota url={fotos[0].url} estilo={styles.portada} />;
}

const styles = StyleSheet.create({
  portada: { width: '100%', height: 190, borderRadius: 12, marginBottom: 14, backgroundColor: '#E5E5EA' },
});
