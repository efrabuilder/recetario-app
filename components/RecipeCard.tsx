'use client';

import Link from 'next/link';
import type { MealSummary } from '@/types/meal';
import FavoriteButton from './FavoriteButton';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { translateCategory } from '@/lib/mealdbTranslations';

const DRINK_PREFIX = 'drink-';

export default function RecipeCard({ meal }: { meal: MealSummary }) {
  const { language } = useLanguage();
  const href = meal.id.startsWith(DRINK_PREFIX)
    ? `/drink/${meal.id.slice(DRINK_PREFIX.length)}`
    : `/recipe/${meal.id}`;

  return (
    <Link href={href} className="recipe-card" prefetch={false}>
      <FavoriteButton mealId={meal.id} />
      <div className="recipe-card-image-wrap">
        {meal.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={meal.thumbnail} alt={meal.name} loading="lazy" />
        )}
      </div>
      <div className="recipe-card-body">
        {meal.category && (
          <div className="recipe-card-category">
            {translateCategory(meal.category, language)}
          </div>
        )}
        <h3 className="recipe-card-name">{meal.name}</h3>
      </div>
    </Link>
  );
}
