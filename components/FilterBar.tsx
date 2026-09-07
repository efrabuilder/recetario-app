'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { translateArea, translateCategory } from '@/lib/mealdbTranslations';

interface FilterBarProps {
  categories: string[];
  areas: string[];
  category: string;
  area: string;
  onCategoryChange: (value: string) => void;
  onAreaChange: (value: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export default function FilterBar({
  categories,
  areas,
  category,
  area,
  onCategoryChange,
  onAreaChange,
  onClear,
  hasActiveFilters,
}: FilterBarProps) {
  const { t, language } = useLanguage();

  return (
    <div className="filter-bar">
      <select
        className="filter-select"
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        aria-label={t('filter.categoryLabel')}
      >
        <option value="">{t('filter.allCategories')}</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {translateCategory(c, language)}
          </option>
        ))}
      </select>

      <select
        className="filter-select"
        value={area}
        onChange={(event) => onAreaChange(event.target.value)}
        aria-label={t('filter.areaLabel')}
      >
        <option value="">{t('filter.allAreas')}</option>
        {areas.map((a) => (
          <option key={a} value={a}>
            {translateArea(a, language)}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button type="button" className="filter-clear" onClick={onClear}>
          {t('filter.clear')}
        </button>
      )}
    </div>
  );
}
