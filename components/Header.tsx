'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFavorites } from '@/hooks/useFavorites';

export default function Header() {
  const pathname = usePathname();
  const { favoriteIds, hydrated } = useFavorites();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand">
          <svg
            className="brand-mark"
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="15" cy="15" r="13" stroke="#232B1E" strokeWidth="2" />
            <path
              d="M9 15c0-3.3 2.7-6 6-6s6 2.7 6 6"
              stroke="#B23A28"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M9 15h12"
              stroke="#232B1E"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="brand-name">Recetario</span>
        </Link>
        <nav className="site-nav">
          <Link href="/" className={pathname === '/' ? 'active' : ''}>
            Buscar
          </Link>
          <Link
            href="/favorites"
            className={pathname === '/favorites' ? 'active' : ''}
          >
            Favoritas
            {hydrated && favoriteIds.length > 0 && (
              <span className="favorites-count">{favoriteIds.length}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
