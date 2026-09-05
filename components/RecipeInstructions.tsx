'use client';

import { useState } from 'react';
import { translateToSpanish } from '@/lib/translate';

export default function RecipeInstructions({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState(text);
  const [isTranslated, setIsTranslated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    setError(null);

    if (isTranslated) {
      setDisplayedText(text);
      setIsTranslated(false);
      return;
    }

    setLoading(true);
    try {
      const translated = await translateToSpanish(text);
      setDisplayedText(translated);
      setIsTranslated(true);
    } catch {
      setError(
        'No se pudo traducir en este momento. El servicio de traducción es gratuito y a veces tiene límite de uso — probá de nuevo en un rato.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="instructions-toolbar">
        <button
          type="button"
          className="translate-button"
          onClick={handleToggle}
          disabled={loading}
        >
          {loading
            ? 'Traduciendo…'
            : isTranslated
              ? 'Ver instrucciones originales (inglés)'
              : 'Traducir al español'}
        </button>
        {isTranslated && !loading && (
          <span className="translate-note">
            Traducción automática, puede no ser exacta.
          </span>
        )}
      </div>
      {error && <p className="translate-error">{error}</p>}
      <p className="instructions">{displayedText}</p>
    </div>
  );
}
