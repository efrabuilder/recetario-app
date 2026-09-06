'use client';

import { useEffect, useMemo, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import RecipeGrid from '@/components/RecipeGrid';
import {
  filterByArea,
  filterByCategory,
  getAvailableAreas,
  getAvailableCategories,
  getFullMealCatalog,
  searchMealsByName,
} from '@/lib/mealdb';
import {
  filterBySpoonacularCuisine,
  isSpoonacularCuisine,
} from '@/lib/spoonacular';
import { filterByEdamamCuisine, isEdamamCuisine } from '@/lib/edamam';
import { fetchCustomAreas, fetchCustomRecipesByArea } from '@/lib/customRecipes';
import type { MealSummary } from '@/types/meal';

export default function HomePage() {
  const [queryInput, setQueryInput] = useState('');
  const [category, setCategory] = useState('');
  const [area, setArea] = useState('');

  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [catalog, setCatalog] = useState<MealSummary[]>([]);
  const [customAreas, setCustomAreas] = useState<string[]>([]);

  const categories = useMemo(() => getAvailableCategories(catalog), [catalog]);
  // Derivada del catálogo real (no del listado maestro de TheMealDB): así toda
  // opción del selector tiene al menos una receta garantizada. Spoonacular y
  // Edamam se suman como plus al filtrar (ver handleAreaChange), no como
  // opciones propias, porque no podemos garantizar de antemano que tengan
  // resultados. Las recetas propias (Supabase) sí se suman como opciones,
  // porque son justamente los países que las otras tres fuentes no cubren.
  const areas = useMemo(() => {
    const merged = new Set([...getAvailableAreas(catalog), ...customAreas]);
    return Array.from(merged).sort((a, b) => a.localeCompare(b));
  }, [catalog, customAreas]);

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

    // Las áreas propias son independientes del catálogo de TheMealDB, así que
    // se cargan aparte; si Supabase no está configurado, esto devuelve [].
    fetchCustomAreas()
      .then(setCustomAreas)
      .catch(() => setCustomAreas([]));
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
        const [mealDbResults, spoonacularResults, edamamResults, customResults] =
          await Promise.all([
            filterByArea(value).catch(() => []),
            isSpoonacularCuisine(value)
              ? filterBySpoonacularCuisine(value).catch(() => [])
              : Promise.resolve([]),
            isEdamamCuisine(value)
              ? filterByEdamamCuisine(value).catch(() => [])
              : Promise.resolve([]),
            // Las recetas propias son el respaldo para países que ni
            // TheMealDB ni Spoonacular ni Edamam cubren bien; se intentan
            // siempre, sin depender de una lista fija de países soportados.
            fetchCustomRecipesByArea(value).catch(() => []),
          ]);
        return [
          ...mealDbResults,
          ...spoonacularResults,
          ...edamamResults,
          ...customResults,
        ];
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
