# BikerLink 🏍️

## Descripción del proyecto

Cuando se organizan salidas en moto entre varias personas, gran parte de la información termina dispersa en grupos de WhatsApp o redes sociales. Esto genera problemas para coordinar horarios, puntos de encuentro, paradas durante el recorrido y los elementos necesarios para el viaje.

**BikerLink** es una aplicación móvil pensada para la comunidad motera que permite organizar y gestionar rodadas de forma simple: crear salidas, consultar la información de las rutas, confirmar asistencia y usar herramientas que facilitan la preparación del viaje.

## Integrantes del grupo

- Carlos Franco Cerutti
- Marisa Ayelen Arias
- Susana Mariana Arias

## Features

| # | Feature | Estado |
|---|---------|--------|
| 1 | Crear y clasificar una rodada | 🟢 Completada |
| 2 | Buscar y filtrar salidas | 🟢 Completada |
| 3 | Gestión de asistencia | 🟢 Completada |
| 4 | Itinerario y paradas | 🔴 Pendiente |
| 5 | Check-list de preparación | 🔴 Pendiente |

### 1. Crear y clasificar una rodada

Permite publicar una nueva salida indicando título, tipo de rodada, punto de encuentro, destino, fecha, hora, distancia estimada y recomendaciones. Los tipos disponibles son: Vuelta corta, Fin de semana, Motoencuentro y Trail / Off-Road.

**Estado:** 🟢 Completada. El formulario valida los campos obligatorios, que la fecha exista y no sea pasada, el formato de la hora y que la distancia sea un número. Las rodadas se guardan en un estado global (Zustand) y por ahora se pierden al cerrar la app; la persistencia se agregará con AsyncStorage/SQLite.

### 2. Buscar y filtrar salidas

Permite explorar las salidas disponibles, buscarlas por texto y filtrarlas por tipo de viaje, fecha y distancia estimada.

**Estado:** 🟢 Completada.
- Búsqueda por texto en el título, el destino y el punto de encuentro (zona de partida). No distingue mayúsculas ni acentos: "condor" encuentra "Cóndor".
- Filtro por tipo de salida.
- Filtro por fecha: próximos 7 días, 30 días o 3 meses.
- Filtro por distancia: hasta 150 km, de 151 a 300 km o más de 300 km.
- Los filtros se combinan entre sí, el listado se ordena por fecha y muestra la cantidad de resultados, con un botón para limpiar todos los filtros.

### 3. Gestión de asistencia

Permite consultar el detalle de una salida y confirmar o cancelar la participación. El organizador y los participantes pueden ver la lista actualizada de asistentes.

**Estado:** 🟢 Completada.
- Pantalla de detalle de cada rodada (ruta dinámica `/rodada/[id]`) con la lista de asistentes: nombre, moto y quién organiza.
- Botón para confirmar asistencia y para cancelarla (con pedido de confirmación).
- Cupo máximo opcional al crear la rodada: muestra los lugares libres y bloquea la confirmación cuando se completa.
- El organizador no puede darse de baja de su propia rodada.
- El listado marca las rodadas a las que el usuario ya se anotó ("Vas") y las que están completas.
- Todavía no hay inicio de sesión: el usuario de la app es fijo ("Vos") hasta que se agregue login.

### 4. Itinerario y paradas

Permite definir y consultar las paradas del recorrido (estaciones de servicio, restaurantes, peajes o puntos turísticos) con una estimación de la distancia entre tramos.

**Estado:** 🔴 Pendiente.

### 5. Check-list de preparación

Lista de verificación para preparar la moto y el equipamiento antes de la salida. Los ítems sugeridos varían según el tipo de viaje.

**Estado:** 🔴 Pendiente.

## Tecnologías

- React Native con Expo (SDK 57) y TypeScript
- Expo Router: navegación Stack y ruta dinámica con parámetros
- Styled Components con ThemeProvider para los estilos
- Zustand para el estado global de las rodadas
- @expo/vector-icons para los íconos

## Cómo ejecutar

```bash
npm install
npx expo start
```

Con el emulador de Android Studio abierto, presionar `a` en la terminal para abrir la app.

## Estructura

```
src/
  app/                Rutas de Expo Router
    _layout.tsx       Stack + ThemeProvider
    index.tsx         Listado de rodadas  ( / )
    crear.tsx         Formulario          ( /crear )
    rodada/[id].tsx   Detalle             ( /rodada/:id )
  components/         Componentes reutilizables (RodadaCard, Boton, Chip, GrupoFiltro, BarraBusqueda, CampoTexto, Encabezado, InfoFila, FilaAsistente)
  store/              Estado global con Zustand
  styles/             Tema de colores
  data/               Datos de prueba y usuario actual
  types/              Tipos de TypeScript
  utils/              Validación y formato (formato.ts), búsqueda y filtros (filtros.ts) y reglas de asistencia (asistencia.ts)
```
