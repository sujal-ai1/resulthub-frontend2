"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { SubjectAnalytics, fetchSubjectAnalytics, fetchSubjectCodes } from '@/lib/data';
import { formatGrade } from '@/lib/utils';
import { useCollege } from '@/components/CollegeProvider';
import { BrandHeading } from '@/components/BrandHeading';
import {
    GradeDistributionChart,
    MarksHistogramChart,
    BranchAvgMarksChart,
    SubjectYearTrendChart,
} from '@/components/AnalyticsCharts';

const GRADE_ORDER = ['O', 'A+', 'A', 'B+', 'B', 'C', 'D', 'F', 'FD'];
const GRADE_COLORS: Record<string, string> = {
    O: '#2D6A4F', 'A+': '#059669', A: '#3B82F6',
    'B+': '#14B8A6', B: '#F59E0B', C: '#F97316',
    D: '#EA580C', F: '#EF4444', FD: '#DC2626',
};

const VERDICT_STYLES: Record<string, { bg: string; text: string }> = {
    'Safe Pick': { bg: '#ECFDF5', text: '#2D6A4F' },
    'Moderate Pick': { bg: '#FFFBEB', text: '#B45309' },
    'Risky Pick': { bg: '#FEF2F2', text: '#DC2626' },
};

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
    return (
        <div className="card p-4">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <p className="font-black text-2xl mt-1" style={{ color: 'var(--text-primary)' }}>{value}</p>
            {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
        </div>
    );
}

export function SubjectAnalyticsClient({ initialCode }: { initialCode?: string }) {
    const router = useRouter();
    const { college } = useCollege();
    const [code, setCode] = useState(initialCode ?? '');
    const [data, setData] = useState<SubjectAnalytics | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(Boolean(initialCode));

    const [allCodes, setAllCodes] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const suggestionBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchSubjectCodes(college).then(setAllCodes);
    }, [college]);

    const suggestions = code.trim()
        ? allCodes.filter((c) => c.includes(code.trim())).slice(0, 8)
        : [];

    // Close the dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (suggestionBoxRef.current && !suggestionBoxRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const load = useCallback(async (rawCode: string) => {
        const cleaned = rawCode.trim().toUpperCase();
        if (!cleaned) return;
        setLoading(true);
        setError(null);
        setSearched(true);
        try {
            const result = await fetchSubjectAnalytics(cleaned, college);
            if (result) {
                setData(result);
                router.replace(`/subjects/${encodeURIComponent(cleaned)}`, { scroll: false });
            } else {
                setData(null);
                setError(`No historical records found for subject '${cleaned}'.`);
            }
        } catch {
            setData(null);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [college, router]);

    // Auto-load when arriving via a direct URL like /subjects/CO201
    const didAutoLoad = useRef(false);
    useEffect(() => {
        if (initialCode && !didAutoLoad.current) {
            didAutoLoad.current = true;
            load(initialCode);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setShowSuggestions(false);
        load(activeSuggestion >= 0 && suggestions[activeSuggestion] ? suggestions[activeSuggestion] : code);
    }

    function selectSuggestion(value: string) {
        setCode(value);
        setShowSuggestions(false);
        setActiveSuggestion(-1);
        load(value);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!showSuggestions || suggestions.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestion((i) => (i + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestion((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setActiveSuggestion(-1);
        }
    }

    const searchBar = (
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md w-full">
            <div className="relative flex-1" ref={suggestionBoxRef}>
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                <input
                    type="text"
                    value={code}
                    onChange={(e) => { setCode(e.target.value.toUpperCase()); setShowSuggestions(true); setActiveSuggestion(-1); }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. CO201"
                    autoComplete="off"
                    className="input mono"
                    style={{ paddingLeft: '2.25rem' }}
                />
                {showSuggestions && suggestions.length > 0 && (
                    <ul
                        className="absolute left-0 right-0 mt-1 rounded-lg overflow-hidden shadow-lg z-20"
                        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
                    >
                        {suggestions.map((s, i) => (
                            <li key={s}>
                                <button
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => selectSuggestion(s)}
                                    className="w-full text-left px-3 py-2 text-sm mono transition-colors"
                                    style={{
                                        color: 'var(--text-primary)',
                                        backgroundColor: i === activeSuggestion ? 'var(--accent)' : 'transparent',
                                    }}
                                >
                                    {s}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button type="submit" className="btn-accent px-5 text-sm">Look Up</button>
        </form>
    );

    if (!searched) {
        return (
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                <div className="text-center">
                    <BrandHeading
                        className="text-3xl sm:text-5xl tracking-tight font-black"
                        style={{ fontFamily: 'var(--font-bungee), Bungee, sans-serif', color: 'var(--text-primary)' }}
                    />
                </div>
                <div className="card p-6 sm:p-8 text-center">
                    <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>Subject Lookup</h2>
                    <p className="text-sm mt-2 mb-4" style={{ color: 'var(--text-secondary)' }}>
                        Enter a subject code to see how it has historically played out — grade distribution, pass rate, and whether you should take it.
                    </p>
                    <div className="flex justify-center">{searchBar}</div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <Loader2 size={28} className="animate-spin mx-auto mb-4" style={{ color: 'var(--accent)' }} />
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Crunching the numbers…</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Fetching analytics for {code}</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <AlertTriangle size={24} className="mx-auto mb-3" style={{ color: 'var(--danger)' }} />
                <p className="font-semibold" style={{ color: 'var(--danger)' }}>{error ?? 'No data found.'}</p>
                <div className="flex items-center justify-center gap-3 mt-4">
                    <button onClick={() => { setSearched(false); setError(null); }} className="btn-ghost text-sm">
                        Try Another Subject
                    </button>
                </div>
            </div>
        );
    }

    const verdictStyle = VERDICT_STYLES[data.verdict.label] || VERDICT_STYLES['Moderate Pick'];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
            <button
                onClick={() => { setSearched(false); setData(null); setError(null); }}
                className="inline-flex items-center gap-1.5 text-sm group"
                style={{ color: 'var(--text-secondary)' }}
            >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                Look Up Another Subject
            </button>

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="mono text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        {data.subject_code} {data.is_killer && <span>🔥</span>}
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Based on {data.total_students.toLocaleString()} historical student records
                    </p>
                </div>
                <div className="card p-4 max-w-sm" style={{ backgroundColor: verdictStyle.bg, borderColor: verdictStyle.text + '33' }}>
                    <p className="badge inline-block mb-1.5" style={{ backgroundColor: verdictStyle.text, color: '#fff' }}>
                        {data.verdict.label}
                    </p>
                    <p className="text-sm" style={{ color: verdictStyle.text }}>{data.verdict.reason}</p>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard label="Avg GPA" value={formatGrade(data.avg_marks, 2)} sub={`Median ${formatGrade(data.median_marks, 2)}`} />
                <StatCard label="Pass Rate" value={`${data.pass_percentage.toFixed(1)}%`} sub={`Fail ${data.fail_percentage.toFixed(1)}%`} />
                <StatCard label="Low Grades (C or below)" value={`${data.low_grade_percentage.toFixed(1)}%`} />
                <StatCard label="Difficulty" value={data.difficulty} sub={`Harder than ${data.comparison.harder_than_percentage}% of subjects`} />
            </div>

            {/* Comparison callout */}
            <div className="card p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Overall average across all subjects is <strong style={{ color: 'var(--text-primary)' }}>{formatGrade(data.comparison.overall_avg_marks_all_subjects, 2)}</strong>.
                {' '}This subject sits{' '}
                <strong style={{ color: data.comparison.difference_from_overall >= 0 ? 'var(--success, #2D6A4F)' : 'var(--danger)' }}>
                    {data.comparison.difference_from_overall >= 0 ? 'above' : 'below'} average by {Math.abs(data.comparison.difference_from_overall).toFixed(2)}
                </strong>{' '}
                grade points, and spread (std dev) is <strong style={{ color: 'var(--text-primary)' }}>{data.std_dev}</strong>.
            </div>

            {/* Charts grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-4">
                    <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Grade Distribution</h3>
                    <GradeDistributionChart data={data.grade_distribution} />
                </div>
                <div className="card p-4">
                    <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Marks Histogram</h3>
                    <MarksHistogramChart data={data.marks_histogram} />
                </div>
                {data.branch_breakdown.length > 1 && (
                    <div className="card p-4">
                        <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Average GPA by Branch</h3>
                        <BranchAvgMarksChart data={data.branch_breakdown} />
                    </div>
                )}
                {data.year_breakdown.length > 1 && (
                    <div className="card p-4">
                        <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Trend Across Batches</h3>
                        <SubjectYearTrendChart data={data.year_breakdown} />
                    </div>
                )}
            </div>

            {/* Semester breakdown table */}
            {data.semester_breakdown.length > 1 && (
                <div className="card p-4">
                    <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>By Semester</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ color: 'var(--text-muted)' }}>
                                    <th className="text-left font-medium pb-2">Semester</th>
                                    <th className="text-left font-medium pb-2">Students</th>
                                    <th className="text-left font-medium pb-2">Avg GPA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.semester_breakdown.map((s) => (
                                    <tr key={s.semester} style={{ borderTop: '1px solid var(--border)' }}>
                                        <td className="py-2">{s.semester}</td>
                                        <td className="py-2">{s.total_students}</td>
                                        <td className="py-2 font-semibold">{formatGrade(s.avg_marks, 2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Top scorers */}
            <div className="card p-4">
                <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Top Scorers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {data.top_scorers.map((s, i) => (
                        <div key={s.roll_no} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--surface)' }}>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>#{i + 1}</p>
                            <p className="mono text-sm font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>{s.roll_no}</p>
                            <p className="text-xs mt-1" style={{ color: GRADE_COLORS[s.grade] || 'var(--text-secondary)' }}>
                                {s.grade} · {s.marks} GPA
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Grade legend */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                {GRADE_ORDER.filter((g) => (data.grade_distribution[g] ?? 0) > 0).map((g) => (
                    <span key={g} className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: GRADE_COLORS[g] }} />
                        {g}: {data.grade_distribution[g]} ({data.grade_distribution_pct[g]}%)
                    </span>
                ))}
            </div>
        </div>
    );
}
