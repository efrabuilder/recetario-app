/**
 * TheMealDB, Spoonacular y Edamam usan un conjunto FIJO y conocido de
 * categorías y países/cocinas (no cambian). Por eso esto es un diccionario
 * estático, no una llamada a un servicio de traducción: es instantáneo y no
 * gasta cuota de ninguna API. Los nombres de las recetas en sí (que sí varían
 * infinito) siguen traduciéndose bajo demanda con el botón de la página de
 * detalle.
 */

const CATEGORY_ES: Record<string, string> = {
  Beef: 'Res',
  Breakfast: 'Desayuno',
  Chicken: 'Pollo',
  Dessert: 'Postre',
  Goat: 'Cabra',
  Lamb: 'Cordero',
  Miscellaneous: 'Variado',
  Pasta: 'Pasta',
  Pork: 'Cerdo',
  Seafood: 'Mariscos',
  Side: 'Guarnición',
  Starter: 'Entrada',
  Vegan: 'Vegano',
  Vegetarian: 'Vegetariano',
};

const AREA_ES: Record<string, string> = {
  American: 'Estadounidense',
  Asian: 'Asiática',
  British: 'Británica',
  Canadian: 'Canadiense',
  Caribbean: 'Caribeña',
  'Central Europe': 'Europa Central',
  Chinese: 'China',
  'Costa Rican': 'Costarricense',
  Croatian: 'Croata',
  Dutch: 'Neerlandesa',
  'Eastern Europe': 'Europa del Este',
  Egyptian: 'Egipcia',
  Filipino: 'Filipina',
  French: 'Francesa',
  Greek: 'Griega',
  Indian: 'India',
  Irish: 'Irlandesa',
  Italian: 'Italiana',
  Jamaican: 'Jamaicana',
  Japanese: 'Japonesa',
  Kenyan: 'Keniana',
  Kosher: 'Kosher',
  Malaysian: 'Malasia',
  Mediterranean: 'Mediterránea',
  'Middle Eastern': 'Medio Oriente',
  Mexican: 'Mexicana',
  Moroccan: 'Marroquí',
  Nordic: 'Nórdica',
  Polish: 'Polaca',
  Portuguese: 'Portuguesa',
  Russian: 'Rusa',
  'South American': 'Sudamericana',
  'South East Asian': 'Sudeste asiático',
  Spanish: 'Española',
  Thai: 'Tailandesa',
  Tunisian: 'Tunecina',
  Turkish: 'Turca',
  Ukrainian: 'Ucraniana',
  Uruguayan: 'Uruguaya',
  Vietnamese: 'Vietnamita',
};

import type { Language } from '@/lib/i18n/translations';

/**
 * Traduce una categoría al español si el idioma activo es 'es' y existe en
 * el diccionario. En inglés, o si no está mapeada (ej. una categoría de una
 * receta propia que ya viene en español, como "Desayuno"), devuelve el
 * valor tal cual.
 */
export function translateCategory(category: string, language: Language): string {
  if (language !== 'es') return category;
  return CATEGORY_ES[category] ?? category;
}

/** Igual que translateCategory, pero para el país/región. */
export function translateArea(area: string, language: Language): string {
  if (language !== 'es') return area;
  return AREA_ES[area] ?? area;
}
