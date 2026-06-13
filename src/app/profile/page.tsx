"use client";

import { useRouter } from 'next/navigation';
import { RollNoPrompt } from '@/components/RollNoPrompt';

export default function ProfilePage() {
    const router = useRouter();

    return (
        <RollNoPrompt
            title="View Profile"
            description="Enter your roll number to view your academic profile, grades, and rankings."
            buttonLabel="Go"
            onSubmit={(rollNo) => router.push(`/student/${rollNo}`)}
        />
    );
}
