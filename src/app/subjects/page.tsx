import type { Metadata } from 'next';
import { SubjectAnalyticsClient } from '@/components/SubjectAnalyticsClient';

export const metadata: Metadata = {
  title: 'DTU & NSUT Subject Lookup — Grade Distribution & Pass Rate',
  description:
    'Look up any DTU or NSUT subject code to see its historical grade distribution, pass rate, difficulty, and branch/batch breakdowns before you decide to take it.',
  alternates: { canonical: 'https://www.resulthubnsut.com/subjects' },
};

export default function SubjectsPage() {
    return <SubjectAnalyticsClient />;
}
