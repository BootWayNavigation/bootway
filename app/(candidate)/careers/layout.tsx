import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Not Found',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CareersLayout({
  children: _children,
}: {
  children: React.ReactNode;
}) {
  notFound();
}
