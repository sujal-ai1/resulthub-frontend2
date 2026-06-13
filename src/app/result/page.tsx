export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { fetchFilteredStudents, fetchFilterOptions, Student } from '@/lib/data';
import HomeContent from '@/components/HomeContentClient';

// ── Server data fetcher ─────────────────────────────────
async function HomeData({
  searchParams,
}: {
  searchParams?: Promise<{ batch?: string; branch?: string; page?: string; name?: string }>;
}) {
  const resolved = await searchParams;
  const { years, branches: allBranches } = await fetchFilterOptions();
  const batches = years;
  const currentBatch = resolved?.batch || (batches.includes('2024') ? '2024' : batches[0]) || 'All';
  const currentBranch = resolved?.branch || 'All';
  const branches = allBranches;
  const currentName = resolved?.name || '';

  let students: Student[] = [];
  let total = 0;
  let totalPages = 1;

  try {
    const res = await fetchFilteredStudents(currentBatch, currentBranch, 1, currentName);
    if (res.success) {
      students = res.data;
      total = res.pagination.total;
      totalPages = res.pagination.totalPages;
    }
  } catch (e) {
    console.error('Failed to load students:', e);
  }

  return (
    <HomeContent
      batches={batches}
      branches={branches}
      currentBatch={currentBatch}
      currentBranch={currentBranch}
      initialStudents={students}
      initialTotal={total}
      initialTotalPages={totalPages}
      currentName={currentName}
    />
  );
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams?: Promise<{ batch?: string; branch?: string; page?: string; name?: string }>;
}) {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="h-40 skeleton rounded-xl" />
        <div className="h-[500px] skeleton rounded-xl" />
      </div>
    }>
      <HomeData searchParams={searchParams} />
    </Suspense>
  );
}
