import { notFound } from 'next/navigation';
import { getMealById, toYoutubeEmbedUrl } from '@/lib/mealdb';
import { getSpoonacularMealById } from '@/lib/spoonacular';
import { getEdamamMealById, isEdamamId, stripEdamamPrefix } from '@/lib/edamam';
import {
  getCustomRecipeById,
  isCustomRecipeId,
  stripCustomPrefix,
} from '@/lib/customRecipes';
import RecipeDetail from '@/components/RecipeDetail';
import type { MealDetail } from '@/types/meal';

interface RecipePageProps {
  params: { id: string };
}

const SPOONACULAR_PREFIX = 'sp-';

function resolveMeal(id: string): Promise<MealDetail | null> {
  if (id.startsWith(SPOONACULAR_PREFIX)) {
    return getSpoonacularMealById(id.slice(SPOONACULAR_PREFIX.length)).catch(() => null);
  }
  if (isEdamamId(id)) {
    return getEdamamMealById(stripEdamamPrefix(id)).catch(() => null);
  }
  if (isCustomRecipeId(id)) {
    return getCustomRecipeById(stripCustomPrefix(id)).catch(() => null);
  }
  return getMealById(id).catch(() => null);
}

export default async function RecipePage({ params }: RecipePageProps) {
  const meal = await resolveMeal(params.id);

  if (!meal) {
    notFound();
  }

  const embedUrl = meal.youtubeUrl ? toYoutubeEmbedUrl(meal.youtubeUrl) : null;

  return (
    <RecipeDetail
      meal={meal}
      translatable={!isCustomRecipeId(params.id)}
      embedUrl={embedUrl}
    />
  );
}
