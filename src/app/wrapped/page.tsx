import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Semester Wrapped — Your DTU & NSUT Recap',
  description:
    'Semester Wrapped on Result Hub — a personalized recap of your DTU or NSUT semester: SGPA journey, rank, top subjects, and a shareable card.',
  alternates: { canonical: 'https://www.resulthubnsut.com/wrapped' },
};

import { WrappedClient } from '@/components/WrappedClient';

export default function WrappedPage() {
    return <WrappedClient />;
}
