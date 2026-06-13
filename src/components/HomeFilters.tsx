"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { saveRollNo } from '@/components/RollNoSaver';
import { useCollege, getApiUrl } from '@/components/CollegeProvider';
import { BrandHeading } from '@/components/BrandHeading';

interface HomeFiltersProps {
    batches: string[];
    branches: string[];
    currentBatch: string;
    currentBranch: string;
    total: number;
    onSearchResults?: (results: { students: any[]; total: number; totalPages: number } | null) => void;
    onBatchChange?: (batch: string) => void;
    onBranchChange?: (branch: string) => void;
    onSearchQueryChange?: (query: string) => void;
}

export default function HomeFilters({
    batches,
    branches,
    currentBatch,
    currentBranch,
    total,
    onSearchResults,
    onBatchChange,
    onBranchChange,
    onSearchQueryChange,
}: HomeFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { college } = useCollege();
    const [searchInput, setSearchInput] = useState(searchParams.get('name') || '');
    const [searchFocused, setSearchFocused] = useState(false);
    const [searching, setSearching] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const activeBranches = currentBranch === 'All' ? [] : currentBranch.split(',');
    const activeNameSearch = searchParams.get('name') || '';



    // Debounced search - fires API call when user stops typing
    const debouncedSearch = useCallback((query: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        const cleaned = query.trim();

        // If empty, clear search results
        if (!cleaned) {
            onSearchResults?.(null);
            setSearching(false);
            // Clear URL param without triggering server re-render
            const params = new URLSearchParams(window.location.search);
            params.delete('name');
            params.set('page', '1');
            window.history.replaceState(null, '', `/result?${params.toString()}`);
            return;
        }

        setSearching(true);

        debounceRef.current = setTimeout(async () => {
            const upper = cleaned.toUpperCase();
            // Accept NSUT (2024UEE4639), DTU (2K22/EE/138), or other college formats
            const rollRegex = /^\d{4}[A-Z]{3}\d{4}$|^\d[A-Z0-9]{1,3}\/[A-Z]{2,4}\/\d{1,4}$/;

            // If it's a full roll number, navigate to student page
            if (rollRegex.test(upper)) {
                saveRollNo(upper);
                setSearching(false);
                router.push(`/student/${upper}`);
                return;
            }

            // Otherwise, call the filter API
            try {
                const params = new URLSearchParams();
                params.append('query', cleaned);
                if (currentBatch && currentBatch !== 'All') params.append('year', currentBatch);
                if (currentBranch && currentBranch !== 'All') params.append('branch', currentBranch);

                const res = await fetch(`${getApiUrl(college)}/filter?${params.toString()}`);
                if (!res.ok) throw new Error('Search failed');

                const json = await res.json();
                if (json.success) {
                    onSearchResults?.({
                        students: json.data,
                        total: json.pagination?.total || json.data.length,
                        totalPages: json.pagination?.totalPages || 1,
                    });
                }
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setSearching(false);
            }
        }, 350);
    }, [currentBatch, currentBranch, onSearchResults, router, searchParams, college]);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchInput(val);
        onSearchQueryChange?.(val.trim());
        debouncedSearch(val);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Immediate search on Enter
        if (debounceRef.current) clearTimeout(debounceRef.current);
        const cleaned = searchInput.trim().toUpperCase();
        // Accept NSUT (2024UEE4639), DTU (2K22/EE/138), or other college formats
        const rollRegex = /^\d{4}[A-Z]{3}\d{4}$|^\d[A-Z0-9]{1,3}\/[A-Z]{2,4}\/\d{1,4}$/;
        if (cleaned && rollRegex.test(cleaned)) {
            saveRollNo(cleaned);
            router.push(`/student/${cleaned}`);
            return;
        }
        // Trigger search immediately
        debouncedSearch(searchInput);
    };

    const setBatch = (b: string) => {
        onBatchChange?.(b);
    };

    const toggleBranch = (b: string) => {
        let next = [...activeBranches];
        if (next.includes(b)) next = next.filter(x => x !== b);
        else next.push(b);
        onBranchChange?.(next.length > 0 ? next.join(',') : 'All');
    };

    const clearBranches = () => {
        onBranchChange?.('All');
    };

    const clearNameSearch = () => {
        setSearchInput('');
        onSearchResults?.(null);
        onSearchQueryChange?.('');
        if (debounceRef.current) clearTimeout(debounceRef.current);
        const params = new URLSearchParams(window.location.search);
        params.delete('name');
        params.set('page', '1');
        window.history.replaceState(null, '', `/result?${params.toString()}`);
    };

    return (
        <div className="space-y-5">
            {/* ── Hero search ── */}
            <div className="space-y-3 text-center">
                <div>
                    <BrandHeading
                        className="text-3xl sm:text-7xl tracking-tight font-black"
                        style={{ fontFamily: 'var(--font-bungee), Bungee, sans-serif', color: 'var(--text-primary)' }}
                    />
                    <p
                        className="text-xs sm:text-sm mt-1"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        Results, Leaderboards &amp; Analytics for NSUT, DTU &amp; IGDTUW students
                    </p>
                </div>

                {/* Large search bar */}
                <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
                    <div
                        className="flex items-center rounded-xl border transition-all"
                        style={{
                            borderColor: searchFocused ? 'var(--accent)' : 'var(--border)',
                            boxShadow: searchFocused ? '0 0 0 3px rgba(232,100,26,0.12)' : 'none',
                            backgroundColor: 'var(--surface)',
                            minHeight: '48px',
                        }}
                    >
                        <Search
                            className="ml-3 sm:ml-4 shrink-0"
                            size={18}
                            style={{ color: searchFocused ? 'var(--accent)' : 'var(--text-muted)' }}
                        />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={handleInputChange}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            placeholder="Name or roll no"
                            className="flex-1 min-w-0 px-2 sm:px-3 bg-transparent outline-none text-sm"
                            style={{
                                color: 'var(--text-primary)',
                                caretColor: 'var(--accent)',
                            }}
                        />
                        {searching && (
                            <Loader2
                                className="mr-2 shrink-0 animate-spin"
                                size={16}
                                style={{ color: 'var(--accent)' }}
                            />
                        )}
                        {searchInput && !searching && (
                            <button
                                type="button"
                                onClick={clearNameSearch}
                                className="mr-3 p-1 rounded shrink-0"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* ── Filter rows ── */}
            {/* Mobile: Pill toggles (same as desktop) */}
            <div className="flex flex-col gap-3 sm:hidden">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="section-label mr-1">Year</span>
                    {batches.filter(b => b !== 'All' && ['2025', '2024', '2023', '2022'].includes(b)).map(b => (
                        <button
                            key={b}
                            onClick={() => setBatch(b)}
                            className={`pill-toggle ${currentBatch === b ? 'active' : ''}`}
                        >
                            {b}
                        </button>
                    ))}
                </div>
                {currentBatch !== 'All' && branches.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <span className="section-label shrink-0">Branch</span>
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>(tap multiple)</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            <button
                                onClick={clearBranches}
                                className={`pill-toggle text-xs ${activeBranches.length === 0 ? 'active' : ''}`}
                            >
                                All
                            </button>
                            {branches.map(b => (
                                <button
                                    key={b}
                                    onClick={() => toggleBranch(b)}
                                    className={`pill-toggle text-xs ${activeBranches.includes(b) ? 'active' : ''}`}
                                >
                                    {b}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop: Pill toggles */}
            <div className="hidden sm:flex flex-col gap-2">
                {/* Year row */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="section-label mr-1">Year</span>
                    {batches.filter(b => b !== 'All' && ['2025', '2024', '2023', '2022'].includes(b)).map(b => (
                        <button
                            key={b}
                            onClick={() => setBatch(b)}
                            className={`pill-toggle ${currentBatch === b ? 'active' : ''}`}
                        >
                            {b}
                        </button>
                    ))}
                </div>

                {/* Branch row — only when a batch is selected */}
                {currentBatch !== 'All' && branches.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="section-label mr-1">Branch</span>
                        <button
                            onClick={clearBranches}
                            className={`pill-toggle ${activeBranches.length === 0 ? 'active' : ''}`}
                        >
                            All
                        </button>
                        {branches.map(b => (
                            <button
                                key={b}
                                onClick={() => toggleBranch(b)}
                                className={`pill-toggle ${activeBranches.includes(b) ? 'active' : ''}`}
                            >
                                {b}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Active filter chips ── */}
            {(activeNameSearch || activeBranches.length > 0) && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="section-label">Active:</span>
                    {activeNameSearch && (
                        <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                            style={{
                                backgroundColor: 'var(--accent-light)',
                                borderColor: 'var(--accent-light-border)',
                                color: 'var(--accent)',
                            }}
                        >
                            "{activeNameSearch}"
                            <button onClick={clearNameSearch} className="ml-0.5 hover:opacity-70">
                                <X size={11} />
                            </button>
                        </span>
                    )}
                    {activeBranches.map(b => (
                        <span
                            key={b}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                            style={{
                                backgroundColor: 'var(--accent-light)',
                                borderColor: 'var(--accent-light-border)',
                                color: 'var(--accent)',
                            }}
                        >
                            {b}
                            <button
                                onClick={() => toggleBranch(b)}
                                className="ml-0.5 hover:opacity-70"
                            >
                                <X size={11} />
                            </button>
                        </span>
                    ))}
                    <button
                        onClick={() => {
                            clearNameSearch();
                            clearBranches();
                        }}
                        className="text-xs underline"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        Clear all
                    </button>
                </div>
            )}
        </div>
    );
}
