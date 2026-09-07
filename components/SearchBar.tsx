'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  const { t } = useLanguage();

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
        placeholder={t('search.placeholder')}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={t('search.label')}
      />
      <button type="submit" className="search-submit">
        {t('search.submit')}
      </button>
    </form>
  );
}
