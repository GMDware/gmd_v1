import type { Metadata, Viewport } from 'next';
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'GMDware — Modern Software Engineering & Digital Platforms',
    template: '%s | GMDware',
  },
  description:
    'GMDware architects bespoke enterprise software, mission-critical distributed systems, and cinematic digital flagships.',
  keywords: [
    'Enterprise Software',
    'Systems Architecture',
    'Custom Web Platforms',
    'Digital Solutions',
    'Distributed Systems',
    'Cloud Engineering',
  ],
  authors: [{ name: 'GMDware Engineering' }],
  creator: 'GMDware',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gmdware.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'GMDware',
    title: 'GMDware — Modern Software Engineering & Digital Platforms',
    description:
      'GMDware architects bespoke enterprise software, mission-critical distributed systems, and cinematic digital flagships.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GMDware — Modern Software Engineering & Digital Platforms',
    description:
      'GMDware architects bespoke enterprise software, mission-critical distributed systems, and cinematic digital flagships.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#05070B',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-[#05080F] text-[#E2E8F0] min-h-screen antialiased selection:bg-[#0066FF] selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
