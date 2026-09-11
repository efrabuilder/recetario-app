'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';
import NutritionFacts from '@/components/NutritionFacts';
import { translateToSpanish } from '@/lib/translate';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { translateArea, translateCategory } from '@/lib/mealdbTranslations';
import type { MealDetail } from '@/types/meal';

interface RecipeDetailProps {
  meal: MealDetail;
  // false para recetas propias: esas ya están cargadas en español, así que
  // no hace falta traducir nada al cambiar el idioma.
  translatable: boolean;
  embedUrl: string | null;
}

export default function RecipeDetail({ meal, translatable, embedUrl }: RecipeDetailProps) {
  const { t, language } = useLanguage();
  const [translated, setTranslated] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const displayed = translated ?? meal;

  // Contenido bilingüe nativo (escrito a mano en ambos idiomas, ver
  // meal.instructionsEn): no depende de la API de traducción, cambia al
  // instante con el selector ES/EN del header.
  const displayedInstructions =
    !translatable && language === 'en' && meal.instructionsEn
      ? meal.instructionsEn
      : displayed.instructions;

  const instructionSteps = displayedInstructions
    ? displayedInstructions
        .split('\n')
        .map((step) => step.trim())
        .filter(Boolean)
    : [];

  // El selector ES/EN del header es ahora el único control: al pasar a
  // español se traduce nombre + ingredientes + instrucciones (contenido
  // libre que las APIs solo entregan en inglés); al volver a inglés se
  // muestra el original. Ya no depende de un botón aparte. Esto solo aplica
  // a recetas de API (translatable=true); las propias usan instructionsEn
  // de arriba, sin llamar a ninguna API.
  useEffect(() => {
    if (!translatable) return;

    if (language !== 'es') {
      setTranslated(null);
      setHasError(false);
      return;
    }

    let cancelled = false;
    setHasError(false);
    setLoading(true);

    const ingredientNames = meal.ingredients.map((ingredient) => ingredient.name);
    const textsToTranslate = meal.instructions
      ? [meal.name, ...ingredientNames, meal.instructions]
      : [meal.name, ...ingredientNames];

    Promise.all(textsToTranslate.map((text) => translateToSpanish(text)))
      .then((results) => {
        if (cancelled) return;

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
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, translatable, meal.id]);

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
            {displayed.category && (
              <span className="tag-pill">{translateCategory(displayed.category, language)}</span>
            )}
            {displayed.area && (
              <span className="tag-pill">{translateArea(displayed.area, language)}</span>
            )}
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

      {translatable && loading && (
        <p className="translate-note">{t('recipe.translating')}</p>
      )}
      {translatable && translated && !loading && (
        <p className="translate-note">{t('recipe.translateNote')}</p>
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
          {instructionSteps.length > 0 ? (
            <ol className="instructions-steps">
              {instructionSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
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
