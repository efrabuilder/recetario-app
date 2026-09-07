'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      {t('footer.credit')}{' '}
      <a href="https://www.themealdb.com" target="_blank" rel="noreferrer">
        TheMealDB
      </a>
      .
      <p className="site-footer-credit">
        © 2026 All rights reserved · Designed &amp; built by Efraín Sebastián Rojas Artavia
      </p>
    </footer>
  );
}
