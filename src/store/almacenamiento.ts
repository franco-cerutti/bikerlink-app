// src/store/almacenamiento.ts
// Conecta Zustand con AsyncStorage (el almacenamiento local del celular).
// AsyncStorage guarda TEXTO con una clave, por eso createJSONStorage convierte
// el estado a JSON al guardar y lo vuelve a armar al abrir la app.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

export const almacenamientoLocal = createJSONStorage(() => AsyncStorage);
