import type { Metadata } from 'next';
import { Fraunces, Work_Sans } from 'next/font/google';
import Header from '@/components/Header';
import './globals.css';

const display = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
});

const body = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Recetario — busca, mira, guarda',
  description:
    'Busca recetas por nombre, categoría o región, mira el paso a paso y guarda tus favoritas.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body>
        <Header />
        <main className="page">{children}</main>
        <footer className="site-footer">
          Datos de recetas cortesía de{' '}
          <a href="https://www.themealdb.com" target="_blank" rel="noreferrer">
            TheMealDB
          </a>
          .
          <p className="site-footer-credit">
            © 2026 All rights reserved · Designed &amp; built by Efraín Sebastián Rojas Artavia
          </p>
        </footer>
      </body>
    </html>
  );
}
