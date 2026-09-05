'use client';

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
  return (
    <div className="filter-bar">
      <select
        className="filter-select"
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        aria-label="Filtrar por categoría"
      >
        <option value="">Toda categoría</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        className="filter-select"
        value={area}
        onChange={(event) => onAreaChange(event.target.value)}
        aria-label="Filtrar por región"
      >
        <option value="">Toda región</option>
        {areas.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button type="button" className="filter-clear" onClick={onClear}>
          Quitar filtros
        </button>
      )}
    </div>
  );
}
