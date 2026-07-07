"use client";

import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { fetchSubjectAnalytics, SubjectAnalytics } from '@/lib/data';
import { useCollege } from '@/components/CollegeProvider';
import { formatGrade } from '@/lib/utils';
import { VERDICT_STYLES } from '@/lib/subjectVerdict';

// Module-level so the preview is reused across every hover in the session, not just per-component.
const previewCache = new Map<string, SubjectAnalytics | null>();
const SHOW_DELAY_MS = 250;
const HIDE_DELAY_MS = 200;
const TOOLTIP_WIDTH = 224;

export function SubjectHoverLink({ code, className, style }: { code: string; className?: string; style?: React.CSSProperties }) {
    const { college } = useCollege();
    const [preview, setPreview] = useState<SubjectAnalytics | null | undefined>(undefined);
    const [show, setShow] = useState(false);
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
    const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const anchorRef = useRef<HTMLAnchorElement>(null);

    function cancelHide() {
        if (hideTimer.current) {
            clearTimeout(hideTimer.current);
            hideTimer.current = null;
        }
    }

    // The tooltip is rendered in a portal (so it isn't clipped by overflow:hidden
    // ancestors), which means it's a separate DOM subtree from the trigger link.
    // Moving the mouse from the link onto the tooltip fires mouseleave on the link,
    // so we delay hiding briefly and cancel it if the mouse re-enters either element —
    // that's what let people bridge the small gap to actually click the tooltip.
    function scheduleHide() {
        cancelHide();
        hideTimer.current = setTimeout(() => setShow(false), HIDE_DELAY_MS);
    }

    function handleEnter() {
        cancelHide();
        if (show) return;
        showTimer.current = setTimeout(async () => {
            const rect = anchorRef.current?.getBoundingClientRect();
            if (rect) {
                const left = Math.min(rect.left, window.innerWidth - TOOLTIP_WIDTH - 12);
                setPos({ top: rect.bottom + 6, left: Math.max(8, left) });
            }
            setShow(true);

            const cacheKey = `${college}:${code}`;
            if (previewCache.has(cacheKey)) {
                setPreview(previewCache.get(cacheKey) ?? null);
                return;
            }
            const result = await fetchSubjectAnalytics(code, college);
            previewCache.set(cacheKey, result);
            setPreview(result);
        }, SHOW_DELAY_MS);
    }

    function handleLeave() {
        if (showTimer.current) clearTimeout(showTimer.current);
        scheduleHide();
    }

    return (
        <>
            <a
                ref={anchorRef}
                href={`/subjects/${encodeURIComponent(code)}`}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                className={`underline decoration-dotted underline-offset-2 hover:opacity-80 transition-opacity ${className ?? ''}`}
                style={style}
            >
                {code}
            </a>
            {show && pos && typeof document !== 'undefined' && createPortal(
                <a
                    href={`/subjects/${encodeURIComponent(code)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={cancelHide}
                    onMouseLeave={scheduleHide}
                    className="fixed z-50 rounded-lg p-3 shadow-xl text-xs block"
                    style={{ top: pos.top, left: pos.left, width: TOOLTIP_WIDTH, backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                    {preview === undefined && <p style={{ color: 'var(--text-muted)' }}>Loading…</p>}
                    {preview === null && <p style={{ color: 'var(--text-muted)' }}>No historical data for {code} yet.</p>}
                    {preview && (
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                                <span className="mono font-bold" style={{ color: 'var(--text-primary)' }}>{preview.subject_code}</span>
                                <span
                                    className="px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0"
                                    style={{ backgroundColor: (VERDICT_STYLES[preview.verdict.label] || VERDICT_STYLES['Moderate Pick']).text, color: '#fff' }}
                                >
                                    {preview.verdict.label}
                                </span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Avg GPA <strong style={{ color: 'var(--text-primary)' }}>{formatGrade(preview.avg_marks, 2)}</strong> · {preview.difficulty}
                            </p>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Pass rate <strong style={{ color: 'var(--text-primary)' }}>{preview.pass_percentage.toFixed(0)}%</strong> · {preview.total_students} students
                            </p>
                            <p className="pt-0.5" style={{ color: 'var(--accent)' }}>Click for full analytics →</p>
                        </div>
                    )}
                </a>,
                document.body
            )}
        </>
    );
}
