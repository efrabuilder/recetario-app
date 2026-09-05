import type { DrinkDetail, DrinkIngredient, DrinkSummary, RawDrink } from '@/types/drink';

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

/**
 * TheCocktailDB es la base "hermana" de TheMealDB (mismo creador, mismo
 * estilo de API), y su nivel gratuito no pide ninguna clave. Devuelve
 * { drinks: [...] } o { drinks: null } cuando no hay resultados.
 */
async function fetchDrinks(path: string): Promise<RawDrink[]> {
  const res = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TheCocktailDB respondió ${res.status} para ${path}`);
  }

  const data = (await res.json()) as { drinks: RawDrink[] | null };
  return data.drinks ?? [];
}

// Prefijo para no chocar con los ids numéricos de TheMealDB en favoritos.
const DRINK_ID_PREFIX = 'drink-';

function toSummary(drink: RawDrink): DrinkSummary {
  return {
    id: `${DRINK_ID_PREFIX}${drink.idDrink}`,
    name: drink.strDrink,
    thumbnail: drink.strDrinkThumb,
    category: drink.strCategory ?? undefined,
  };
}

function toDetail(drink: RawDrink): DrinkDetail {
  const ingredients: DrinkIngredient[] = Array.from({ length: 15 }, (_, i) => i + 1)
    .map((n) => {
      const name = drink[`strIngredient${n}`];
      const measure = drink[`strMeasure${n}`];
      return { name: name?.trim() ?? '', measure: measure?.trim() ?? '' };
    })
    .filter((ing) => ing.name.length > 0);

  return {
    ...toSummary(drink),
    instructions: drink.strInstructions,
    alcoholic: drink.strAlcoholic,
    glass: drink.strGlass,
    ingredients,
  };
}

/** Búsqueda por nombre. Con query vacío, devuelve un listado amplio. */
export async function searchDrinksByName(query: string): Promise<DrinkSummary[]> {
  const drinks = await fetchDrinks(`/search.php?s=${encodeURIComponent(query)}`);
  return drinks.map(toSummary);
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

/**
 * Igual que getFullMealCatalog en lib/mealdb.ts: combina `search.php?f=<letra>`
 * para recorrer toda la base gratuita, ya que no existe un "listar todo".
 */
export async function getFullDrinkCatalog(): Promise<DrinkSummary[]> {
  const results = await Promise.all(
    ALPHABET.map(async (letter) => {
      try {
        const drinks = await fetchDrinks(`/search.php?f=${letter}`);
        return drinks.map(toSummary);
      } catch {
        return [];
      }
    })
  );

  const merged = new Map<string, DrinkSummary>();
  for (const list of results) {
    for (const drink of list) {
      merged.set(drink.id, drink);
    }
  }
  return Array.from(merged.values());
}

export async function filterDrinksByCategory(category: string): Promise<DrinkSummary[]> {
  const drinks = await fetchDrinks(`/filter.php?c=${encodeURIComponent(category)}`);
  return drinks.map(toSummary);
}

/** Recibe el id SIN el prefijo "drink-" (el que va en la URL /drink/[id]). */
export async function getDrinkById(id: string): Promise<DrinkDetail | null> {
  const drinks = await fetchDrinks(`/lookup.php?i=${encodeURIComponent(id)}`);
  return drinks.length > 0 ? toDetail(drinks[0]) : null;
}

export function getAvailableDrinkCategories(drinks: DrinkSummary[]): string[] {
  const unique = new Set(
    drinks.map((d) => d.category).filter((c): c is string => Boolean(c))
  );
  return Array.from(unique).sort((a, b) => a.localeCompare(b));
}
