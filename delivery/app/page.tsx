'use client';

import { useEffect, useMemo, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import RecipeGrid from '@/components/RecipeGrid';
import {
  filterByArea,
  filterByCategory,
  getAllAreas,
  getAvailableCategories,
  getFullMealCatalog,
  searchMealsByName,
} from '@/lib/mealdb';
import {
  SPOONACULAR_CUISINES,
  filterBySpoonacularCuisine,
  isSpoonacularCuisine,
} from '@/lib/spoonacular';
import type { MealSummary } from '@/types/meal';

export default function HomePage() {
  const [queryInput, setQueryInput] = useState('');
  const [category, setCategory] = useState('');
  const [area, setArea] = useState('');

  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [catalog, setCatalog] = useState<MealSummary[]>([]);
  const [areas, setAreas] = useState<string[]>([]);

  const categories = useMemo(() => getAvailableCategories(catalog), [catalog]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getFullMealCatalog()
      .then((result) => {
        setCatalog(result);
        setMeals(result);
      })
      .catch(() => {
        setError(
          'No pudimos cargar recetas ahora mismo. Probá de nuevo en un momento.'
        );
      })
      .finally(() => setLoading(false));

    getAllAreas()
      .then((mealDbAreas) => {
        const merged = new Set([...mealDbAreas, ...SPOONACULAR_CUISINES]);
        setAreas(Array.from(merged).sort((a, b) => a.localeCompare(b)));
      })
      .catch(() => {
        // Si falla el listado maestro, al menos dejamos las cuisines de
        // Spoonacular para que el selector de país no quede vacío.
        setAreas([...SPOONACULAR_CUISINES].sort((a, b) => a.localeCompare(b)));
      });
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
    if (value) {
      runFetch(() => filterByCategory(value));
    } else {
      setMeals(catalog);
    }
  }

  function handleAreaChange(value: string) {
    setArea(value);
    setCategory('');
    setQueryInput('');
    if (value) {
      runFetch(async () => {
        const [mealDbResults, spoonacularResults] = await Promise.all([
          filterByArea(value).catch(() => []),
          isSpoonacularCuisine(value)
            ? filterBySpoonacularCuisine(value).catch(() => [])
            : Promise.resolve([]),
        ]);
        return [...mealDbResults, ...spoonacularResults];
      });
    } else {
      setMeals(catalog);
    }
  }

  function handleClear() {
    setQueryInput('');
    setCategory('');
    setArea('');
    setMeals(catalog);
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
