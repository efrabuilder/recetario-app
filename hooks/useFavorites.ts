'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  FAVORITES_EVENT,
  getFavoriteIds,
  toggleFavorite,
} from '@/lib/favorites';

/**
 * Mantiene la lista de IDs favoritos sincronizada con localStorage,
 * incluso entre varios componentes montados a la vez (ej. una tarjeta
 * y el contador del header).
 */
export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavoriteIds(getFavoriteIds());
    setHydrated(true);

    const handleChange = () => setFavoriteIds(getFavoriteIds());
    window.addEventListener(FAVORITES_EVENT, handleChange);
    window.addEventListener('storage', handleChange);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, handleChange);
      window.removeEventListener('storage', handleChange);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    toggleFavorite(id);
    setFavoriteIds(getFavoriteIds());
  }, []);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds]
  );

  return { favoriteIds, isFavorite, toggle, hydrated };
}
