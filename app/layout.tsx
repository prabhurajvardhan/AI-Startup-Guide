import type {Metadata} from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css'; // Global styles
import { Tracker } from '@/components/Tracker';
import { Navbar } from '@/components/Navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'The ML Engineer Kit | Nanoware AI',
  description: 'Stop consuming ML. Start becoming an ML Engineer with curated sources, practice missions, and open-source labs.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased bg-neutral-950 text-neutral-50 selection:bg-indigo-500/30" suppressHydrationWarning>
        <Tracker />
        <Navbar clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || ''} />
        {children}
      </body>
    </html>
  );
}
