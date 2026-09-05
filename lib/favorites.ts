const STORAGE_KEY = 'recetas-app:favorites';

function readRaw(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    // localStorage corrupto o inaccesible (modo privado, cuota, etc.) -> tratamos como vacío
    return [];
  }
}

function writeRaw(ids: string[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  // Avisamos a otras pestañas/componentes montados en la misma página.
  window.dispatchEvent(new CustomEvent('recetas-app:favorites-changed'));
}

export function getFavoriteIds(): string[] {
  return readRaw();
}

export function isFavorite(id: string): boolean {
  return readRaw().includes(id);
}

export function addFavorite(id: string): void {
  const current = readRaw();
  if (!current.includes(id)) {
    writeRaw([...current, id]);
  }
}

export function removeFavorite(id: string): void {
  writeRaw(readRaw().filter((existing) => existing !== id));
}

export function toggleFavorite(id: string): boolean {
  const isNowFavorite = !isFavorite(id);
  if (isNowFavorite) {
    addFavorite(id);
  } else {
    removeFavorite(id);
  }
  return isNowFavorite;
}

export const FAVORITES_EVENT = 'recetas-app:favorites-changed';
