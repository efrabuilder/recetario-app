'use client';

import { useEffect, useState } from 'react';
import RecipeGrid from '@/components/RecipeGrid';
import { useFavorites } from '@/hooks/useFavorites';
import { getMealById } from '@/lib/mealdb';
import { fetchSpoonacularMealSummary } from '@/lib/spoonacular';
import { fetchEdamamMealSummary, isEdamamId, stripEdamamPrefix } from '@/lib/edamam';
import {
  fetchCustomRecipeSummary,
  isCustomRecipeId,
  stripCustomPrefix,
} from '@/lib/customRecipes';
import { getDrinkById } from '@/lib/cocktaildb';
import type { MealSummary } from '@/types/meal';

const SPOONACULAR_PREFIX = 'sp-';
const DRINK_PREFIX = 'drink-';

async function resolveFavorite(id: string): Promise<MealSummary | null> {
  try {
    if (id.startsWith(SPOONACULAR_PREFIX)) {
      return await fetchSpoonacularMealSummary(id.slice(SPOONACULAR_PREFIX.length));
    }
    if (isEdamamId(id)) {
      return await fetchEdamamMealSummary(stripEdamamPrefix(id));
    }
    if (isCustomRecipeId(id)) {
      return await fetchCustomRecipeSummary(stripCustomPrefix(id));
    }
    if (id.startsWith(DRINK_PREFIX)) {
      const drink = await getDrinkById(id.slice(DRINK_PREFIX.length));
      return drink
        ? { id: drink.id, name: drink.name, thumbnail: drink.thumbnail, category: drink.category }
        : null;
    }
    const meal = await getMealById(id);
    return meal
      ? { id: meal.id, name: meal.name, thumbnail: meal.thumbnail, category: meal.category }
      : null;
  } catch {
    return null;
  }
}

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
    Promise.all(favoriteIds.map(resolveFavorite))
      .then((results) =>
        setMeals(results.filter((m): m is MealSummary => m !== null))
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
