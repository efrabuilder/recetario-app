'use client';

import { useEffect, useState } from 'react';
import { translateToSpanish } from '@/lib/translate';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function RecipeInstructions({ text }: { text: string }) {
  const { language, t } = useLanguage();
  const [displayedText, setDisplayedText] = useState(text);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Igual que en RecipeDetail: el selector ES/EN del header es el único
  // control. En español se traduce la instrucción (viene en inglés desde
  // TheCocktailDB); en inglés se muestra el texto original.
  useEffect(() => {
    if (language !== 'es') {
      setDisplayedText(text);
      setError(null);
      return;
    }

    let cancelled = false;
    setError(null);
    setLoading(true);

    translateToSpanish(text)
      .then((translated) => {
        if (!cancelled) setDisplayedText(translated);
      })
      .catch(() => {
        if (!cancelled) {
          setError(t('recipe.translateError'));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [language, text, t]);

  return (
    <div>
      {loading && <p className="translate-note">{t('recipe.translating')}</p>}
      {!loading && !error && language === 'es' && (
        <p className="translate-note">{t('recipe.translateNote')}</p>
      )}
      {error && <p className="translate-error">{error}</p>}
      <p className="instructions">{displayedText}</p>
    </div>
  );
}
