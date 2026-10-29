// src/components/FotoRemota.tsx
// Foto de internet. La descarga se hace con fetch + TanStack Query (ver api/imagenes.ts):
//  - Mientras se descarga: spinner.
//  - Si falla: un ícono de imagen.
//  - Cuando llega: <Image> con la foto.
// Una imagen remota SIEMPRE necesita un tamaño (ancho y alto), porque React Native
// no sabe cuánto mide hasta que la descarga. El tamaño lo da el estilo que recibe.
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, Image, ImageStyle, StyleProp, StyleSheet, View } from 'react-native';

import { descargarImagen } from '../api/imagenes';

interface FotoRemotaProps {
  url: string;
  estilo: StyleProp<ImageStyle>;
}

export default function FotoRemota({ url, estilo }: FotoRemotaProps) {
  // Cada foto es una consulta con su propia key: si la misma foto aparece en la portada,
  // en la vista previa y en la galería, se descarga UNA sola vez y después sale de la caché.
  const imagen = useQuery({
    queryKey: ['imagen', url],
    queryFn: () => descargarImagen(url),
    staleTime: Infinity, // una foto no cambia
  });

  if (imagen.isLoading) {
    return (
      <View style={[estilo, styles.centrado]}>
        <ActivityIndicator size="small" color="#8E8E93" />
      </View>
    );
  }

  if (imagen.isError || !imagen.data) {
    return (
      <View style={[estilo, styles.centrado]}>
        <Ionicons name="image-outline" size={28} color="#8E8E93" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: imagen.data }}
      // cover: recorta la foto para llenar todo el espacio sin deformarla.
      resizeMode="cover"
      style={estilo}
    />
  );
}

const styles = StyleSheet.create({
  centrado: { alignItems: 'center', justifyContent: 'center' },
});
