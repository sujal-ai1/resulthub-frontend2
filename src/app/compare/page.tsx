import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare DTU & NSUT Students — SGPA Comparison',
  description:
    'Compare DTU, NSUT & IGDTUW students side by side on Result Hub — SGPA across every semester, subject grades, and rank, all in one view.',
  alternates: { canonical: 'https://www.resulthubnsut.com/compare' },
};

import { CompareSearchForm } from '@/components/CompareSearchForm';
import { CompareGate } from '@/components/CompareGate';
import { CompareResultsClient } from '@/components/CompareResultsClient';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ rolls?: string }> }) {
    const params = await searchParams;
    const rollsArray = params.rolls ? params.rolls.split(',').filter(Boolean) : [];

    if (rollsArray.length === 0) {
        return <CompareGate />;
    }

    const cappedRolls = rollsArray.slice(0, 10);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm mb-4 group"
                style={{ color: 'var(--text-secondary)' }}
            >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to results
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    Head-On Comparison
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Compare academics side-by-side.</p>
            </div>

            <CompareSearchForm />

            <CompareResultsClient rolls={cappedRolls} />
        </div>
    );
}
