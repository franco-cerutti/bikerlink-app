// src/app/crear.tsx  →  ruta "/crear"
// Formulario para publicar una rodada (Feature 1).
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import CampoTexto from '../components/CampoTexto';
import Chip from '../components/Chip';
import Encabezado from '../components/Encabezado';
import { useRodadasStore } from '../store/rodadasStore';
import { Rodada, TIPOS_SALIDA, TipoSalida } from '../types/rodada';
import { hoyISO, parsearFecha, parsearHora } from '../utils/formato';

export default function CrearRodada() {
  const router = useRouter();

  // Tomamos del store solo la acción que necesitamos.
  const agregarRodada = useRodadasStore((state) => state.agregarRodada);

  // Un estado por campo ("componentes controlados": el valor del input vive en el estado).
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<TipoSalida>('Vuelta corta');
  const [puntoEncuentro, setPuntoEncuentro] = useState('');
  const [destino, setDestino] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [distancia, setDistancia] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handlePublicar = () => {
    const errores: string[] = [];

    if (!titulo.trim()) errores.push('Ingresá un título.');
    if (!puntoEncuentro.trim()) errores.push('Ingresá el punto de encuentro.');
    if (!destino.trim()) errores.push('Ingresá el destino.');

    const fechaISO = parsearFecha(fecha);
    if (!fechaISO) {
      errores.push('La fecha debe tener el formato DD/MM/AAAA y ser válida.');
    } else if (fechaISO < hoyISO()) {
      errores.push('La fecha no puede ser anterior a hoy.');
    }

    const horaNormalizada = parsearHora(hora);
    if (!horaNormalizada) errores.push('La hora debe tener el formato HH:MM (ej: 08:30).');

    let distanciaKm: number | null = null;
    if (distancia.trim()) {
      distanciaKm = Number(distancia);
      if (!Number.isInteger(distanciaKm) || distanciaKm <= 0) {
        errores.push('La distancia debe ser un número entero mayor a 0.');
      }
    }

    if (errores.length > 0) {
      Alert.alert('Revisá los datos', errores.join('\n'));
      return;
    }

    const nuevaRodada: Rodada = {
      id: Date.now().toString(),
      titulo: titulo.trim(),
      tipo,
      puntoEncuentro: puntoEncuentro.trim(),
      destino: destino.trim(),
      fecha: fechaISO!, // "!" = ya validamos que no es null
      hora: horaNormalizada!,
      distanciaKm,
      asistentes: 1, // el organizador es el primer asistente
      descripcion: descripcion.trim(),
    };

    agregarRodada(nuevaRodada); // se guarda en el store global
    Alert.alert('¡Listo!', 'Tu rodada fue publicada en BikerLink.');
    router.back(); // volvemos al listado, que ya la muestra porque lee el mismo store
  };

  return (
    <Pantalla>
      <Encabezado
        titulo="Nueva rodada"
        subtitulo="Completá los datos para convocar al grupo"
        onVolver={() => router.back()}
      />

      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView contentContainerStyle={styles.formulario} keyboardShouldPersistTaps="handled">
          <CampoTexto
            etiqueta="Título de la salida *"
            placeholder="Ej: Vuelta por Altas Cumbres"
            value={titulo}
            onChangeText={setTitulo}
          />

          <Etiqueta>Tipo de experiencia *</Etiqueta>
          <GrupoChips>
            {TIPOS_SALIDA.map((opcion) => (
              <Chip
                key={opcion}
                texto={opcion}
                seleccionado={opcion === tipo}
                onPress={() => setTipo(opcion)}
              />
            ))}
          </GrupoChips>

          <CampoTexto
            etiqueta="Punto de encuentro *"
            placeholder="Ej: YPF Carlos Paz"
            value={puntoEncuentro}
            onChangeText={setPuntoEncuentro}
          />

          <CampoTexto
            etiqueta="Destino *"
            placeholder="Ej: El Cóndor"
            value={destino}
            onChangeText={setDestino}
          />

          <Fila>
            <CampoTexto
              etiqueta="Fecha *"
              placeholder="DD/MM/AAAA"
              keyboardType="numbers-and-punctuation"
              maxLength={10}
              value={fecha}
              onChangeText={setFecha}
            />
            <Separador />
            <CampoTexto
              etiqueta="Hora *"
              placeholder="HH:MM"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              value={hora}
              onChangeText={setHora}
            />
          </Fila>

          <CampoTexto
            etiqueta="Distancia (km)"
            placeholder="Ej: 150 (opcional)"
            keyboardType="numeric"
            value={distancia}
            onChangeText={setDistancia}
          />

          <CampoTexto
            etiqueta="Recomendaciones / Detalles"
            placeholder="Ej: Salimos con tanque lleno, traigan equipo para lluvia."
            multiline
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <BotonPublicar onPress={handlePublicar} activeOpacity={0.8}>
            <TextoBoton>Publicar rodada</TextoBoton>
          </BotonPublicar>
        </ScrollView>
      </KeyboardAvoidingView>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  formulario: { padding: 20 },
});

const Pantalla = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colores.superficie};
`;

const Etiqueta = styled.Text`
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colores.texto};
`;

const GrupoChips = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
`;

const Fila = styled.View`
  flex-direction: row;
`;

const Separador = styled.View`
  width: 16px;
`;

const BotonPublicar = styled.TouchableOpacity`
  align-items: center;
  margin: 10px 0 30px 0;
  padding: 16px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colores.primario};
`;

const TextoBoton = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colores.blanco};
`;
