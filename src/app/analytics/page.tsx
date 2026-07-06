import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DTU & NSUT Analytics — SGPA Trends & Toppers',
  description:
    'Branch-wise SGPA trends, topper lists, and semester performance breakdowns for DTU, NSUT & IGDTUW on Result Hub — live analytics built from real results.',
  alternates: { canonical: 'https://www.resulthubnsut.com/analytics' },
};

import AnalyticsDashboardClient from '@/components/AnalyticsDashboardClient';

export default function AnalyticsDashboard() {
    return <AnalyticsDashboardClient />;
}
