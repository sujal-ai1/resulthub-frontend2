import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DTU & NSUT Subject Difficulty — Grade Distributions',
  description:
    'Find the toughest DTU & NSUT subjects on Result Hub — difficulty rankings built from real grade distributions and fail rates, so you know what to expect before electives.',
  alternates: { canonical: 'https://www.resulthubnsut.com/subjects' },
};

import { SubjectsClient } from '@/components/SubjectsClient';

export default function SubjectsPage() {
    return <SubjectsClient />;
}
