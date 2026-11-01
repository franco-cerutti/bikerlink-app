// src/hooks/useDatosCargados.ts
// AsyncStorage es ASÍNCRONO: al abrir la app, los datos guardados tardan un instante
// en leerse. Este hook dice cuándo terminaron de cargarse los dos stores persistidos,
// para no mostrar los datos de ejemplo y que un segundo después "salten" a los guardados.
import { useEffect, useState } from 'react';

import { useChecklistStore } from '../store/checklistStore';
import { useRodadasStore } from '../store/rodadasStore';

export function useDatosCargados(): boolean {
  const [cargados, setCargados] = useState(
    useRodadasStore.persist.hasHydrated() && useChecklistStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const revisar = () =>
      setCargados(useRodadasStore.persist.hasHydrated() && useChecklistStore.persist.hasHydrated());

    // onFinishHydration avisa cuando cada store terminó de leer AsyncStorage.
    const desuscribir1 = useRodadasStore.persist.onFinishHydration(revisar);
    const desuscribir2 = useChecklistStore.persist.onFinishHydration(revisar);
    revisar(); // por si ya habían terminado antes de suscribirnos

    // Limpieza: dejamos de escuchar cuando el componente se desmonta.
    return () => {
      desuscribir1();
      desuscribir2();
    };
  }, []);

  return cargados;
}
