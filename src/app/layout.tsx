import type { Metadata } from 'next';
import { Amiri, Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider';

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri-next',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter-next',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://meeladfest.com'),
  title: {
    default: 'MeeladFest - Multi-Tenant Madrasa Fest Management Platform',
    template: '%s | MeeladFest',
  },
  description: 'Manage Meelad Fest competitions, participants, live results, updates, and certificates seamlessly.',
  keywords: [
    'Meelad Fest',
    'Madrasa Competition Platform',
    'Live Scoreboard',
    'Malayalam Fest Results',
    'Meelad Competition Leaderboard',
    'Certificate Verification Engine',
  ],
  authors: [{ name: 'MeeladFest Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://meeladfest.com',
    title: 'MeeladFest - Multi-Tenant Madrasa Fest Management Platform',
    description: 'Manage Meelad Fest competitions, participants, live results, updates, and certificates.',
    siteName: 'MeeladFest',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MeeladFest - Multi-Tenant Madrasa Fest Management Platform',
    description: 'Manage Meelad Fest competitions, participants, live results, updates, and certificates.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${amiri.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-text-dark font-inter">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

