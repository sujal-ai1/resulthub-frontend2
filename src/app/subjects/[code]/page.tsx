import type { Metadata } from 'next';
import { SubjectAnalyticsClient } from '@/components/SubjectAnalyticsClient';

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { code } = await params;
    const upperCode = decodeURIComponent(code).toUpperCase();
    return {
        title: `${upperCode} — Subject Analytics | Result Hub`,
        description: `Grade distribution, pass rate, difficulty, and historical performance analytics for ${upperCode} on Result Hub — decide if this subject is right for you.`,
        alternates: { canonical: `https://www.resulthubnsut.com/subjects/${upperCode}` },
    };
}

export default async function SubjectAnalyticsPage({ params }: Props) {
    const { code } = await params;
    return <SubjectAnalyticsClient initialCode={decodeURIComponent(code)} />;
}
