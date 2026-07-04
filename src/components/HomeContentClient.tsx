"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import HomeFilters from '@/components/HomeFilters';
import StudentList from '@/components/StudentList';
import { useCollege, getApiUrl } from '@/components/CollegeProvider';
import { PlaygroundIntroModal } from '@/components/PlaygroundIntroModal';

interface HomeContentProps {
    batches: string[];
    branches: string[];
    currentBatch: string;
    currentBranch: string;
    initialStudents: any[];
    initialTotal: number;
    initialTotalPages: number;
    currentName: string;
}

export default function HomeContent({
    batches: serverBatches,
    branches: serverBranches,
    currentBatch: serverBatch,
    currentBranch: serverBranch,
    initialStudents,
    initialTotal,
    initialTotalPages,
    currentName,
}: HomeContentProps) {
    const { college } = useCollege();

    const [batch, setBatch] = useState(serverBatch);
    const [branch, setBranch] = useState(serverBranch);
    const [students, setStudents] = useState(initialStudents);
    const [total, setTotal] = useState(initialTotal);
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    const [availableBatches, setAvailableBatches] = useState(serverBatches);
    const [availableBranches, setAvailableBranches] = useState(serverBranches);
    const [searchOverride, setSearchOverride] = useState<{
        students: any[];
        total: number;
        totalPages: number;
    } | null>(null);
    const searchQueryRef = useRef('');
    const prevCollegeRef = useRef<string | undefined>(undefined);

    // Fetch filter options + students for the current college.
    // Runs on mount and whenever college changes.
    useEffect(() => {
        const shouldReset = prevCollegeRef.current === undefined || prevCollegeRef.current !== college;
        prevCollegeRef.current = college;
        const base = getApiUrl(college);

        fetch(`${base}/filter/options`)
            .then(r => r.ok ? r.json() : null)
            .then(json => {
                const newYears = json?.success && json.data?.years?.length ? json.data.years : serverBatches;
                const newBranches = json?.success && json.data?.branches?.length ? json.data.branches : serverBranches;
                setAvailableBatches(newYears);
                setAvailableBranches(newBranches);

                if (!shouldReset) return null;

                const defaultBatch = newYears.includes('2024') ? '2024' : newYears[0] || 'All';
                setBatch(defaultBatch);
                setBranch('All');
                setSearchOverride(null);
                searchQueryRef.current = '';

                const params = new URLSearchParams({ page: '1' });
                if (defaultBatch !== 'All') params.append('year', defaultBatch);
                const endpoint = defaultBatch === 'All' ? '/students' : '/filter';
                return fetch(`${base}${endpoint}?${params.toString()}`);
            })
            .then(r => r?.ok ? r.json() : null)
            .then(json => {
                if (json?.success) {
                    setStudents(json.data);
                    setTotal(json.pagination?.total || json.data.length);
                    setTotalPages(json.pagination?.totalPages || 1);
                }
            })
            .catch(e => console.error('Failed to load college data:', e));
    }, [college, serverBatches, serverBranches]);

    const fetchStudents = useCallback(async (b: string, br: string, query?: string) => {
        try {
            const base = getApiUrl(college);
            const params = new URLSearchParams();
            params.append('page', '1');
            if (b && b !== 'All') params.append('year', b);
            if (br && br !== 'All') params.append('branch', br);
            if (query) params.append('query', query);

            const endpoint = (b === 'All' && br === 'All' && !query) ? '/students' : '/filter';
            const res = await fetch(`${base}${endpoint}?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch');

            const json = await res.json();
            if (json.success) {
                if (query) {
                    // Search results go into the override
                    setSearchOverride({
                        students: json.data,
                        total: json.pagination?.total || json.data.length,
                        totalPages: json.pagination?.totalPages || 1,
                    });
                } else {
                    setStudents(json.data);
                    setTotal(json.pagination?.total || json.data.length);
                    setTotalPages(json.pagination?.totalPages || 1);
                    setSearchOverride(null);
                }
            }
        } catch (e) {
            console.error('Failed to fetch students:', e);
        }
    }, [college]);

    const updateUrl = useCallback((b: string, br: string) => {
        const params = new URLSearchParams();
        params.set('batch', b);
        params.set('branch', br);
        params.set('page', '1');
        window.history.replaceState(null, '', `/result?${params.toString()}`);
    }, []);

    const handleBatchChange = useCallback((b: string) => {
        setBatch(b);
        setBranch('All');
        const query = searchQueryRef.current;
        fetchStudents(b, 'All', query || undefined);
        updateUrl(b, 'All');
    }, [fetchStudents, updateUrl]);

    const handleBranchChange = useCallback((br: string) => {
        setBranch(br);
        const query = searchQueryRef.current;
        fetchStudents(batch, br, query || undefined);
        updateUrl(batch, br);
    }, [batch, fetchStudents, updateUrl]);

    const handleSearchResults = useCallback((results: { students: any[]; total: number; totalPages: number } | null) => {
        setSearchOverride(results);
    }, []);

    const handleSearchQueryChange = useCallback((query: string) => {
        searchQueryRef.current = query;
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            <PlaygroundIntroModal />
            <HomeFilters
                batches={availableBatches}
                branches={availableBranches}
                currentBatch={batch}
                currentBranch={branch}
                total={searchOverride ? searchOverride.total : total}
                onSearchResults={handleSearchResults}
                onBatchChange={handleBatchChange}
                onBranchChange={handleBranchChange}
                onSearchQueryChange={handleSearchQueryChange}
            />
            <StudentList
                initialStudents={students}
                initialTotal={total}
                initialTotalPages={totalPages}
                batch={batch}
                branch={branch}
                name={currentName}
                searchOverride={searchOverride}
            />
        </div>
    );
}
