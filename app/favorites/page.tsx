'use client';

import { useEffect, useState } from 'react';
import RecipeGrid from '@/components/RecipeGrid';
import { useFavorites } from '@/hooks/useFavorites';
import { getMealsByIds } from '@/lib/mealdb';
import type { MealSummary } from '@/types/meal';

export default function FavoritesPage() {
  const { favoriteIds, hydrated } = useFavorites();
  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated) return;

    if (favoriteIds.length === 0) {
      setMeals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    getMealsByIds(favoriteIds)
      .then((details) =>
        setMeals(
          details.map((d) => ({
            id: d.id,
            name: d.name,
            thumbnail: d.thumbnail,
            category: d.category,
          }))
        )
      )
      .finally(() => setLoading(false));
  }, [favoriteIds, hydrated]);

  return (
    <>
      <section className="hero">
        <h1>Tus recetas favoritas</h1>
        <p className="hero-sub">
          Se guardan en este navegador, así que van a seguir acá la próxima
          vez que entrés.
        </p>
      </section>

      {(!hydrated || loading) && (
        <div className="state-message">Cargando favoritas…</div>
      )}

      {hydrated && !loading && (
        <RecipeGrid
          meals={meals}
          emptyTitle="Todavía no guardaste ninguna receta"
          emptyHint="Tocá el corazón en cualquier receta para verla acá."
        />
      )}
    </>
  );
}
