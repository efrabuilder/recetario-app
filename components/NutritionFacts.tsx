import type { Ingredient, NutritionInfo } from '@/types/meal';
import { estimateFromIngredients, evaluateNutrition } from '@/lib/nutritionAnalyzer';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface NutritionFactsProps {
  nutrition: NutritionInfo | undefined;
  ingredients: Ingredient[];
}

function RealNutrition({ nutrition }: { nutrition: NutritionInfo }) {
  const { t } = useLanguage();
  const verdict = evaluateNutrition(nutrition);

  const rows = [
    { label: t('nutrition.calories'), value: nutrition.calories },
    { label: t('nutrition.carbs'), value: nutrition.carbs },
    { label: t('nutrition.fat'), value: nutrition.fat },
    { label: t('nutrition.protein'), value: nutrition.protein },
    { label: t('nutrition.sodium'), value: nutrition.sodium },
  ];

  return (
    <>
      <p className="nutrition-verdict">{t(verdict.labelKey)}</p>
      <ul className="nutrition-list">
        {rows.map((row) => (
          <li key={row.label}>
            <span>{row.label}</span>
            <span className="nutrition-value">{row.value}</span>
          </li>
        ))}
      </ul>
      <ul className="nutrition-analysis-notes">
        {verdict.noteKeys.map((key) => (
          <li key={key}>{t(key)}</li>
        ))}
      </ul>
      <p className="nutrition-note">{t('nutrition.perServing')}</p>
    </>
  );
}

function EstimatedNutrition({ ingredients }: { ingredients: Ingredient[] }) {
  const { t } = useLanguage();

  if (ingredients.length === 0) {
    return (
      <p className="nutrition-unavailable">
        {t('nutrition.estimate.notEnoughIngredients')}
      </p>
    );
  }

  const estimate = estimateFromIngredients(ingredients);

  const parts: string[] = [];
  if (estimate.vegetables > 0) {
    parts.push(t('nutrition.estimate.vegetables', { count: estimate.vegetables }));
  }
  if (estimate.leanProtein > 0) {
    parts.push(t('nutrition.estimate.leanProtein', { count: estimate.leanProtein }));
  }
  if (estimate.wholeGrains > 0) {
    parts.push(t('nutrition.estimate.wholeGrains', { count: estimate.wholeGrains }));
  }
  if (estimate.processed > 0) {
    parts.push(t('nutrition.estimate.processed', { count: estimate.processed }));
  }

  const summary =
    parts.length > 0
      ? t('nutrition.estimate.summaryWithParts', { parts: parts.join(', '), total: estimate.total })
      : t('nutrition.estimate.summaryNoParts', { total: estimate.total });

  return (
    <>
      <p className="nutrition-verdict">{t(estimate.labelKey)}</p>
      <p className="nutrition-analysis-summary">{summary}</p>
      <p className="nutrition-disclaimer">{t('nutrition.estimate.disclaimer')}</p>
    </>
  );
}

export default function NutritionFacts({ nutrition, ingredients }: NutritionFactsProps) {
  const { t } = useLanguage();

  return (
    <div className="nutrition-facts">
      <h2>{t('nutrition.title')}</h2>
      {nutrition ? (
        <RealNutrition nutrition={nutrition} />
      ) : (
        <EstimatedNutrition ingredients={ingredients} />
      )}
    </div>
  );
}
