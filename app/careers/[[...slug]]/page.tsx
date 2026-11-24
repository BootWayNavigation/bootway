import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Not Found',
  robots: {
    index: false,
    follow: false,
  },
};

/** /careers and /careers/* always 404 — not a public endpoint. */
export default function CareersGone() {
  notFound();
}
