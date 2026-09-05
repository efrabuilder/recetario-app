import type { MealSummary } from '@/types/meal';
import RecipeCard from './RecipeCard';

interface RecipeGridProps {
  meals: MealSummary[];
  emptyTitle?: string;
  emptyHint?: string;
}

export default function RecipeGrid({
  meals,
  emptyTitle = 'No encontramos recetas',
  emptyHint = 'Probá con otro término de búsqueda o quitá los filtros.',
}: RecipeGridProps) {
  if (meals.length === 0) {
    return (
      <div className="state-message">
        <strong>{emptyTitle}</strong>
        {emptyHint}
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
