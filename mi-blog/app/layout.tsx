import './globals.css';
import { ReactNode } from 'react';
import { Providers } from './providers';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Mi Blog',
  description: 'Blog con autenticación social y Markdown',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
