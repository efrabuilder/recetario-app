import type { Ingredient, NutritionInfo } from '@/types/meal';

/**
 * Límites de referencia general por porción (no son indicaciones médicas,
 * son valores orientativos típicos para una comida principal). Se usan para
 * darle un veredicto en palabras a los números que ya trae Spoonacular o
 * Edamam, en vez de mostrar solo la tabla de cifras sueltas.
 */
export const NUTRITION_LIMITS = {
  calories: { moderate: 400, high: 700 },
  carbs: { moderate: 30, high: 60 },
  fat: { moderate: 10, high: 25 },
  protein: { moderate: 10, high: 25 },
  sodium: { moderate: 400, high: 800 },
};

/**
 * Esta función solo devuelve claves de traducción (definidas en
 * lib/i18n/translations.ts), nunca texto final: quien la use decide en qué
 * idioma mostrarlas con t(key).
 */
export interface NutritionVerdict {
  labelKey: string;
  noteKeys: string[];
}

function parseAmount(value: string): number | null {
  const match = value.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

function levelFor(
  amount: number | null,
  limits: { moderate: number; high: number }
): 'baja' | 'moderada' | 'alta' | null {
  if (amount === null) return null;
  if (amount >= limits.high) return 'alta';
  if (amount >= limits.moderate) return 'moderada';
  return 'baja';
}

/**
 * Compara los valores reales (Spoonacular/Edamam) contra NUTRITION_LIMITS y
 * arma un veredicto. La proteína se lee al revés: "alta" es positivo.
 */
export function evaluateNutrition(nutrition: NutritionInfo): NutritionVerdict {
  const calories = parseAmount(nutrition.calories);
  const carbs = parseAmount(nutrition.carbs);
  const fat = parseAmount(nutrition.fat);
  const protein = parseAmount(nutrition.protein);
  const sodium = parseAmount(nutrition.sodium);

  const caloriesLevel = levelFor(calories, NUTRITION_LIMITS.calories);
  const fatLevel = levelFor(fat, NUTRITION_LIMITS.fat);
  const sodiumLevel = levelFor(sodium, NUTRITION_LIMITS.sodium);
  const proteinLevel = levelFor(protein, NUTRITION_LIMITS.protein);
  const carbsLevel = levelFor(carbs, NUTRITION_LIMITS.carbs);

  const noteKeys: string[] = [];
  if (caloriesLevel === 'alta') noteKeys.push('nutrition.note.highCalories');
  if (caloriesLevel === 'baja') noteKeys.push('nutrition.note.lowCalories');
  if (fatLevel === 'alta') noteKeys.push('nutrition.note.highFat');
  if (sodiumLevel === 'alta') noteKeys.push('nutrition.note.highSodium');
  if (proteinLevel === 'alta') noteKeys.push('nutrition.note.highProtein');
  if (carbsLevel === 'alta') noteKeys.push('nutrition.note.highCarbs');
  if (noteKeys.length === 0) noteKeys.push('nutrition.note.moderateDefault');

  const highCount = [caloriesLevel, fatLevel, sodiumLevel, carbsLevel].filter(
    (level) => level === 'alta'
  ).length;

  let labelKey: string;
  if (highCount >= 2) {
    labelKey = 'nutrition.verdict.caution';
  } else if (highCount === 1) {
    labelKey = 'nutrition.verdict.moderate';
  } else {
    labelKey = 'nutrition.verdict.balanced';
  }

  return { labelKey, noteKeys };
}

// Los ingredientes pueden venir en inglés (TheMealDB, Spoonacular, Edamam)
// o en español (recetas propias cargadas a mano): esto es sobre el IDIOMA
// DEL DATO, no el idioma de la interfaz, así que no usa el sistema de
// traducciones de la UI.
const VEGETABLE_KEYWORDS = [
  'onion', 'tomato', 'garlic', 'spinach', 'carrot', 'pepper', 'cabbage',
  'broccoli', 'lettuce', 'cucumber', 'zucchini', 'mushroom', 'pea', 'corn',
  'potato', 'kale', 'celery', 'squash', 'cauliflower',
  'cebolla', 'tomate', 'ajo', 'espinaca', 'zanahoria', 'chile', 'pimiento',
  'repollo', 'brócoli', 'lechuga', 'pepino', 'calabacín', 'hongo',
  'champiñón', 'arveja', 'guisante', 'elote', 'maíz', 'papa', 'patata',
  'col rizada', 'apio', 'ayote', 'calabaza', 'coliflor', 'yuca', 'culantro',
];

const LEAN_PROTEIN_KEYWORDS = [
  'chicken breast', 'chicken', 'fish', 'salmon', 'tuna', 'turkey', 'bean',
  'lentil', 'chickpea', 'tofu', 'egg',
  'pechuga de pollo', 'pollo', 'pescado', 'salmón', 'atún', 'pavo',
  'frijol', 'frijoles', 'lenteja', 'garbanzo', 'huevo', 'huevos',
];

const WHOLE_GRAIN_KEYWORDS = [
  'brown rice', 'oat', 'quinoa', 'whole wheat', 'whole grain',
  'arroz integral', 'avena', 'quinua', 'trigo integral',
];

const PROCESSED_KEYWORDS = [
  'bacon', 'sausage', 'ham', 'fried', 'butter', 'cream', 'sugar', 'syrup',
  'cheese', 'lard', 'processed', 'deep-fried',
  'tocino', 'chorizo', 'salchicha', 'jamón', 'frito', 'frita', 'mantequilla',
  'crema', 'azúcar', 'almíbar', 'queso', 'manteca', 'chicharrón',
  'leche condensada', 'leche evaporada',
];

function countMatches(ingredients: Ingredient[], keywords: string[]): number {
  const names = ingredients.map((i) => i.name.toLowerCase());
  return keywords.reduce(
    (total, keyword) => total + names.filter((name) => name.includes(keyword)).length,
    0
  );
}

/**
 * Solo cuenta ingredientes por categoría y devuelve una clave de veredicto;
 * el texto final (incluida la interpolación de {count}/{total}) lo arma
 * quien consuma esto, con t().
 */
export interface NutritionEstimate {
  labelKey: string;
  vegetables: number;
  leanProtein: number;
  wholeGrains: number;
  processed: number;
  total: number;
}

/**
 * Estimación aproximada cuando no hay nutrición real (típicamente recetas de
 * TheMealDB). No calcula calorías ni gramos: cuenta cuántos ingredientes caen
 * en categorías "saludables" vs. "menos saludables" y da un veredicto
 * cualitativo. Es una referencia orientativa, no un reemplazo de datos
 * nutricionales reales.
 */
export function estimateFromIngredients(ingredients: Ingredient[]): NutritionEstimate {
  const vegetables = countMatches(ingredients, VEGETABLE_KEYWORDS);
  const leanProtein = countMatches(ingredients, LEAN_PROTEIN_KEYWORDS);
  const wholeGrains = countMatches(ingredients, WHOLE_GRAIN_KEYWORDS);
  const processed = countMatches(ingredients, PROCESSED_KEYWORDS);

  const healthyPoints = vegetables + leanProtein * 1.5 + wholeGrains;
  const unhealthyPoints = processed * 1.5;
  const netScore = healthyPoints - unhealthyPoints;

  let labelKey: string;
  if (netScore >= 3) {
    labelKey = 'nutrition.estimate.balanced';
  } else if (netScore >= 0) {
    labelKey = 'nutrition.estimate.moderate';
  } else {
    labelKey = 'nutrition.estimate.caution';
  }

  return {
    labelKey,
    vegetables,
    leanProtein,
    wholeGrains,
    processed,
    total: ingredients.length,
  };
}
