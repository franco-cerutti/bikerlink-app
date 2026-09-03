// src/screens/HomeScreen.tsx
import { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RODADAS_INICIALES, TIPOS_SALIDA } from '../data/mockData';
import CreateScreen from './CreateScreen';

export default function HomeScreen() {
  const [rodadas, setRodadas] = useState(RODADAS_INICIALES);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [modoCrear, setModoCrear] = useState(false);

  // Agregar la nueva rodada creada al estado local
  const handleAgregarRodada = (nuevaRodada: any) => {
    setRodadas([nuevaRodada, ...rodadas]);
  };

  // Si el usuario tocó el botón "+", mostramos el formulario de creación
  if (modoCrear) {
    return (
      <CreateScreen
        onVolver={() => setModoCrear(false)}
        onAgregarRodada={handleAgregarRodada}
      />
    );
  }

  // Filtrado de la lista según el tipo de salida seleccionado
  const rodadasFiltradas =
    categoriaSeleccionada === 'Todas'
      ? rodadas
      : rodadas.filter((rodada) => rodada.tipo === categoriaSeleccionada);

  const renderRodadaCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <Text style={styles.badgeTipo}>{item.tipo}</Text>
      </View>

      <Text style={styles.cardInfo}>📍 Destino: {item.destino}</Text>
      <Text style={styles.cardInfo}>📅 Fecha: {item.fecha}</Text>
      <Text style={styles.cardInfo}>🛣️ Distancia: {item.distancia}</Text>

      {item.descripcion ? (
        <Text style={styles.cardDesc} numberOfLines={2}>
          💬 {item.descripcion}
        </Text>
      ) : null}

      <View style={styles.cardFooter}>
        <Text style={styles.asistentesText}>👥 {item.asistentes} moteros confirmados</Text>
        <TouchableOpacity style={styles.buttonDetalle} activeOpacity={0.7}>
          <Text style={styles.buttonText}>Ver detalle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Encabezado Principal */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BikerLink 🏍️</Text>
        <Text style={styles.headerSubtitle}>Explorá tu próxima rodada en grupo</Text>
      </View>

      {/* Selector de Filtros por Tipo de Salida */}
      <View style={styles.filtrosContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={TIPOS_SALIDA}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const esSeleccionado = item === categoriaSeleccionada;
            return (
              <TouchableOpacity
                style={[styles.chipFiltro, esSeleccionado && styles.chipFiltroSeleccionado]}
                onPress={() => setCategoriaSeleccionada(item)}
              >
                <Text style={[styles.chipText, esSeleccionado && styles.chipTextSeleccionado]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Lista de Salidas Registradas */}
      <FlatList
        data={rodadasFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={renderRodadaCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay salidas registradas para esta categoría.</Text>
        }
      />

      {/* Botón Flotante "+" para Crear Nueva Rodada */}
      <TouchableOpacity
        style={styles.fabButton}
        activeOpacity={0.8}
        onPress={() => setModoCrear(true)}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6E6E73',
    marginTop: 2,
  },
  filtrosContainer: {
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  chipFiltro: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E5E5EA',
    marginLeft: 12,
  },
  chipFiltroSeleccionado: {
    backgroundColor: '#D32F2F',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A3A3C',
  },
  chipTextSeleccionado: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Espacio extra para que el botón flotante no tape el último item
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1C1C1E',
    flex: 1,
    marginRight: 8,
  },
  badgeTipo: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  cardInfo: {
    fontSize: 14,
    color: '#3A3A3C',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#6E6E73',
    marginTop: 6,
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  asistentesText: {
    fontSize: 13,
    color: '#6E6E73',
    fontWeight: '500',
  },
  buttonDetalle: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#8E8E93',
    marginTop: 40,
    fontSize: 15,
  },
  fabButton: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    backgroundColor: '#D32F2F',
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '300',
    marginTop: -2,
  },
});