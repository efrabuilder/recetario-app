export type Language = 'es' | 'en';

export const TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Header / navegación
  'nav.search': { es: 'Buscar', en: 'Search' },
  'nav.drinks': { es: 'Bebidas', en: 'Drinks' },
  'nav.favorites': { es: 'Favoritas', en: 'Favorites' },

  // Home
  'home.title': { es: 'Encontrá qué cocinar hoy', en: 'Find something to cook today' },
  'home.subtitle': {
    es: 'Buscá por nombre, filtrá por categoría o región, y guardá tus recetas favoritas para volver a ellas cuando quieras.',
    en: 'Search by name, filter by category or region, and save your favorite recipes to come back to whenever you want.',
  },
  'home.loading': { es: 'Buscando recetas…', en: 'Searching recipes…' },
  'home.errorTitle': { es: 'Algo salió mal', en: 'Something went wrong' },
  'home.errorMessage': {
    es: 'No pudimos cargar recetas ahora mismo. Probá de nuevo en un momento.',
    en: "We couldn't load recipes right now. Try again in a moment.",
  },
  'home.emptyTitle': { es: 'No encontramos recetas', en: 'No recipes found' },
  'home.emptyHint': {
    es: 'Probá con otro término de búsqueda o quitá los filtros.',
    en: 'Try a different search term or clear the filters.',
  },

  // Buscador
  'search.placeholder': {
    es: "Buscar por nombre, ej. 'chicken curry'",
    en: "Search by name, e.g. 'chicken curry'",
  },
  'search.label': { es: 'Buscar recetas por nombre', en: 'Search recipes by name' },
  'search.submit': { es: 'Buscar', en: 'Search' },

  // Filtros
  'filter.categoryLabel': { es: 'Filtrar por categoría', en: 'Filter by category' },
  'filter.areaLabel': { es: 'Filtrar por región', en: 'Filter by region' },
  'filter.allCategories': { es: 'Toda categoría', en: 'All categories' },
  'filter.allAreas': { es: 'Toda región', en: 'All regions' },
  'filter.clear': { es: 'Quitar filtros', en: 'Clear filters' },

  // Favoritas
  'favorites.title': { es: 'Tus recetas favoritas', en: 'Your favorite recipes' },
  'favorites.subtitle': {
    es: 'Se guardan en este navegador, así que van a seguir acá la próxima vez que entrés.',
    en: "They're saved in this browser, so they'll still be here next time you visit.",
  },
  'favorites.loading': { es: 'Cargando favoritas…', en: 'Loading favorites…' },
  'favorites.emptyTitle': {
    es: 'Todavía no guardaste ninguna receta',
    en: "You haven't saved any recipes yet",
  },
  'favorites.emptyHint': {
    es: 'Tocá el corazón en cualquier receta para verla acá.',
    en: 'Tap the heart on any recipe to see it here.',
  },

  // Botón de favorito
  'favoriteButton.add': { es: 'Guardar en favoritas', en: 'Save to favorites' },
  'favoriteButton.remove': { es: 'Quitar de favoritas', en: 'Remove from favorites' },
  'favoriteButton.saved': { es: 'En favoritas', en: 'In favorites' },

  // Bebidas
  'drinks.title': { es: 'Qué tomar hoy', en: 'What to drink today' },
  'drinks.subtitle': {
    es: 'Buscá bebidas por nombre o filtrá por categoría — de TheCocktailDB, la base hermana de TheMealDB.',
    en: 'Search drinks by name or filter by category — from TheCocktailDB, TheMealDB’s sister database.',
  },
  'drinks.loading': { es: 'Buscando bebidas…', en: 'Searching drinks…' },
  'drinks.errorMessage': {
    es: 'No pudimos cargar bebidas ahora mismo. Probá de nuevo en un momento.',
    en: "We couldn't load drinks right now. Try again in a moment.",
  },
  'drinks.emptyTitle': { es: 'No encontramos bebidas', en: 'No drinks found' },
  'drinks.emptyHint': {
    es: 'Probá con otro término de búsqueda o quitá los filtros.',
    en: 'Try a different search term or clear the filters.',
  },

  // Detalle de receta / bebida
  'recipe.backToSearch': { es: '← Volver a la búsqueda', en: '← Back to search' },
  'recipe.backToDrinks': { es: '← Volver a bebidas', en: '← Back to drinks' },
  'recipe.ingredients': { es: 'Ingredientes', en: 'Ingredients' },
  'recipe.preparation': { es: 'Preparación', en: 'Preparation' },
  'recipe.video': { es: 'Video', en: 'Video' },
  'recipe.viewOriginalSource': { es: 'Ver receta original', en: 'View original recipe' },
  'recipe.noInstructions': {
    es: 'Esta receta no tiene instrucciones cargadas.',
    en: "This recipe doesn't have instructions yet.",
  },
  'drink.noInstructions': {
    es: 'Esta bebida no tiene instrucciones cargadas.',
    en: "This drink doesn't have instructions yet.",
  },
  'recipe.translateAll': { es: 'Traducir todo al español', en: 'Translate everything to Spanish' },
  'recipe.translating': { es: 'Traduciendo…', en: 'Translating…' },
  'recipe.viewOriginalLang': { es: 'Ver original (inglés)', en: 'View original (English)' },
  'recipe.translateNote': {
    es: 'Traducción automática, puede no ser exacta.',
    en: 'Automatic translation, may not be exact.',
  },
  'recipe.translateError': {
    es: 'No se pudo traducir en este momento. El servicio de traducción es gratuito y a veces tiene límite de uso — probá de nuevo en un rato.',
    en: "Couldn't translate right now. The translation service is free and sometimes hits a usage limit — try again in a bit.",
  },

  // Páginas de "no encontrado"
  'notFound.recipeTitle': { es: 'No encontramos esa receta', en: "We couldn't find that recipe" },
  'notFound.recipeBody': {
    es: 'Puede que el enlace esté roto o la receta ya no exista.',
    en: 'The link might be broken or the recipe may no longer exist.',
  },
  'notFound.drinkTitle': { es: 'No encontramos esa bebida', en: "We couldn't find that drink" },
  'notFound.drinkBody': {
    es: 'Puede que el enlace esté roto o la bebida ya no exista.',
    en: 'The link might be broken or the drink may no longer exist.',
  },

  // Pie de página
  'footer.credit': { es: 'Datos de recetas cortesía de', en: 'Recipe data courtesy of' },

  // Nutrición
  'nutrition.title': { es: 'Valores nutricionales', en: 'Nutrition facts' },
  'nutrition.calories': { es: 'Calorías', en: 'Calories' },
  'nutrition.carbs': { es: 'Carbohidratos', en: 'Carbs' },
  'nutrition.fat': { es: 'Grasas', en: 'Fat' },
  'nutrition.protein': { es: 'Proteína', en: 'Protein' },
  'nutrition.sodium': { es: 'Sodio (sal)', en: 'Sodium (salt)' },
  'nutrition.perServing': { es: 'Valores estimados por porción.', en: 'Estimated values per serving.' },

  'nutrition.verdict.balanced': { es: 'Nutricionalmente equilibrada', en: 'Nutritionally balanced' },
  'nutrition.verdict.moderate': { es: 'Moderadamente nutritiva', en: 'Moderately nutritious' },
  'nutrition.verdict.caution': { es: 'Para consumir con moderación', en: 'Best enjoyed in moderation' },

  'nutrition.note.highCalories': { es: 'Alta en calorías para una porción', en: 'High in calories for a serving' },
  'nutrition.note.lowCalories': { es: 'Baja en calorías', en: 'Low in calories' },
  'nutrition.note.highFat': { es: 'Alta en grasas', en: 'High in fat' },
  'nutrition.note.highSodium': { es: 'Alta en sodio', en: 'High in sodium' },
  'nutrition.note.highProtein': { es: 'Buena fuente de proteína', en: 'Good source of protein' },
  'nutrition.note.highCarbs': { es: 'Alta en carbohidratos', en: 'High in carbs' },
  'nutrition.note.moderateDefault': {
    es: 'Valores dentro de un rango moderado',
    en: 'Values within a moderate range',
  },

  'nutrition.estimate.balanced': {
    es: 'Nutricionalmente equilibrada (estimado)',
    en: 'Nutritionally balanced (estimated)',
  },
  'nutrition.estimate.moderate': {
    es: 'Moderada, con espacio para mejorar (estimado)',
    en: 'Moderate, with room for improvement (estimated)',
  },
  'nutrition.estimate.caution': {
    es: 'Alta en ingredientes menos saludables (estimado)',
    en: 'High in less healthy ingredients (estimated)',
  },
  'nutrition.estimate.vegetables': { es: '{count} vegetal(es)', en: '{count} vegetable(s)' },
  'nutrition.estimate.leanProtein': {
    es: '{count} fuente(s) de proteína magra',
    en: '{count} lean protein source(s)',
  },
  'nutrition.estimate.wholeGrains': { es: '{count} grano(s) integral(es)', en: '{count} whole grain(s)' },
  'nutrition.estimate.processed': {
    es: '{count} ingrediente(s) procesado(s)/frito(s)',
    en: '{count} processed/fried ingredient(s)',
  },
  'nutrition.estimate.summaryWithParts': {
    es: 'Detectamos {parts} entre los {total} ingredientes.',
    en: 'We detected {parts} among the {total} ingredients.',
  },
  'nutrition.estimate.summaryNoParts': {
    es: 'No identificamos categorías claras entre los {total} ingredientes.',
    en: "We didn't identify clear categories among the {total} ingredients.",
  },
  'nutrition.estimate.disclaimer': {
    es: 'Esta receta no trae valores nutricionales reales. Esto es una estimación aproximada según sus ingredientes, no un cálculo de calorías o gramos exacto.',
    en: "This recipe doesn't come with real nutrition data. This is a rough estimate based on its ingredients, not an exact calorie or gram calculation.",
  },
  'nutrition.estimate.notEnoughIngredients': {
    es: 'No hay ingredientes suficientes para estimar qué tan nutritiva es esta receta.',
    en: "There aren't enough ingredients to estimate how nutritious this recipe is.",
  },
};

/** Reemplaza placeholders {nombre} en el texto con los valores dados. */
export function interpolate(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text;
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.split(`{${key}}`).join(String(value)),
    text
  );
}
