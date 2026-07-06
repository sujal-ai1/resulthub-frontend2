import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Profile — Result Hub',
  description:
    'Your personal Result Hub profile — saved roll number, quick links to your DTU or NSUT results, wrapped, and academic twin.',
  alternates: { canonical: 'https://www.resulthubnsut.com/profile' },
  robots: { index: false, follow: true },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
