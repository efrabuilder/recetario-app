import type { Metadata } from 'next';
import { Fraunces, Work_Sans } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
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
        <Providers>
          <Header />
          <main className="page">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
