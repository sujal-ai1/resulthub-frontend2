"use client";

import { useRouter } from 'next/navigation';
import { RollNoPrompt } from '@/components/RollNoPrompt';

export function CompareGate() {
    const router = useRouter();

    return (
        <RollNoPrompt
            title="Head-On Comparison"
            description="Enter the first roll number to start comparing academics side-by-side."
            buttonLabel="Compare"
            onSubmit={(rollNo) => router.push(`/compare?rolls=${rollNo}`)}
        />
    );
}
