import StudentProfileClient from '@/components/StudentProfileClient';

export default async function StudentProfile({ params }: { params: Promise<{ rollNo: string[] }> }) {
    const { rollNo } = await params;
    const rollNoStr = rollNo.join('/');
    return <StudentProfileClient rollNo={rollNoStr} />;
}
