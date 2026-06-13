import TwinClient from '@/components/TwinClient';

interface TwinRollNoPageProps {
    params: Promise<{ rollNo: string[] }>;
}

export default async function TwinRollNoPage({ params }: TwinRollNoPageProps) {
    const { rollNo } = await params;
    const rollNoStr = rollNo.join('/');
    return <TwinClient initialRollNo={rollNoStr} autoLoad />;
}
