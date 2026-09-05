import type {
  MealDbCategory,
  MealDetail,
  MealSummary,
  RawMeal,
} from '@/types/meal';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

/**
 * TheMealDB devuelve { meals: [...] } o { meals: null } cuando no hay resultados.
 * Este helper centraliza el fetch + manejo de ese caso para no repetirlo.
 */
async function fetchMeals(path: string): Promise<RawMeal[]> {
  const res = await fetch(`${BASE_URL}${path}`, {
    // Los datos de recetas casi no cambian; evitamos golpear la API en cada render.
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TheMealDB respondió ${res.status} para ${path}`);
  }

  const data = (await res.json()) as { meals: RawMeal[] | null };
  return data.meals ?? [];
}

function toSummary(meal: RawMeal): MealSummary {
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    thumbnail: meal.strMealThumb,
    category: meal.strCategory ?? undefined,
  };
}

function toDetail(meal: RawMeal): MealDetail {
  const ingredients = Array.from({ length: 20 }, (_, i) => i + 1)
    .map((n) => {
      const name = meal[`strIngredient${n}`];
      const measure = meal[`strMeasure${n}`];
      return { name: name?.trim() ?? '', measure: measure?.trim() ?? '' };
    })
    .filter((ing) => ing.name.length > 0);

  const tags = meal.strTags
    ? meal.strTags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return {
    ...toSummary(meal),
    area: meal.strArea,
    instructions: meal.strInstructions,
    tags,
    youtubeUrl: meal.strYoutube || null,
    sourceUrl: meal.strSource || null,
    ingredients,
  };
}

/** Búsqueda por nombre. Con query vacío, TheMealDB devuelve un listado amplio. */
export async function searchMealsByName(query: string): Promise<MealSummary[]> {
  const meals = await fetchMeals(`/search.php?s=${encodeURIComponent(query)}`);
  return meals.map(toSummary);
}

export async function filterByCategory(category: string): Promise<MealSummary[]> {
  const meals = await fetchMeals(`/filter.php?c=${encodeURIComponent(category)}`);
  return meals.map(toSummary);
}

export async function filterByArea(area: string): Promise<MealSummary[]> {
  const meals = await fetchMeals(`/filter.php?a=${encodeURIComponent(area)}`);
  return meals.map(toSummary);
}

export async function filterByIngredient(ingredient: string): Promise<MealSummary[]> {
  const meals = await fetchMeals(`/filter.php?i=${encodeURIComponent(ingredient)}`);
  return meals.map(toSummary);
}

export async function getMealById(id: string): Promise<MealDetail | null> {
  const meals = await fetchMeals(`/lookup.php?i=${encodeURIComponent(id)}`);
  return meals.length > 0 ? toDetail(meals[0]) : null;
}

export async function getMealsByIds(ids: string[]): Promise<MealDetail[]> {
  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        return await getMealById(id);
      } catch {
        return null;
      }
    })
  );
  return results.filter((m): m is MealDetail => m !== null);
}

export async function getCategories(): Promise<MealDbCategory[]> {
  const res = await fetch(`${BASE_URL}/categories.php`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error('No se pudieron cargar las categorías');
  const data = (await res.json()) as { categories: MealDbCategory[] };
  return data.categories;
}

/** Lista de áreas/regiones (list.php?a=list devuelve objetos { strArea }) */
export async function getAreas(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/list.php?a=list`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error('No se pudieron cargar las áreas');
  const data = (await res.json()) as { meals: { strArea: string }[] };
  return data.meals.map((m) => m.strArea);
}

/** Convierte un link normal de YouTube a su URL de embed para el iframe del detalle. */
export function toYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const videoId = parsed.searchParams.get('v');
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}
