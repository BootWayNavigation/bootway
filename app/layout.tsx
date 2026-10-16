import type { Metadata } from 'next';
import React from 'react';
import Providers from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'BootWay | Indoor Navigation Startup, Jaipur',
    template: '%s',
  },
  description:
    'BootWay builds app-free indoor navigation for hospitals and campuses. Careers and HR portal for BootWay iNaaS Private Limited, Jaipur.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
