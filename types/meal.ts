// Forma "cruda" tal como la devuelve TheMealDB: strIngredient1..20 / strMeasure1..20
// en vez de un arreglo. La normalizamos en lib/mealdb.ts a algo más cómodo de usar.
export interface RawMeal {
  idMeal: string;
  strMeal: string;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strMealThumb: string | null;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  [key: `strIngredient${number}`]: string | null | undefined;
  [key: `strMeasure${number}`]: string | null | undefined;
}

export interface Ingredient {
  name: string;
  measure: string;
}

// Forma resumida que usamos en tarjetas / grillas (búsqueda, filtro, favoritos)
export interface MealSummary {
  id: string;
  name: string;
  thumbnail: string | null;
  category?: string;
}

// Forma completa que usamos en la página de detalle
export interface MealDetail extends MealSummary {
  area: string | null;
  instructions: string | null;
  tags: string[];
  youtubeUrl: string | null;
  sourceUrl: string | null;
  ingredients: Ingredient[];
}

export interface MealDbCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}
