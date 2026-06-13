"use client";

import { useState, useMemo, useCallback } from 'react';
import { Target, Info, AlertTriangle, MinusCircle, ChevronRight, RotateCcw, CheckCircle2, BookOpen, Pencil } from 'lucide-react';
import { Student } from '@/lib/data';

interface SubjectDropSimulatorProps {
    student: Student;
}

// Map NSUT grades to grade points
const GRADE_POINTS: Record<string, number> = {
    'O': 10, 'A+': 9, 'A': 8, 'B+': 7,
    'B': 6, 'C': 5, 'D': 4, 'P': 4,
    'F': 0, 'FD': 0,
};

// Grade display color helper
function gradeColor(grade: string) {
    const g = grade?.toUpperCase();
    if (['O', 'A+', 'A'].includes(g)) return 'var(--success)';
    if (['B+', 'B'].includes(g)) return '#3B82F6';
    if (g === 'C') return 'var(--warning)';
    if (['F', 'FD'].includes(g)) return 'var(--danger)';
    return 'var(--text-secondary)';
}

// ── Types ─────────────────────────────────────────────────
interface SubjectWithCredits {
    subject_code: string;
    grade: string;
    marks: number | string;
    semester: number | string;
    credits: number;
}

// ── Setup Step ────────────────────────────────────────────
interface SetupProps {
    semesters: Array<{
        semester: number | string;
        sgpa: number;
        subjects: Array<{ subject_code: string; grade: string; marks: number | string }>;
    }>;
    creditMap: Record<string, number>;
    touchedFields: Set<string>;
    onCreditChange: (code: string, val: number) => void;
    onConfirm: () => void;
}

function SetupStep({ semesters, creditMap, touchedFields, onCreditChange, onConfirm }: SetupProps) {
    const sorted = [...semesters].sort((a, b) => Number(a.semester) - Number(b.semester));
    // A field is considered filled if the user has explicitly typed into it (even 0 is valid for non-credit subjects)
    const totalSubjects = semesters.reduce((s, sem) => s + (sem.subjects || []).length, 0);
    const allFilled = totalSubjects > 0 && touchedFields.size >= totalSubjects;

    return (
        <div>
            <div className="inline-flex items-start gap-2 p-3 rounded-lg mb-4"
                style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent)', border: '1px solid' }}>
                <Info size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
                <p className="text-xs leading-relaxed" style={{ color: 'var(--accent)' }}>
                    Enter the credits for each subject from your marksheet — then we&apos;ll calculate exactly how dropping a subject affects your CGPA.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {sorted.map(sem => {
                    const subs = sem.subjects || [];
                    const semTotal = subs.reduce((s, sub) => s + (creditMap[sub.subject_code] ?? 0), 0);

                    return (
                        <div key={sem.semester} className="card overflow-hidden">
                            {/* Semester header */}
                            <div className="flex items-center justify-between px-3 py-1.5 border-b"
                                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                                <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                    Semester {sem.semester}
                                </span>
                                <div className="flex items-center gap-2">
                                    {sem.sgpa > 0 && (
                                        <span className="font-black text-sm"
                                            style={{ color: sem.sgpa >= 8 ? 'var(--success)' : sem.sgpa >= 6 ? 'var(--warning)' : 'var(--danger)' }}>
                                            {sem.sgpa.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Subject rows */}
                            <table className="w-full data-table data-table-compact">
                                <thead>
                                    <tr>
                                        <th className="text-left">Subject</th>
                                        <th className="text-center w-12">Grade</th>
                                        <th className="text-right w-16">Credits</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subs.map(sub => {
                                        const isTouched = touchedFields.has(sub.subject_code);
                                        const val = isTouched ? (creditMap[sub.subject_code] ?? 0) : '';
                                        return (
                                            <tr key={sub.subject_code}>
                                                <td>
                                                    <span className="mono" style={{ color: 'var(--text-primary)' }}>
                                                        {sub.subject_code}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <span className="text-xs font-bold" style={{ color: gradeColor(sub.grade) }}>
                                                        {sub.grade}
                                                    </span>
                                                </td>
                                                <td className="text-right">
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        placeholder="cr"
                                                        value={val}
                                                        onChange={e => {
                                                            const raw = e.target.value.replace(/[^0-9]/g, '');
                                                            if (raw === '') {
                                                                onCreditChange(sub.subject_code, -1);
                                                            } else {
                                                                const n = parseInt(raw, 10);
                                                                if (n >= 0 && n <= 10) {
                                                                    onCreditChange(sub.subject_code, n);
                                                                }
                                                            }
                                                        }}
                                                        className="w-10 text-center text-xs font-mono rounded border py-0.5 px-1 focus:outline-none"
                                                        style={{
                                                            backgroundColor: 'var(--surface-elevated)',
                                                            borderColor: isTouched ? 'var(--success)' : 'var(--border)',
                                                            color: 'var(--text-primary)',
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>

            <button
                onClick={onConfirm}
                disabled={!allFilled}
                className="w-full mt-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                style={{
                    backgroundColor: allFilled ? 'var(--accent)' : 'var(--surface-elevated)',
                    color: allFilled ? '#fff' : 'var(--text-muted)',
                    cursor: allFilled ? 'pointer' : 'not-allowed',
                }}
            >
                <CheckCircle2 size={16} />
                {allFilled ? 'Run Simulator →' : 'Fill in all credits to continue'}
            </button>
        </div>
    );
}

// ── Simulator Step ────────────────────────────────────────
interface SimulatorProps {
    subjects: SubjectWithCredits[];
    officialCGPA: number;
    onEdit: () => void;
}

function SimulatorStep({ subjects, officialCGPA, onEdit }: SimulatorProps) {
    const [droppedSubjects, setDroppedSubjects] = useState<string[]>([]);
    const MAX_DROPS = 2;

    const toggleDrop = (code: string) => {
        if (droppedSubjects.includes(code)) {
            setDroppedSubjects(prev => prev.filter(c => c !== code));
        } else if (droppedSubjects.length < MAX_DROPS) {
            setDroppedSubjects(prev => [...prev, code]);
        }
    };

    // Compute credit-weighted CGPAs to get an accurate DELTA from dropping
    // We then apply that delta to the official CGPA so the baseline always matches the profile
    const { creditedFull, creditedAfterDrop, newCreditTotal } = useMemo(() => {
        let ptsFull = 0, credsFull = 0;
        let ptsAfter = 0, credsAfter = 0;
        subjects.forEach(sub => {
            const gp = GRADE_POINTS[sub.grade?.toUpperCase()] ?? 0;
            ptsFull += gp * sub.credits;
            credsFull += sub.credits;
            if (!droppedSubjects.includes(sub.subject_code)) {
                ptsAfter += gp * sub.credits;
                credsAfter += sub.credits;
            }
        });
        return {
            creditedFull: credsFull > 0 ? ptsFull / credsFull : officialCGPA,
            creditedAfterDrop: credsAfter > 0 ? ptsAfter / credsAfter : officialCGPA,
            newCreditTotal: credsAfter,
        };
    }, [subjects, droppedSubjects, officialCGPA]);

    // Delta from user-entered credits, anchored to official baseline
    const cgpaDelta = creditedAfterDrop - creditedFull;
    const newCGPA = officialCGPA + cgpaDelta;
    const totalCredits = subjects.reduce((s, sub) => s + sub.credits, 0);

    // Group subjects by semester for grid display
    const semesterGroups = useMemo(() => {
        const map = new Map<string | number, SubjectWithCredits[]>();
        subjects.forEach(sub => {
            const list = map.get(sub.semester) || [];
            list.push(sub);
            map.set(sub.semester, list);
        });
        return [...map.entries()]
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([semester, subs]) => ({
                semester,
                subjects: subs.sort((a, b) => {
                    const pa = GRADE_POINTS[a.grade?.toUpperCase()] ?? 5;
                    const pb = GRADE_POINTS[b.grade?.toUpperCase()] ?? 5;
                    return pa - pb;
                }),
            }));
    }, [subjects]);

    return (
        <div>
            {/* Live CGPA panel */}
            <div className="flex items-center gap-4 p-3 rounded-xl mb-4"
                style={{ backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--border)' }}>
                <div className="flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Current CGPA</p>
                    <p className="font-black text-xl mono" style={{ color: 'var(--text-primary)' }}>{officialCGPA.toFixed(2)}</p>
                </div>
                <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                <div className="flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>After Drop</p>
                    <p className="font-black text-xl mono" style={{
                        color: cgpaDelta > 0.005 ? 'var(--success)' : cgpaDelta < -0.005 ? 'var(--danger)' : 'var(--text-primary)'
                    }}>{droppedSubjects.length > 0 ? newCGPA.toFixed(2) : officialCGPA.toFixed(2)}</p>
                </div>
                <div className="flex-1 text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Impact</p>
                    <p className="font-black text-xl mono"
                        style={{ color: cgpaDelta > 0.005 ? 'var(--success)' : cgpaDelta < -0.005 ? 'var(--danger)' : 'var(--text-muted)' }}>
                        {droppedSubjects.length === 0 ? '—' : `${cgpaDelta > 0 ? '+' : ''}${cgpaDelta.toFixed(2)}`}
                    </p>
                </div>
            </div>

            {/* Credits summary + actions */}
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Select subjects to drop <span style={{ color: 'var(--text-muted)' }}>({droppedSubjects.length}/{MAX_DROPS})</span>
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{newCreditTotal}/{totalCredits} cr</span>
                    <button onClick={onEdit}
                        className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg"
                        style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-light)' }}>
                        <Pencil size={11} /> Edit Credits
                    </button>
                    {droppedSubjects.length > 0 && (
                        <button onClick={() => setDroppedSubjects([])}
                            className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg"
                            style={{ color: 'var(--text-muted)', backgroundColor: 'var(--surface-elevated)' }}>
                            <RotateCcw size={11} /> Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Semester-based grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {semesterGroups.map(({ semester, subjects: subs }) => (
                    <div key={semester} className="card overflow-hidden">
                        {/* Semester header */}
                        <div className="px-3 py-1.5 flex items-center justify-between border-b"
                            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                Semester {semester}
                            </span>
                        </div>
                        {/* Subject table */}
                        <table className="w-full data-table data-table-compact">
                            <thead>
                                <tr>
                                    <th className="text-left">Subject</th>
                                    <th className="text-center w-14">Grade</th>
                                    <th className="text-right w-14">Credits</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subs.map(sub => {
                                    const isDropped = droppedSubjects.includes(sub.subject_code);
                                    const isMaxed = droppedSubjects.length >= MAX_DROPS && !isDropped;
                                    return (
                                        <tr
                                            key={`${sub.semester}-${sub.subject_code}`}
                                            onClick={() => !isMaxed && toggleDrop(sub.subject_code)}
                                            className="transition-colors"
                                            style={{
                                                cursor: isMaxed ? 'not-allowed' : 'pointer',
                                                opacity: isMaxed ? 0.45 : 1,
                                                backgroundColor: isDropped ? 'var(--danger-bg)' : 'transparent',
                                            }}
                                        >
                                            <td>
                                                <span className="mono" style={{
                                                    color: isDropped ? 'var(--danger)' : 'var(--text-primary)',
                                                    textDecoration: isDropped ? 'line-through' : 'none',
                                                }}>
                                                    {sub.subject_code}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <span className="text-xs font-bold" style={{ color: gradeColor(sub.grade) }}>
                                                    {sub.grade}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <span className="mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                    {sub.credits}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            {droppedSubjects.length === MAX_DROPS && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-medium"
                    style={{ color: 'var(--warning)' }}>
                    <AlertTriangle size={13} />
                    Maximum drops reached. Click a dropped subject to restore it.
                </div>
            )}

            {droppedSubjects.length > 0 && cgpaDelta > 0.005 && (
                <div className="mt-3 p-3 rounded-lg text-xs"
                    style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success)' }}>
                    ✓ Dropping {droppedSubjects.join(' & ')} would improve your CGPA by <strong>+{cgpaDelta.toFixed(3)}</strong> — from {officialCGPA.toFixed(2)} → {newCGPA.toFixed(2)}.
                </div>
            )}
            {droppedSubjects.length > 0 && cgpaDelta < -0.005 && (
                <div className="mt-3 p-3 rounded-lg text-xs"
                    style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid var(--danger)' }}>
                    ⚠ Dropping {droppedSubjects.join(' & ')} would <strong>hurt</strong> your CGPA by {Math.abs(cgpaDelta).toFixed(3)}.
                </div>
            )}
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────
export function SubjectDropSimulator({ student }: SubjectDropSimulatorProps) {
    const [step, setStep] = useState<'setup' | 'simulate'>('setup');
    const [creditMap, setCreditMap] = useState<Record<string, number>>({});
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

    // Flatten semesters
    const semesters = useMemo(() => {
        return (student.semesters || []).map(sem => ({
            semester: sem.semester,
            sgpa: sem.sgpa,
            subjects: (sem.subjects || []).map(s => ({
                subject_code: s.subject_code,
                grade: s.grade,
                marks: s.marks,
            })),
        }));
    }, [student]);

    const handleCreditChange = useCallback((code: string, val: number) => {
        setTouchedFields(prev => {
            const next = new Set(prev);
            if (val === -1) {
                // User cleared the field — remove from touched so it goes back to empty
                next.delete(code);
            } else {
                next.add(code);
            }
            return next;
        });
        setCreditMap(prev => ({ ...prev, [code]: val === -1 ? 0 : val }));
    }, []);

    const handleConfirm = () => setStep('simulate');
    const handleEdit = () => {
        setStep('setup');
        // Keep the creditMap and touchedFields intact so user's values are preserved
    };

    // Build flat subject list with user-provided credits
    const allSubjects: SubjectWithCredits[] = useMemo(() => {
        return semesters.flatMap(sem =>
            sem.subjects.map(sub => ({
                ...sub,
                semester: sem.semester,
                credits: creditMap[sub.subject_code] ?? 4,
            }))
        );
    }, [semesters, creditMap]);

    if (semesters.length === 0 || semesters.every(s => s.subjects.length === 0)) return null;

    return (
        <details className="card overflow-hidden group" open={step === 'simulate'}>
            <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                <ChevronRight size={14} className="transition-transform group-open:rotate-90" style={{ color: 'var(--text-muted)' }} />
                <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Subject Drop Simulator</p>
                {step === 'simulate' && (
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
                        LIVE
                    </span>
                )}
                {step === 'setup' && (
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                        Setup
                    </span>
                )}
            </summary>

            <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                {step === 'setup' ? (
                    <SetupStep
                        semesters={semesters}
                        creditMap={creditMap}
                        touchedFields={touchedFields}
                        onCreditChange={handleCreditChange}
                        onConfirm={handleConfirm}
                    />
                ) : (
                    <SimulatorStep
                        subjects={allSubjects}
                        officialCGPA={student.cgpa}
                        onEdit={handleEdit}
                    />
                )}
            </div>
        </details>
    );
}
