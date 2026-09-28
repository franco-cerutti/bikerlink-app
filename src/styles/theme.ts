// src/styles/theme.ts
// Paleta centralizada de la app. Todos los componentes toman los colores de acá
// a través del ThemeProvider, así un cambio de color se hace en un solo lugar.
export const tema = {
  colores: {
    primario: '#D32F2F', // rojo BikerLink: botones, chips seleccionados
    primarioSuave: '#FFEBEE', // fondo de etiquetas
    primarioOscuro: '#C62828', // texto sobre primarioSuave
    fondo: '#F5F5F7', // fondo general de las pantallas
    superficie: '#FFFFFF', // tarjetas, encabezados, formularios
    campo: '#F2F2F7', // fondo de inputs y chips sin seleccionar
    borde: '#E5E5EA',
    texto: '#1C1C1E',
    textoSecundario: '#6E6E73',
    textoTenue: '#8E8E93',
    blanco: '#FFFFFF',
  },
};

// Tipo derivado del objeto: si agregamos un color, el tipo se actualiza solo.
export type Tema = typeof tema;
