'use client';

import { useEffect, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import RecipeGrid from '@/components/RecipeGrid';
import {
  filterByArea,
  filterByCategory,
  getAreas,
  getCategories,
  searchMealsByName,
} from '@/lib/mealdb';
import type { MealDbCategory, MealSummary } from '@/types/meal';

export default function HomePage() {
  const [queryInput, setQueryInput] = useState('');
  const [category, setCategory] = useState('');
  const [area, setArea] = useState('');

  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<MealDbCategory[]>([]);
  const [areas, setAreas] = useState<string[]>([]);

  // Cargamos categorías/áreas para los selects y el listado inicial una sola vez.
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
    getAreas()
      .then(setAreas)
      .catch(() => setAreas([]));
    runFetch(() => searchMealsByName(''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runFetch(fetcher: () => Promise<MealSummary[]>) {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setMeals(result);
    } catch (err) {
      setError(
        'No pudimos cargar recetas ahora mismo. Probá de nuevo en un momento.'
      );
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit() {
    setCategory('');
    setArea('');
    runFetch(() => searchMealsByName(queryInput.trim()));
  }

  function handleCategoryChange(value: string) {
    setCategory(value);
    setArea('');
    setQueryInput('');
    runFetch(() => (value ? filterByCategory(value) : searchMealsByName('')));
  }

  function handleAreaChange(value: string) {
    setArea(value);
    setCategory('');
    setQueryInput('');
    runFetch(() => (value ? filterByArea(value) : searchMealsByName('')));
  }

  function handleClear() {
    setQueryInput('');
    setCategory('');
    setArea('');
    runFetch(() => searchMealsByName(''));
  }

  return (
    <>
      <section className="hero">
        <h1>Encontrá qué cocinar hoy</h1>
        <p className="hero-sub">
          Buscá por nombre, filtrá por categoría o región, y guardá tus
          recetas favoritas para volver a ellas cuando quieras.
        </p>
        <SearchBar
          value={queryInput}
          onChange={setQueryInput}
          onSubmit={handleSearchSubmit}
        />
        <FilterBar
          categories={categories}
          areas={areas}
          category={category}
          area={area}
          onCategoryChange={handleCategoryChange}
          onAreaChange={handleAreaChange}
          onClear={handleClear}
          hasActiveFilters={Boolean(category || area || queryInput)}
        />
      </section>

      {loading && <div className="state-message">Buscando recetas…</div>}

      {!loading && error && (
        <div className="state-message">
          <strong>Algo salió mal</strong>
          {error}
        </div>
      )}

      {!loading && !error && (
        <RecipeGrid
          meals={meals}
          emptyTitle="No encontramos recetas"
          emptyHint="Probá con otro término de búsqueda o quitá los filtros."
        />
      )}
    </>
  );
}
