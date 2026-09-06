import type { Ingredient, MealDetail, MealSummary, NutritionInfo } from '@/types/meal';

/**
 * Cuisines que reconoce Spoonacular. Muchos nombres coinciden con los
 * "areas" de TheMealDB (Mexican, Italian, Thai...), pero Spoonacular suma
 * varios que TheMealDB no tiene en absoluto (Korean, Cajun, Nordic, etc.).
 * Se usa tanto para completar el selector de país como para validar qué
 * cuisines podemos pedirle a la API.
 */
export const SPOONACULAR_CUISINES = [
  'African',
  'American',
  'British',
  'Cajun',
  'Caribbean',
  'Chinese',
  'Eastern European',
  'European',
  'French',
  'German',
  'Greek',
  'Indian',
  'Irish',
  'Italian',
  'Japanese',
  'Jewish',
  'Korean',
  'Latin American',
  'Mediterranean',
  'Mexican',
  'Middle Eastern',
  'Nordic',
  'Southern',
  'Spanish',
  'Thai',
  'Vietnamese',
];

export function isSpoonacularCuisine(value: string): boolean {
  return SPOONACULAR_CUISINES.some(
    (c) => c.toLowerCase() === value.toLowerCase()
  );
}

/**
 * Llamada desde el navegador (componente cliente) a nuestra propia ruta
 * /api/spoonacular-cuisine, que es la que realmente esconde la API key y
 * habla con Spoonacular.
 */
export async function filterBySpoonacularCuisine(
  cuisine: string
): Promise<MealSummary[]> {
  const res = await fetch(
    `/api/spoonacular-cuisine?cuisine=${encodeURIComponent(cuisine)}`
  );

  if (!res.ok) {
    throw new Error(`La búsqueda en Spoonacular respondió ${res.status}`);
  }

  const data = (await res.json()) as {
    results?: { id: number; title: string; image?: string }[];
  };

  return (data.results ?? []).map((r) => ({
    id: `sp-${r.id}`,
    name: r.title,
    thumbnail: r.image ?? null,
    area: cuisine,
  }));
}

/**
 * Resumen de una receta de Spoonacular por id, llamado desde un componente
 * cliente (ej. la página de favoritos) a través de /api/spoonacular-recipe,
 * que es la que en el servidor le agrega la key a la petición real.
 */
export async function fetchSpoonacularMealSummary(
  id: string
): Promise<MealSummary | null> {
  const res = await fetch(`/api/spoonacular-recipe/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`La consulta a Spoonacular respondió ${res.status}`);
  }
  const meal = (await res.json()) as MealDetail;
  return {
    id: meal.id,
    name: meal.name,
    thumbnail: meal.thumbnail,
    category: meal.category,
    area: meal.area,
  };
}

function stripHtml(html: string | null | undefined): string | null {
  if (!html) return null;
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

interface SpoonacularNutrient {
  name: string;
  amount: number;
  unit: string;
}

/** Busca un nutriente por nombre (ej. "Calories", "Protein") y lo formatea como "123 g". */
function formatNutrient(
  nutrients: SpoonacularNutrient[],
  name: string
): string {
  const match = nutrients.find((n) => n.name === name);
  if (!match) return '—';
  return `${Math.round(match.amount)} ${match.unit}`;
}

/**
 * Convierte la lista plana de nutrientes que devuelve Spoonacular
 * (con includeNutrition=true) a los cinco valores que mostramos en la UI.
 * Devuelve undefined si Spoonacular no trajo datos de nutrición.
 */
function toNutritionInfo(
  nutrients: SpoonacularNutrient[] | undefined
): NutritionInfo | undefined {
  if (!nutrients || nutrients.length === 0) return undefined;

  return {
    calories: formatNutrient(nutrients, 'Calories'),
    carbs: formatNutrient(nutrients, 'Carbohydrates'),
    fat: formatNutrient(nutrients, 'Fat'),
    protein: formatNutrient(nutrients, 'Protein'),
    sodium: formatNutrient(nutrients, 'Sodium'),
  };
}

/**
 * Detalle de una receta de Spoonacular. Se llama desde un Server Component
 * (la página de detalle), así que la API key nunca viaja al navegador.
 */
export async function getSpoonacularMealById(
  id: string
): Promise<MealDetail | null> {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    throw new Error('Falta configurar SPOONACULAR_API_KEY');
  }

  const res = await fetch(
    `https://api.spoonacular.com/recipes/${encodeURIComponent(
      id
    )}/information?includeNutrition=true&apiKey=${apiKey}`,
    { next: { revalidate: 3600 } }
  );

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Spoonacular respondió ${res.status} para la receta ${id}`);
  }

  const data = (await res.json()) as {
    id: number;
    title: string;
    image?: string;
    cuisines?: string[];
    dishTypes?: string[];
    instructions?: string | null;
    sourceUrl?: string | null;
    extendedIngredients?: { nameClean?: string; name?: string; measures?: { us?: { amount?: number; unitShort?: string } } }[];
    nutrition?: { nutrients?: SpoonacularNutrient[] };
  };

  const ingredients: Ingredient[] = (data.extendedIngredients ?? []).map(
    (ing) => ({
      name: ing.nameClean ?? ing.name ?? '',
      measure: ing.measures?.us
        ? `${ing.measures.us.amount ?? ''} ${ing.measures.us.unitShort ?? ''}`.trim()
        : '',
    })
  );

  return {
    id: `sp-${data.id}`,
    name: data.title,
    thumbnail: data.image ?? null,
    category: data.dishTypes?.[0],
    area: data.cuisines?.[0],
    instructions: stripHtml(data.instructions),
    tags: data.dishTypes ?? [],
    youtubeUrl: null,
    sourceUrl: data.sourceUrl ?? null,
    ingredients,
    nutrition: toNutritionInfo(data.nutrition?.nutrients),
  };
}
