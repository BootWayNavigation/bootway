import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers at BootWay | Indoor Navigation Startup, Jaipur',
  description:
    'Join a Jaipur startup building app-free indoor navigation for hospitals and campuses. See open roles at BootWay.',
  alternates: {
    canonical: 'https://www.bootway.in/careers',
  },
  openGraph: {
    title: 'Careers at BootWay | Indoor Navigation Startup, Jaipur',
    description:
      'Join a Jaipur startup building app-free indoor navigation for hospitals and campuses.',
    url: 'https://www.bootway.in/careers',
    siteName: 'BootWay',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
