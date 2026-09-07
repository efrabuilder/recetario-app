'use client';

import type { MealSummary } from '@/types/meal';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import RecipeCard from './RecipeCard';

interface RecipeGridProps {
  meals: MealSummary[];
  emptyTitle?: string;
  emptyHint?: string;
}

export default function RecipeGrid({ meals, emptyTitle, emptyHint }: RecipeGridProps) {
  const { t } = useLanguage();

  if (meals.length === 0) {
    return (
      <div className="state-message">
        <strong>{emptyTitle ?? t('home.emptyTitle')}</strong>
        {emptyHint ?? t('home.emptyHint')}
      </div>
    );
  }

  return (
    <div className="recipe-grid">
      {meals.map((meal) => (
        <RecipeCard key={meal.id} meal={meal} />
      ))}
    </div>
  );
}
