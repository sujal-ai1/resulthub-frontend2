import type { Metadata } from 'next';
import StudentProfileClient from '@/components/StudentProfileClient';
import { fetchStudentForMetadata } from '@/lib/data';

type Props = {
    params: Promise<{ rollNo: string }>;
    searchParams: Promise<{ college?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const [{ rollNo }, { college }] = await Promise.all([params, searchParams]);
    const rollNoStr = decodeURIComponent(rollNo);
    const student = await fetchStudentForMetadata(rollNoStr, college);

    if (student) {
        return {
            title: `${student.name} (${rollNoStr}) — Result, SGPA & Rank`,
            description: `Semester results for ${student.name}, roll number ${rollNoStr} — SGPA, subject-wise grades, batch rank, and semester trends on Result Hub.`,
        };
    }

    return {
        title: `${rollNoStr} — Result, SGPA & Rank`,
        description: `Full semester result for roll number ${rollNoStr} on Result Hub — SGPA, subject-wise grades, batch rank, and semester trends for DTU, NSUT & IGDTUW students.`,
    };
}

export default async function StudentProfile({ params }: { params: Promise<{ rollNo: string }> }) {
    const { rollNo } = await params;
    return <StudentProfileClient rollNo={rollNo} />;
}
