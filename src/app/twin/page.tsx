import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Academic Twin — Find Your DTU & NSUT Match',
  description:
    'Find your academic twin on Result Hub — the DTU, NSUT or IGDTUW student whose grades most closely mirror yours across semesters.',
  alternates: { canonical: 'https://www.resulthubnsut.com/twin' },
};

import TwinClient from '@/components/TwinClient';

export default function TwinPage() {
    return <TwinClient />;
}
