'use client';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  return (
    <form
      className="search-row"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        type="search"
        className="search-input"
        placeholder="Buscar por nombre, ej. 'chicken curry'"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Buscar recetas por nombre"
      />
      <button type="submit" className="search-submit">
        Buscar
      </button>
    </form>
  );
}
