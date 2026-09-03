// src/screens/CreateScreen.tsx
import { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { TIPOS_SALIDA } from '../data/mockData';

interface CreateScreenProps {
  onVolver: () => void;
  onAgregarRodada: (nuevaRodada: any) => void;
}

export default function CreateScreen({ onVolver, onAgregarRodada }: CreateScreenProps) {
  const [titulo, setTitulo] = useState('');
  const [destino, setDestino] = useState('');
  const [fecha, setFecha] = useState('');
  const [distancia, setDistancia] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState('Vuelta corta');

  // Filtramos 'Todas' porque al crear una rodada debemos asignar un tipo específico
  const tiposDisponibles = TIPOS_SALIDA.filter((t) => t !== 'Todas');

  const handlePublicar = () => {
    // Validamos que los campos principales no estén vacíos
    if (!titulo.trim() || !destino.trim() || !fecha.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completá al menos el título, destino y fecha de la rodada.');
      return;
    }

    const nuevaRodada = {
      id: Date.now().toString(),
      titulo,
      tipo: tipoSeleccionado,
      destino,
      fecha,
      distancia: distancia ? `${distancia} km` : 'A definir',
      puntosEncuentro: [destino],
      asistentes: 1, // El organizador es el primer asistente
      descripcion,
    };

    onAgregarRodada(nuevaRodada);
    Alert.alert('¡Éxito!', 'Tu rodada ha sido publicada en BikerLink.');
    onVolver();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Botón de volver */}
        <TouchableOpacity style={styles.btnVolver} onPress={onVolver}>
          <Text style={styles.txtVolver}>← Volver a Explorar</Text>
        </TouchableOpacity>

        <Text style={styles.tituloHeader}>Publicar Nueva Rodada 🏍️</Text>
        <Text style={styles.subtituloHeader}>Completá los datos para convocar al grupo</Text>

        {/* Campo Título */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Título de la salida *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Vuelta por Altas Cumbres"
            value={titulo}
            onChangeText={setTitulo}
          />
        </View>

        {/* Selección de Tipo de Salida */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de experiencia *</Text>
          <View style={styles.tiposContainer}>
            {tiposDisponibles.map((tipo) => {
              const seleccionado = tipo === tipoSeleccionado;
              return (
                <TouchableOpacity
                  key={tipo}
                  style={[styles.chipTipo, seleccionado && styles.chipTipoSeleccionado]}
                  onPress={() => setTipoSeleccionado(tipo)}
                >
                  <Text style={[styles.txtChip, seleccionado && styles.txtChipSeleccionado]}>
                    {tipo}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Campo Destino */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Destino / Punto de llegada *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: El Cóndor, Valle Hermoso, etc."
            value={destino}
            onChangeText={setDestino}
          />
        </View>

        {/* Fila doble: Fecha y Distancia */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Fecha y Hora *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Sábado 15, 08:00 hs"
              value={fecha}
              onChangeText={setFecha}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Distancia (km)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 150"
              keyboardType="numeric"
              value={distancia}
              onChangeText={setDistancia}
            />
          </View>
        </View>

        {/* Descripción / Recomendaciones */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Recomendaciones / Detalles</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ej: Salimos con tanque lleno, ritmo crucero 100 km/h, traigan equipo para lluvia."
            multiline
            numberOfLines={4}
            value={descripcion}
            onChangeText={setDescripcion}
          />
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity style={styles.btnPublicar} onPress={handlePublicar} activeOpacity={0.8}>
          <Text style={styles.txtPublicar}>🚀 Publicar Rodada</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
  },
  btnVolver: {
    marginBottom: 15,
  },
  txtVolver: {
    color: '#D32F2F',
    fontSize: 15,
    fontWeight: '600',
  },
  tituloHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  subtituloHeader: {
    fontSize: 14,
    color: '#6E6E73',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A3A3C',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  tiposContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipTipo: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  chipTipoSeleccionado: {
    backgroundColor: '#D32F2F',
    borderColor: '#D32F2F',
  },
  txtChip: {
    fontSize: 13,
    color: '#3A3A3C',
    fontWeight: '500',
  },
  txtChipSeleccionado: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  btnPublicar: {
    backgroundColor: '#D32F2F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  txtPublicar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});