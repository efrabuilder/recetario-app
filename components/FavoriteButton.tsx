'use client';

import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  mealId: string;
  variant?: 'icon' | 'inline';
}

export default function FavoriteButton({
  mealId,
  variant = 'icon',
}: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(mealId);

  const handleClick = (event: React.MouseEvent) => {
    // Evita que el click "suba" hasta el <Link> de la tarjeta y navegue.
    event.preventDefault();
    event.stopPropagation();
    toggle(mealId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`favorite-button ${variant === 'inline' ? 'is-inline' : ''} ${
        active ? 'is-active' : ''
      }`}
      aria-pressed={active}
      aria-label={active ? 'Quitar de favoritas' : 'Guardar en favoritas'}
    >
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'}>
        <path
          d="M12 20s-7.5-4.6-10-9.1C.4 7.6 2 4 5.6 4c2 0 3.5 1.1 4.4 2.7C10.9 5.1 12.4 4 14.4 4 18 4 19.6 7.6 22 10.9 19.5 15.4 12 20 12 20z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
      {variant === 'inline' && (active ? 'En favoritas' : 'Guardar en favoritas')}
    </button>
  );
}
