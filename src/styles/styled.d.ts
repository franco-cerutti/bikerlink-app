// src/styles/styled.d.ts
// Le dice a TypeScript qué forma tiene "theme" dentro de los styled components.
// Gracias a esto, al escribir theme.colores. el editor autocompleta los colores.
import 'styled-components/native';
import { Tema } from './theme';

declare module 'styled-components/native' {
  export interface DefaultTheme extends Tema {}
}
