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

export interface NutritionVerdict {
  label: string;
  notes: string[];
}

function parseAmount(value: string): number | null {
  const match = value.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

function levelFor(amount: number | null, limits: { moderate: number; high: number }): 'baja' | 'moderada' | 'alta' | null {
  if (amount === null) return null;
  if (amount >= limits.high) return 'alta';
  if (amount >= limits.moderate) return 'moderada';
  return 'baja';
}

/**
 * Compara los valores reales (Spoonacular/Edamam) contra NUTRITION_LIMITS y
 * arma un veredicto en palabras. La proteína se lee al revés: "alta" es
 * positivo, no una alerta.
 */
export function evaluateNutrition(nutrition: NutritionInfo): NutritionVerdict {
  const calories = parseAmount(nutrition.calories);
  const carbs = parseAmount(nutrition.carbs);
  const fat = parseAmount(nutrition.fat);
  const protein = parseAmount(nutrition.protein);
  const sodium = parseAmount(nutrition.sodium);

  const notes: string[] = [];

  const caloriesLevel = levelFor(calories, NUTRITION_LIMITS.calories);
  if (caloriesLevel === 'alta') notes.push('Alta en calorías para una porción');
  if (caloriesLevel === 'baja') notes.push('Baja en calorías');

  const fatLevel = levelFor(fat, NUTRITION_LIMITS.fat);
  if (fatLevel === 'alta') notes.push('Alta en grasas');

  const sodiumLevel = levelFor(sodium, NUTRITION_LIMITS.sodium);
  if (sodiumLevel === 'alta') notes.push('Alta en sodio');

  const proteinLevel = levelFor(protein, NUTRITION_LIMITS.protein);
  if (proteinLevel === 'alta') notes.push('Buena fuente de proteína');

  const carbsLevel = levelFor(carbs, NUTRITION_LIMITS.carbs);
  if (carbsLevel === 'alta') notes.push('Alta en carbohidratos');

  if (notes.length === 0) {
    notes.push('Valores dentro de un rango moderado');
  }

  const highCount = [caloriesLevel, fatLevel, sodiumLevel, carbsLevel].filter(
    (level) => level === 'alta'
  ).length;

  let label: string;
  if (highCount >= 2) {
    label = 'Para consumir con moderación';
  } else if (highCount === 1) {
    label = 'Moderadamente nutritiva';
  } else {
    label = 'Nutricionalmente equilibrada';
  }

  return { label, notes };
}

const VEGETABLE_KEYWORDS = [
  'onion', 'tomato', 'garlic', 'spinach', 'carrot', 'pepper', 'cabbage',
  'broccoli', 'lettuce', 'cucumber', 'zucchini', 'mushroom', 'pea', 'corn',
  'potato', 'kale', 'celery', 'squash', 'cauliflower',
];

const LEAN_PROTEIN_KEYWORDS = [
  'chicken breast', 'chicken', 'fish', 'salmon', 'tuna', 'turkey', 'bean',
  'lentil', 'chickpea', 'tofu', 'egg',
];

const WHOLE_GRAIN_KEYWORDS = ['brown rice', 'oat', 'quinoa', 'whole wheat', 'whole grain'];

const PROCESSED_KEYWORDS = [
  'bacon', 'sausage', 'ham', 'fried', 'butter', 'cream', 'sugar', 'syrup',
  'cheese', 'lard', 'processed', 'deep-fried',
];

function countMatches(ingredients: Ingredient[], keywords: string[]): number {
  const names = ingredients.map((i) => i.name.toLowerCase());
  return keywords.reduce(
    (total, keyword) => total + names.filter((name) => name.includes(keyword)).length,
    0
  );
}

export interface NutritionEstimate {
  label: string;
  summary: string;
  vegetables: number;
  leanProtein: number;
  wholeGrains: number;
  processed: number;
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

  let label: string;
  if (netScore >= 3) {
    label = 'Nutricionalmente equilibrada (estimado)';
  } else if (netScore >= 0) {
    label = 'Moderada, con espacio para mejorar (estimado)';
  } else {
    label = 'Alta en ingredientes menos saludables (estimado)';
  }

  const parts: string[] = [];
  if (vegetables > 0) parts.push(`${vegetables} vegetal(es)`);
  if (leanProtein > 0) parts.push(`${leanProtein} fuente(s) de proteína magra`);
  if (wholeGrains > 0) parts.push(`${wholeGrains} grano(s) integral(es)`);
  if (processed > 0) parts.push(`${processed} ingrediente(s) procesado(s)/frito(s)`);

  const summary =
    parts.length > 0
      ? `Detectamos ${parts.join(', ')} entre los ${ingredients.length} ingredientes.`
      : `No identificamos categorías claras entre los ${ingredients.length} ingredientes.`;

  return { label, summary, vegetables, leanProtein, wholeGrains, processed };
}
