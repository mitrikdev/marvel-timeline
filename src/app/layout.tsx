import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Marvel Atlas — Follow the thread',
  description:
    'Explore 77 Marvel films across cinematic universes. Follow characters, discover crossovers, and trace the connections through movie history.',
  applicationName: 'Marvel Atlas',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
