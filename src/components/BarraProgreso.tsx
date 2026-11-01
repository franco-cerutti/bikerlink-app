// src/components/BarraProgreso.tsx
// Barra de progreso ANIMADA (API Animated).
// Cuando cambia el porcentaje, la barra no salta: se desliza hasta el nuevo valor.
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

interface BarraProgresoProps {
  porcentaje: number; // 0 a 100
}

export default function BarraProgreso({ porcentaje }: BarraProgresoProps) {
  const theme = useTheme();

  // Animated.Value guarda el valor que se anima. useRef lo mantiene entre renders
  // (si usáramos una variable común, se crearía de nuevo y la animación arrancaría de 0).
  const ancho = useRef(new Animated.Value(porcentaje)).current;

  useEffect(() => {
    // timing: va del valor actual al nuevo en 400 ms.
    Animated.timing(ancho, {
      toValue: porcentaje,
      duration: 400,
      useNativeDriver: false, // el ancho no se puede animar en el hilo nativo
    }).start();
  }, [porcentaje, ancho]);

  // interpolate convierte el número (0 a 100) en un ancho en porcentaje ('0%' a '100%').
  const anchoBarra = ancho.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  const completo = porcentaje === 100;

  return (
    <Fondo>
      <Animated.View
        style={{
          width: anchoBarra,
          height: '100%',
          borderRadius: 5,
          backgroundColor: completo ? theme.colores.exito : theme.colores.primario,
        }}
      />
    </Fondo>
  );
}

const Fondo = styled.View`
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colores.campo};
`;
