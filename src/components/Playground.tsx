"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
    Info, AlertTriangle, ChevronRight, RotateCcw, CheckCircle2, Pencil, MinusCircle,
    Sparkles, TrendingUp, Zap, FlaskConical, Goal, TriangleAlert, PartyPopper,
} from 'lucide-react';
import { Student } from '@/lib/data';
import { formatGrade } from '@/lib/utils';

interface PlaygroundProps {
    student: Student;
}

// Map NSUT grades to grade points
export const GRADE_POINTS: Record<string, number> = {
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

// Grade-point color helper (for the numeric grade-point selector)
function pointColor(points: number) {
    if (points >= 8) return 'var(--success)';
    if (points >= 6) return '#3B82F6';
    if (points >= 5) return 'var(--warning)';
    return 'var(--danger)';
}

// Distinct selectable grade-point values, highest first (D & P both = 4, F & FD both = 0)
const GRADE_POINT_OPTIONS = Array.from(new Set(Object.values(GRADE_POINTS))).sort((a, b) => b - a);

// ── Credit Prediction ─────────────────────────────────────
// Predicts credits for NSUT subject codes (semesters 1–4).
//
// Rules derived from NSUT curriculum patterns:
//   • VA** prefix (e.g. VANH0301, VAPD0101, VAPD0115) → 0 credits (audit / non-credit)
//   • FCFO** prefix (e.g. FCFO0301) → 2 credits (foundation optional)
//   • Everything else (e.g. CACSC401, CAMTC305, FCHS0105, FCEE0106) → 4 credits
export function predictCredits(subjectCode: string): number {
    const code = subjectCode.toUpperCase().trim();

    // 0-credit: Value-Added / audit courses — VA prefix
    if (code.startsWith('VA')) return 0;

    // 2-credit: Foundation optional courses — FCFO prefix
    if (code.startsWith('FCFO')) return 2;

    // Default: most theory + lab courses
    return 4;
}

// ── Types ─────────────────────────────────────────────────
export interface SubjectWithCredits {
    subject_code: string;
    grade: string;
    marks: number | string;
    semester: number | string;
    credits: number;
}

// ── Toggle Switch ─────────────────────────────────────────
function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
    return (
        <label className="switch" title={label} aria-label={label}>
            <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
            <span className="switch-track" />
        </label>
    );
}

// ── Setup Step (credit entry) ──────────────────────────────
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
    isPredicted: boolean;
}

function CreditSetupStep({ semesters, creditMap, touchedFields, onCreditChange, onConfirm, isPredicted }: SetupProps) {
    const sorted = [...semesters].sort((a, b) => Number(a.semester) - Number(b.semester));
    const totalSubjects = semesters.reduce((s, sem) => s + (sem.subjects || []).length, 0);
    const allFilled = totalSubjects > 0 && touchedFields.size >= totalSubjects;

    return (
        <div>
            <div className="inline-flex items-start gap-2 p-3 rounded-lg mb-4"
                style={{ backgroundColor: isPredicted ? 'var(--success-bg)' : 'var(--accent-light)', borderColor: isPredicted ? 'var(--success)' : 'var(--accent)', border: '1px solid' }}>
                {isPredicted ? (
                    <Sparkles size={15} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 1 }} />
                ) : (
                    <Info size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
                )}
                <p className="text-xs leading-relaxed" style={{ color: isPredicted ? 'var(--success)' : 'var(--accent)' }}>
                    {isPredicted
                        ? 'Credits have been auto-predicted from subject codes. Review and correct if needed, then enter the playground.'
                        : 'Enter the credits for each subject from your marksheet — then we\'ll calculate exactly how your edits affect your CGPA.'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {sorted.map(sem => {
                    const subs = sem.subjects || [];

                    return (
                        <div key={sem.semester} className="card overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-1.5 border-b"
                                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                                <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                    Semester {sem.semester}
                                </span>
                                {sem.sgpa > 0 && (
                                    <span className="font-black text-sm"
                                        style={{ color: sem.sgpa >= 8 ? 'var(--success)' : sem.sgpa >= 6 ? 'var(--warning)' : 'var(--danger)' }}>
                                        {formatGrade(sem.sgpa, 2)}
                                    </span>
                                )}
                            </div>

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
                                        const predicted = predictCredits(sub.subject_code);
                                        const isZeroCredit = predicted === 0;
                                        return (
                                            <tr key={sub.subject_code} style={{ opacity: isZeroCredit ? 0.45 : 1 }}>
                                                <td>
                                                    <span className="mono" style={{ color: 'var(--text-primary)' }}>
                                                        {sub.subject_code}
                                                    </span>
                                                    {isZeroCredit && (
                                                        <span className="text-[9px] ml-1 px-1 py-0.5 rounded"
                                                            style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-muted)' }}>
                                                            audit
                                                        </span>
                                                    )}
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
                {allFilled ? 'Enter Playground →' : 'Fill in all credits to continue'}
            </button>
        </div>
    );
}

// ── Best Drop Recommendation ──────────────────────────────
export interface DropRecommendation {
    subject_code: string;
    semester: number | string;
    grade: string;
    credits: number;
    cgpaDelta: number;
    newCGPA: number;
}

export function computeBestDrop(subjects: SubjectWithCredits[], officialCGPA: number): DropRecommendation | null {
    // Only consider subjects with credits > 0
    const eligible = subjects.filter(s => s.credits > 0);
    if (eligible.length <= 1) return null;

    // Compute full weighted CGPA from all credited subjects
    let ptsFull = 0, credsFull = 0;
    eligible.forEach(sub => {
        const gp = GRADE_POINTS[sub.grade?.toUpperCase()] ?? 0;
        ptsFull += gp * sub.credits;
        credsFull += sub.credits;
    });
    const creditedFull = credsFull > 0 ? ptsFull / credsFull : officialCGPA;

    let bestDrop: DropRecommendation | null = null;

    for (const candidate of eligible) {
        const gp = GRADE_POINTS[candidate.grade?.toUpperCase()] ?? 0;
        const ptsAfter = ptsFull - (gp * candidate.credits);
        const credsAfter = credsFull - candidate.credits;
        if (credsAfter <= 0) continue;

        const creditedAfter = ptsAfter / credsAfter;
        const delta = creditedAfter - creditedFull;

        // We want the drop that MAXIMISES the delta (biggest improvement)
        if (!bestDrop || delta > bestDrop.cgpaDelta) {
            bestDrop = {
                subject_code: candidate.subject_code,
                semester: candidate.semester,
                grade: candidate.grade,
                credits: candidate.credits,
                cgpaDelta: delta,
                newCGPA: officialCGPA + delta,
            };
        }
    }

    // Only recommend if it actually improves CGPA
    if (bestDrop && bestDrop.cgpaDelta > 0.001) return bestDrop;
    return null;
}

// ── Playground CGPA engine ─────────────────────────────────
// Recomputes overall CGPA from per-subject grade edits and/or dropped
// subjects, anchored as a delta against the official CGPA so small
// credit-prediction errors never throw off the baseline.
interface PlaygroundSemester {
    semester: number | string;
    sgpa: number;
    credits: number; // base credits for this semester (from credits_secured, falls back to predicted sum)
    subjects: SubjectWithCredits[];
}

function computePlayground(
    semesters: PlaygroundSemester[],
    droppedSubjects: string[],
    gradeOverrides: Record<string, number>,
    officialCGPA: number,
) {
    let baseWeighted = 0, baseCredits = 0;
    let effWeighted = 0, effCredits = 0;
    const perSemester = semesters.map(sem => {
        let fullPts = 0, fullCreds = 0, afterPts = 0, afterCreds = 0;
        sem.subjects.forEach(sub => {
            const baseGp = GRADE_POINTS[sub.grade?.toUpperCase()] ?? 0;
            fullPts += baseGp * sub.credits;
            fullCreds += sub.credits;
            if (!droppedSubjects.includes(sub.subject_code)) {
                const effGp = gradeOverrides[sub.subject_code] ?? baseGp;
                afterPts += effGp * sub.credits;
                afterCreds += sub.credits;
            }
        });

        const changed = fullCreds !== afterCreds || fullPts !== afterPts;
        const changeDelta = changed && fullCreds > 0 && afterCreds > 0 ? (afterPts / afterCreds) - (fullPts / fullCreds) : 0;

        const effSgpa = sem.sgpa + changeDelta;
        const creditReduction = fullCreds - afterCreds;
        const effCred = Math.max(sem.credits - creditReduction, 0);

        baseWeighted += sem.sgpa * sem.credits;
        baseCredits += sem.credits;
        effWeighted += effSgpa * effCred;
        effCredits += effCred;

        return { semester: sem.semester, effSgpa, effCred, changed };
    });

    const baseAvg = baseCredits > 0 ? baseWeighted / baseCredits : officialCGPA;
    const effAvg = effCredits > 0 ? effWeighted / effCredits : officialCGPA;
    const cgpaDelta = effAvg - baseAvg;
    const newCGPA = officialCGPA + cgpaDelta;
    const creditsDelta = effCredits - baseCredits;

    return { perSemester, cgpaDelta, newCGPA, creditsDelta };
}

// ── Small 0–10 gauge with markers for personal history ────
function SgpaGauge({ value, avg, best }: { value: number; avg?: number; best?: number }) {
    const pct = (v: number) => Math.max(0, Math.min(100, (v / 10) * 100));
    const fillColor = value <= 8 ? 'var(--success)' : value <= 9.3 ? 'var(--warning)' : 'var(--danger)';
    return (
        <div className="mt-3">
            <div className="relative h-2 rounded-full" style={{ backgroundColor: 'var(--background)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct(value)}%`, backgroundColor: fillColor }} />
                {avg !== undefined && (
                    <div title={`Your average SGPA: ${formatGrade(avg, 2)}`}
                        className="absolute top-1/2 w-0.5 h-3 rounded-full"
                        style={{ left: `${pct(avg)}%`, backgroundColor: 'var(--text-muted)', transform: 'translate(-50%, -50%)' }} />
                )}
                {best !== undefined && (
                    <div title={`Your best SGPA: ${formatGrade(best, 2)}`}
                        className="absolute top-1/2 w-0.5 h-3 rounded-full"
                        style={{ left: `${pct(best)}%`, backgroundColor: 'var(--text-primary)', transform: 'translate(-50%, -50%)' }} />
                )}
            </div>
            {(avg !== undefined || best !== undefined) && (
                <div className="flex items-center gap-3 mt-1.5">
                    {avg !== undefined && (
                        <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--text-muted)' }} /> avg {formatGrade(avg, 2)}
                        </span>
                    )}
                    {best !== undefined && (
                        <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--text-primary)' }} /> best {formatGrade(best, 2)}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

// Free-typing numeric text field: keeps whatever the user types on screen
// (so a trailing "." or an empty box never gets silently stomped by a
// re-render) and only clamps/normalizes once the field loses focus.
function FreeNumberField({ text, onText, onCommit, decimal, className }: {
    text: string;
    onText: (raw: string) => void;
    onCommit: (n: number) => void;
    decimal?: boolean;
    className?: string;
}) {
    const pattern = decimal ? /^\d*\.?\d*$/ : /^\d*$/;
    return (
        <input
            type="text"
            inputMode={decimal ? 'decimal' : 'numeric'}
            value={text}
            onChange={e => {
                const raw = e.target.value;
                if (pattern.test(raw)) onText(raw);
            }}
            onBlur={() => {
                const n = parseFloat(text);
                if (Number.isFinite(n)) onCommit(n);
            }}
            className={className}
        />
    );
}

// ── Goal Planner ───────────────────────────────────────────
interface GoalPlannerProps {
    currentCGPA: number;
    creditsSoFar: number;
    bestSgpa?: number;
    avgSgpa?: number;
    avgCredits: number;
    currentSemester: number;
}

function GoalPlanner({ currentCGPA, creditsSoFar, bestSgpa, avgSgpa, avgCredits, currentSemester }: GoalPlannerProps) {
    const defaultTarget = Math.min(10, Math.round((currentCGPA + 0.3) * 100) / 100);
    const defaultTargetSem = currentSemester > 0 ? currentSemester + 2 : 2;

    const [targetCGPAText, setTargetCGPAText] = useState(() => formatGrade(defaultTarget, 2));
    const [targetSemText, setTargetSemText] = useState(() => String(defaultTargetSem));
    const [creditsText, setCreditsText] = useState(() => String(avgCredits || 24));

    const targetCGPA = Math.max(0, Math.min(10, parseFloat(targetCGPAText) || 0));
    const targetSemester = Math.max(currentSemester + 1, parseInt(targetSemText, 10) || currentSemester + 1);
    const nextSemCredits = Math.max(1, parseInt(creditsText, 10) || 1);
    const remainingSems = Math.max(1, targetSemester - currentSemester);

    const totalNewCredits = remainingSems * nextSemCredits;
    const requiredAvgSGPA = totalNewCredits > 0
        ? (targetCGPA * (creditsSoFar + totalNewCredits) - currentCGPA * creditsSoFar) / totalNewCredits
        : 0;

    const alreadyThere = requiredAvgSGPA <= 0;
    const impossible = requiredAvgSGPA > 10;

    // Quick-pick target chips: a modest bump, your best sem, and common round numbers
    const quickTargets = useMemo(() => {
        const candidates = [
            Math.round((currentCGPA + 0.2) * 100) / 100,
            bestSgpa,
            8.0, 8.5, 9.0, 9.5,
        ].filter((v): v is number => v !== undefined && v > currentCGPA && v <= 10);
        return Array.from(new Set(candidates.map(v => Math.round(v * 100) / 100))).sort((a, b) => a - b).slice(0, 4);
    }, [currentCGPA, bestSgpa]);

    let contextLine: string | null = null;
    if (!alreadyThere && !impossible) {
        if (bestSgpa !== undefined && requiredAvgSGPA > bestSgpa + 0.01) {
            contextLine = `That's higher than your best semester so far (${formatGrade(bestSgpa, 2)}) — a stretch goal.`;
        } else if (avgSgpa !== undefined && requiredAvgSGPA <= avgSgpa + 0.01) {
            contextLine = `That's at or below your typical SGPA (${formatGrade(avgSgpa, 2)}) — comfortably within reach.`;
        } else if (bestSgpa !== undefined) {
            contextLine = `That's above your average but below your best (${formatGrade(bestSgpa, 2)}) — doable if you push.`;
        }
    }

    return (
        <div className="card p-4">
            <div className="flex items-center gap-1.5 mb-3">
                <Goal size={14} style={{ color: 'var(--accent)' }} />
                <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Goal Planner</p>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-3">
                <label className="block">
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Target CGPA</span>
                    <FreeNumberField
                        text={targetCGPAText}
                        onText={setTargetCGPAText}
                        onCommit={n => setTargetCGPAText(formatGrade(Math.max(0, Math.min(10, n)), 2))}
                        decimal
                        className="input mt-1 mono"
                    />
                    {quickTargets.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {quickTargets.map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTargetCGPAText(formatGrade(t, 2))}
                                    className={`pill-toggle ${Math.abs(targetCGPA - t) < 0.005 ? 'active' : ''}`}
                                    style={{ padding: '3px 10px', fontSize: '0.7rem' }}
                                >
                                    {formatGrade(t, 2)}
                                </button>
                            ))}
                        </div>
                    )}
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>By end of sem</span>
                        <FreeNumberField
                            text={targetSemText}
                            onText={setTargetSemText}
                            onCommit={n => setTargetSemText(String(Math.max(currentSemester + 1, Math.min(currentSemester + 8, Math.round(n)))))}
                            className="input mt-1 mono"
                        />
                    </label>
                    <label className="block">
                        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Credits/sem</span>
                        <FreeNumberField
                            text={creditsText}
                            onText={setCreditsText}
                            onCommit={n => setCreditsText(String(Math.max(1, Math.min(40, Math.round(n)))))}
                            className="input mt-1 mono"
                        />
                    </label>
                </div>
                {currentSemester > 0 && (
                    <p className="text-[10px] -mt-1" style={{ color: 'var(--text-muted)' }}>
                        You&apos;re currently past sem {currentSemester} · that&apos;s {remainingSems} sem{remainingSems > 1 ? 's' : ''} to go
                    </p>
                )}
            </div>

            <div className="p-3 rounded-xl text-center"
                style={{
                    backgroundColor: alreadyThere ? 'var(--success-bg)' : impossible ? 'var(--danger-bg)' : 'var(--accent-light)',
                    border: `1px solid ${alreadyThere ? 'var(--success)' : impossible ? 'var(--danger)' : 'var(--accent)'}`,
                }}>
                {alreadyThere ? (
                    <>
                        <PartyPopper size={18} className="mx-auto mb-1" style={{ color: 'var(--success)' }} />
                        <p className="text-xs font-bold" style={{ color: 'var(--success)' }}>You&apos;ve already hit this target!</p>
                    </>
                ) : impossible ? (
                    <>
                        <TriangleAlert size={18} className="mx-auto mb-1" style={{ color: 'var(--danger)' }} />
                        <p className="text-xs font-bold" style={{ color: 'var(--danger)' }}>Not achievable by sem {targetSemester} — even a 10.00 SGPA every remaining semester won&apos;t reach {formatGrade(targetCGPA, 2)}.</p>
                    </>
                ) : (
                    <>
                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                            Required avg SGPA / sem
                        </p>
                        <p className="font-black text-2xl mono" style={{ color: requiredAvgSGPA <= 8 ? 'var(--success)' : requiredAvgSGPA <= 9.3 ? 'var(--warning)' : 'var(--danger)' }}>
                            {formatGrade(requiredAvgSGPA, 2)}
                        </p>
                        <p className="text-[10px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                            across {remainingSems} sem{remainingSems > 1 ? 's' : ''} (sem {currentSemester + 1}–{targetSemester}) · {nextSemCredits} credits each
                        </p>
                        <SgpaGauge value={requiredAvgSGPA} avg={avgSgpa} best={bestSgpa} />
                        {contextLine && (
                            <p className="text-[10px] mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                {contextLine}
                            </p>
                        )}
                    </>
                )}
            </div>

            <div className="flex items-start gap-2 mt-3 p-2.5 rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
                <Info size={12} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
                <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    This takes your CGPA as it stands after any grade edits or drops you&apos;ve made above (through sem {currentSemester}),
                    then works backwards to find the one flat average SGPA that — if repeated every semester from sem {currentSemester + 1} through sem {targetSemester} —
                    lands your overall CGPA exactly on {formatGrade(targetCGPA, 2)} by then. It assumes {nextSemCredits} credits in each of those semesters.
                </p>
            </div>
        </div>
    );
}

// ── Playground Body (editable SGPA + drop) ────────────────
interface BodyProps {
    semesters: PlaygroundSemester[];
    officialCGPA: number;
    creditsCompleted: number;
    onEdit: () => void;
}

function PlaygroundBody({ semesters, officialCGPA, creditsCompleted, onEdit }: BodyProps) {
    const [droppedSubjects, setDroppedSubjects] = useState<string[]>([]);
    const [gradeOverrides, setGradeOverrides] = useState<Record<string, number>>({});
    const MAX_DROPS = 2;

    const allSubjects = useMemo(() => semesters.flatMap(s => s.subjects.filter(sub => sub.credits > 0)), [semesters]);
    const recommendation = useMemo(() => computeBestDrop(allSubjects, officialCGPA), [allSubjects, officialCGPA]);

    const toggleDrop = (code: string) => {
        setDroppedSubjects(prev => {
            if (prev.includes(code)) return prev.filter(c => c !== code);
            if (prev.length < MAX_DROPS) return [...prev, code];
            return prev;
        });
    };

    const setGradeOverride = (code: string, points: number) => {
        setGradeOverrides(prev => ({ ...prev, [code]: points }));
    };
    const clearGradeOverride = (code: string) => {
        setGradeOverrides(prev => {
            const next = { ...prev };
            delete next[code];
            return next;
        });
    };

    const resetAll = () => {
        setDroppedSubjects([]);
        setGradeOverrides({});
    };

    const { perSemester, cgpaDelta, newCGPA, creditsDelta } = useMemo(
        () => computePlayground(semesters, droppedSubjects, gradeOverrides, officialCGPA),
        [semesters, droppedSubjects, gradeOverrides, officialCGPA]
    );

    const hasChanges = droppedSubjects.length > 0 || Object.keys(gradeOverrides).length > 0;
    const creditsSoFar = Math.max(creditsCompleted + creditsDelta, 0);
    const perSemesterMap = useMemo(() => new Map(perSemester.map(p => [String(p.semester), p])), [perSemester]);

    // Historical performance, used to give the Goal Planner some real context
    const pastSgpas = useMemo(() => semesters.map(s => s.sgpa).filter(s => s > 0), [semesters]);
    const bestSgpa = pastSgpas.length ? Math.max(...pastSgpas) : undefined;
    const avgSgpa = pastSgpas.length ? pastSgpas.reduce((a, b) => a + b, 0) / pastSgpas.length : undefined;
    const currentSemester = semesters.length ? Math.max(...semesters.map(s => Number(s.semester))) : 0;
    const avgCredits = semesters.length
        ? Math.round(semesters.reduce((s, sem) => s + sem.credits, 0) / semesters.length)
        : 24;

    return (
        <div>
            {/* Auto-recommendation banner */}
            {recommendation && !hasChanges && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl mb-4"
                    style={{ backgroundColor: 'var(--accent-light)', border: '1px solid var(--accent)' }}>
                    <Zap size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold mb-0.5" style={{ color: 'var(--accent)' }}>Recommended Drop</p>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            Drop <strong style={{ color: 'var(--text-primary)' }}>{recommendation.subject_code}</strong>
                            {' '}(Sem {recommendation.semester} · {recommendation.credits}cr · Grade {recommendation.grade})
                            {' '}for the biggest improvement: <strong style={{ color: 'var(--success)' }}>+{formatGrade(recommendation.cgpaDelta, 3)}</strong>
                            {' '}→ {formatGrade(recommendation.newCGPA, 2)} CGPA
                        </p>
                        <button
                            onClick={() => toggleDrop(recommendation.subject_code)}
                            className="mt-2 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 transition-all"
                            style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
                            <TrendingUp size={12} /> Apply Recommendation
                        </button>
                    </div>
                </div>
            )}

            {/* Live CGPA panel */}
            <div className="flex items-center gap-4 p-3 rounded-xl mb-4"
                style={{ backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--border)' }}>
                <div className="flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Actual CGPA</p>
                    <p className="font-black text-xl mono" style={{ color: 'var(--text-primary)' }}>{formatGrade(officialCGPA, 2)}</p>
                </div>
                <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                <div className="flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Playground CGPA</p>
                    <p className="font-black text-xl mono" style={{
                        color: cgpaDelta > 0.005 ? 'var(--success)' : cgpaDelta < -0.005 ? 'var(--danger)' : 'var(--text-primary)'
                    }}>{hasChanges ? formatGrade(newCGPA, 2) : formatGrade(officialCGPA, 2)}</p>
                </div>
                <div className="flex-1 text-right">
                    <p className="font-bold text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Net Change</p>
                    <p className="font-black text-xl mono" style={{ color: cgpaDelta > 0.005 ? 'var(--success)' : cgpaDelta < -0.005 ? 'var(--danger)' : 'var(--text-primary)' }}>
                        {!hasChanges ? '—' : `${cgpaDelta > 0 ? '+' : ''}${formatGrade(cgpaDelta, 2)}`}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Change a subject&apos;s grade or drop it <span style={{ color: 'var(--text-muted)' }}>({droppedSubjects.length}/{MAX_DROPS} dropped)</span>
                </p>
                <div className="flex items-center gap-2">
                    <button onClick={onEdit}
                        className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg"
                        style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-light)' }}>
                        <Pencil size={11} /> Edit Credits
                    </button>
                    {hasChanges && (
                        <button onClick={resetAll}
                            className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg"
                            style={{ color: 'var(--text-muted)', backgroundColor: 'var(--surface-elevated)' }}>
                            <RotateCcw size={11} /> Reset
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3 items-start">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {semesters.map(sem => {
                        const key = String(sem.semester);
                        const p = perSemesterMap.get(key);
                        const displaySgpa = p ? p.effSgpa : sem.sgpa;
                        const semChanged = p?.changed ?? false;

                        return (
                            <div key={sem.semester} className="card overflow-hidden">
                                <div className="px-3 py-1.5 flex items-center justify-between border-b gap-2"
                                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                                    <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                        Semester {sem.semester}
                                    </span>
                                    <span className="font-black text-sm mono" style={{ color: semChanged ? 'var(--accent)' : 'var(--text-primary)' }}>
                                        {formatGrade(displaySgpa, 2)}
                                    </span>
                                </div>
                                <table className="w-full data-table data-table-compact">
                                    <thead>
                                        <tr>
                                            <th className="text-left">Subject</th>
                                            <th className="text-center w-20">Grade</th>
                                            <th className="text-right w-14">Credits</th>
                                            <th className="text-center w-10">Drop</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sem.subjects.map(sub => {
                                            const isDropped = droppedSubjects.includes(sub.subject_code);
                                            const isMaxed = droppedSubjects.length >= MAX_DROPS && !isDropped;
                                            const isRecommended = recommendation?.subject_code === sub.subject_code && !hasChanges;
                                            const isEligible = sub.credits > 0;
                                            const basePoints = GRADE_POINTS[sub.grade?.toUpperCase()] ?? 0;
                                            const effPoints = gradeOverrides[sub.subject_code] ?? basePoints;
                                            const isGradeChanged = gradeOverrides[sub.subject_code] !== undefined && gradeOverrides[sub.subject_code] !== basePoints;
                                            return (
                                                <tr
                                                    key={sub.subject_code}
                                                    style={{
                                                        opacity: isDropped ? 0.45 : 1,
                                                        backgroundColor: isDropped ? 'var(--danger-bg)' : isRecommended ? 'var(--accent-light)' : 'transparent',
                                                    }}
                                                >
                                                    <td>
                                                        <span className="mono" style={{
                                                            color: isDropped ? 'var(--danger)' : 'var(--text-primary)',
                                                            textDecoration: isDropped ? 'line-through' : 'none',
                                                        }}>
                                                            {sub.subject_code}
                                                        </span>
                                                        {isRecommended && (
                                                            <span className="text-[9px] ml-1 px-1 py-0.5 rounded font-bold"
                                                                style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
                                                                ★ DROP
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <select
                                                                value={effPoints}
                                                                disabled={isDropped}
                                                                onChange={e => setGradeOverride(sub.subject_code, Number(e.target.value))}
                                                                className="text-xs font-bold rounded border py-0.5 focus:outline-none"
                                                                style={{
                                                                    color: isGradeChanged ? 'var(--accent)' : pointColor(effPoints),
                                                                    backgroundColor: 'var(--surface-elevated)',
                                                                    borderColor: isGradeChanged ? 'var(--accent)' : 'var(--border)',
                                                                    opacity: isDropped ? 0.5 : 1,
                                                                }}
                                                            >
                                                                {GRADE_POINT_OPTIONS.map(pt => (
                                                                    <option key={pt} value={pt}>{pt}</option>
                                                                ))}
                                                            </select>
                                                            {isGradeChanged && !isDropped && (
                                                                <button onClick={() => clearGradeOverride(sub.subject_code)} title="Reset grade">
                                                                    <RotateCcw size={10} style={{ color: 'var(--text-muted)' }} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="text-right">
                                                        <span className="mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                            {sub.credits}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <button
                                                            onClick={() => isEligible && !isMaxed && toggleDrop(sub.subject_code)}
                                                            disabled={!isEligible || isMaxed}
                                                            title={isDropped ? 'Restore subject' : 'Drop subject'}
                                                            style={{
                                                                cursor: !isEligible || isMaxed ? 'not-allowed' : 'pointer',
                                                                opacity: isEligible ? 1 : 0.35,
                                                                color: isDropped ? 'var(--danger)' : 'var(--text-muted)',
                                                            }}
                                                        >
                                                            {isDropped ? <RotateCcw size={13} /> : <MinusCircle size={13} />}
                                                        </button>
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

                <GoalPlanner
                    currentCGPA={hasChanges ? newCGPA : officialCGPA}
                    creditsSoFar={creditsSoFar}
                    bestSgpa={bestSgpa}
                    avgSgpa={avgSgpa}
                    avgCredits={avgCredits}
                    currentSemester={currentSemester}
                />
            </div>

            {droppedSubjects.length === MAX_DROPS && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-medium"
                    style={{ color: 'var(--warning)' }}>
                    <AlertTriangle size={13} />
                    Maximum drops reached. Click a dropped subject to restore it.
                </div>
            )}
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────
export function Playground({ student }: PlaygroundProps) {
    const [enabled, setEnabled] = useState(false);
    const [step, setStep] = useState<'setup' | 'play'>('setup');
    const [creditMap, setCreditMap] = useState<Record<string, number>>({});
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
    const [isPredicted, setIsPredicted] = useState(false);

    // Flatten semesters
    const rawSemesters = useMemo(() => {
        return (student.semesters || []).map(sem => ({
            semester: sem.semester,
            sgpa: sem.sgpa,
            credits_secured: Number(sem.credits_secured) || 0,
            subjects: (sem.subjects || []).map(s => ({
                subject_code: s.subject_code,
                grade: s.grade,
                marks: s.marks,
            })),
        })).sort((a, b) => Number(a.semester) - Number(b.semester));
    }, [student]);

    // Auto-predict credits on mount
    useEffect(() => {
        const allSubjectCodes = rawSemesters.flatMap(sem => sem.subjects.map(s => s.subject_code));
        if (allSubjectCodes.length === 0) return;

        const predicted: Record<string, number> = {};
        const touched = new Set<string>();

        allSubjectCodes.forEach(code => {
            predicted[code] = predictCredits(code);
            touched.add(code);
        });

        setCreditMap(predicted);
        setTouchedFields(touched);
        setIsPredicted(true);
        setStep('play');
    }, [rawSemesters]);

    const handleCreditChange = useCallback((code: string, val: number) => {
        setTouchedFields(prev => {
            const next = new Set(prev);
            if (val === -1) next.delete(code);
            else next.add(code);
            return next;
        });
        setCreditMap(prev => ({ ...prev, [code]: val === -1 ? 0 : val }));
    }, []);

    const handleConfirm = () => setStep('play');
    const handleEdit = () => setStep('setup');

    const semesters: PlaygroundSemester[] = useMemo(() => {
        return rawSemesters.map(sem => {
            const subjects: SubjectWithCredits[] = sem.subjects.map(sub => ({
                ...sub,
                semester: sem.semester,
                credits: creditMap[sub.subject_code] ?? predictCredits(sub.subject_code),
            }));
            const predictedCredits = subjects.reduce((s, sub) => s + sub.credits, 0);
            return {
                semester: sem.semester,
                sgpa: sem.sgpa,
                credits: sem.credits_secured > 0 ? sem.credits_secured : predictedCredits,
                subjects,
            };
        });
    }, [rawSemesters, creditMap]);

    if (rawSemesters.length === 0 || rawSemesters.every(s => s.subjects.length === 0)) return null;

    return (
        <div id="playground" className="card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 gap-3">
                <div className="flex items-center gap-2 min-w-0">
                    <FlaskConical size={16} style={{ color: enabled ? 'var(--accent)' : 'var(--text-muted)' }} />
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Playground Mode</p>
                    {enabled && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                            style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
                            LIVE
                        </span>
                    )}
                </div>
                <Switch checked={enabled} onChange={setEnabled} label="Toggle playground mode" />
            </div>

            {!enabled && (
                <div className="px-4 pb-4">
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        Experiment freely: edit any semester&apos;s SGPA, drop up to 2 subjects, or set a CGPA goal to see the SGPA you&apos;ll need next semester. Nothing here is saved — it&apos;s just a sandbox.
                    </p>
                </div>
            )}

            {enabled && (
                <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                    {step === 'setup' ? (
                        <CreditSetupStep
                            semesters={rawSemesters}
                            creditMap={creditMap}
                            touchedFields={touchedFields}
                            onCreditChange={handleCreditChange}
                            onConfirm={handleConfirm}
                            isPredicted={isPredicted}
                        />
                    ) : (
                        <PlaygroundBody
                            semesters={semesters}
                            officialCGPA={student.cgpa}
                            creditsCompleted={student.credits_completed}
                            onEdit={handleEdit}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
