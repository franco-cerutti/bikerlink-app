// src/data/usuario.ts
// La persona que está usando la app.
// Todavía no hay inicio de sesión, así que por ahora es un usuario fijo.
// Cuando agreguemos login, este dato va a venir de la cuenta del usuario.
import { Asistente } from '../types/rodada';

export const USUARIO_ACTUAL: Asistente = {
  id: 'usuario-actual',
  nombre: 'Vos',
};
