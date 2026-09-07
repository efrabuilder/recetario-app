'use client';

import { useState } from 'react';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';
import NutritionFacts from '@/components/NutritionFacts';
import { translateToSpanish } from '@/lib/translate';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { MealDetail } from '@/types/meal';

interface RecipeDetailProps {
  meal: MealDetail;
  // false para recetas propias: esas ya están cargadas en español, así que
  // no tiene sentido ofrecer el botón de traducir.
  translatable: boolean;
  embedUrl: string | null;
}

export default function RecipeDetail({ meal, translatable, embedUrl }: RecipeDetailProps) {
  const { t } = useLanguage();
  const [translated, setTranslated] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const displayed = translated ?? meal;

  async function handleToggle() {
    setHasError(false);

    if (translated) {
      setTranslated(null);
      return;
    }

    setLoading(true);

    const ingredientNames = meal.ingredients.map((ingredient) => ingredient.name);
    const textsToTranslate = meal.instructions
      ? [meal.name, ...ingredientNames, meal.instructions]
      : [meal.name, ...ingredientNames];

    try {
      const results = await Promise.all(
        textsToTranslate.map((text) => translateToSpanish(text))
      );

      const [translatedName, ...rest] = results;
      const translatedIngredientNames = rest.slice(0, ingredientNames.length);
      const translatedInstructions = meal.instructions
        ? rest[ingredientNames.length]
        : null;

      setTranslated({
        ...meal,
        name: translatedName,
        ingredients: meal.ingredients.map((ingredient, index) => ({
          ...ingredient,
          name: translatedIngredientNames[index] ?? ingredient.name,
        })),
        instructions: translatedInstructions,
      });
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <article>
      <Link href="/" className="back-link">
        {t('recipe.backToSearch')}
      </Link>

      <div className="recipe-detail-header">
        {displayed.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displayed.thumbnail}
            alt={displayed.name}
            className="recipe-detail-image"
          />
        )}
        <div>
          <div className="recipe-detail-meta">
            {displayed.category && <span className="tag-pill">{displayed.category}</span>}
            {displayed.area && <span className="tag-pill">{displayed.area}</span>}
            {displayed.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
          <h1>{displayed.name}</h1>
          <div className="recipe-detail-actions">
            <FavoriteButton mealId={meal.id} variant="inline" />
            {meal.sourceUrl && (
              <a
                href={meal.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="source-link"
              >
                {t('recipe.viewOriginalSource')}
              </a>
            )}
          </div>
        </div>
      </div>

      {translatable && (
        <div className="instructions-toolbar">
          <button
            type="button"
            className="translate-button"
            onClick={handleToggle}
            disabled={loading}
          >
            {loading
              ? t('recipe.translating')
              : translated
                ? t('recipe.viewOriginalLang')
                : t('recipe.translateAll')}
          </button>
          {translated && !loading && (
            <span className="translate-note">{t('recipe.translateNote')}</span>
          )}
        </div>
      )}
      {hasError && <p className="translate-error">{t('recipe.translateError')}</p>}

      <div className="recipe-detail-body">
        <div>
          <h2>{t('recipe.ingredients')}</h2>
          <ul className="ingredient-list">
            {displayed.ingredients.map((ing, index) => (
              <li key={`${ing.name}-${index}`}>
                <span>{ing.name}</span>
                <span className="ingredient-measure">{ing.measure}</span>
              </li>
            ))}
          </ul>

          <NutritionFacts nutrition={meal.nutrition} ingredients={displayed.ingredients} />
        </div>

        <div>
          <h2>{t('recipe.preparation')}</h2>
          {displayed.instructions ? (
            <p className="instructions">{displayed.instructions}</p>
          ) : (
            <p className="instructions">{t('recipe.noInstructions')}</p>
          )}

          {embedUrl && (
            <div className="video-embed">
              <h2>{t('recipe.video')}</h2>
              <iframe
                src={embedUrl}
                title={displayed.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
