'use client';

import { useEffect, useMemo, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import RecipeGrid from '@/components/RecipeGrid';
import {
  filterDrinksByCategory,
  getAvailableDrinkCategories,
  getFullDrinkCatalog,
  searchDrinksByName,
} from '@/lib/cocktaildb';
import type { DrinkSummary } from '@/types/drink';

export default function DrinksPage() {
  const [queryInput, setQueryInput] = useState('');
  const [category, setCategory] = useState('');

  const [drinks, setDrinks] = useState<DrinkSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [catalog, setCatalog] = useState<DrinkSummary[]>([]);

  const categories = useMemo(
    () => getAvailableDrinkCategories(catalog),
    [catalog]
  );

  useEffect(() => {
    setLoading(true);
    setError(null);
    getFullDrinkCatalog()
      .then((result) => {
        setCatalog(result);
        setDrinks(result);
      })
      .catch(() => {
        setError(
          'No pudimos cargar bebidas ahora mismo. Probá de nuevo en un momento.'
        );
      })
      .finally(() => setLoading(false));
  }, []);

  async function runFetch(fetcher: () => Promise<DrinkSummary[]>) {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setDrinks(result);
    } catch {
      setError(
        'No pudimos cargar bebidas ahora mismo. Probá de nuevo en un momento.'
      );
      setDrinks([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit() {
    setCategory('');
    runFetch(() => searchDrinksByName(queryInput.trim()));
  }

  function handleCategoryChange(value: string) {
    setCategory(value);
    setQueryInput('');
    if (value) {
      runFetch(() => filterDrinksByCategory(value));
    } else {
      setDrinks(catalog);
    }
  }

  function handleClear() {
    setQueryInput('');
    setCategory('');
    setDrinks(catalog);
  }

  const hasActiveFilters = Boolean(category || queryInput);

  return (
    <>
      <section className="hero">
        <h1>Qué tomar hoy</h1>
        <p className="hero-sub">
          Buscá bebidas por nombre o filtrá por categoría — de TheCocktailDB,
          la base hermana de TheMealDB.
        </p>
        <SearchBar
          value={queryInput}
          onChange={setQueryInput}
          onSubmit={handleSearchSubmit}
        />
        <div className="filter-bar">
          <select
            className="filter-select"
            value={category}
            onChange={(event) => handleCategoryChange(event.target.value)}
            aria-label="Filtrar por categoría"
          >
            <option value="">Toda categoría</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {hasActiveFilters && (
            <button type="button" className="filter-clear" onClick={handleClear}>
              Quitar filtros
            </button>
          )}
        </div>
      </section>

      {loading && <div className="state-message">Buscando bebidas…</div>}

      {!loading && error && (
        <div className="state-message">
          <strong>Algo salió mal</strong>
          {error}
        </div>
      )}

      {!loading && !error && (
        <RecipeGrid
          meals={drinks}
          emptyTitle="No encontramos bebidas"
          emptyHint="Probá con otro término de búsqueda o quitá los filtros."
        />
      )}
    </>
  );
}
