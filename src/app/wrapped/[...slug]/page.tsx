import { WrappedClient } from '@/components/WrappedClient';

interface Props {
    params: Promise<{ slug: string[] }>;
}

export default async function WrappedSharePage({ params }: Props) {
    const { slug } = await params;
    // Last segment is semester, everything before is the roll number (may contain slashes)
    const semester = slug[slug.length - 1];
    const rollNo = slug.slice(0, -1).join('/');
    return <WrappedClient initialRollNo={rollNo} initialSemester={Number(semester)} />;
}
