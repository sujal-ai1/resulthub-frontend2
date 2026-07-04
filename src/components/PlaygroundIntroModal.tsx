"use client";

import { useEffect, useState } from 'react';
import { FlaskConical, Sparkles, X } from 'lucide-react';

const PLAYGROUND_INTRO_KEY = 'rh_playground_intro_count';
const PLAYGROUND_INTRO_MAX_SHOWS = 2;

interface PlaygroundIntroModalProps {
    // Called (and the modal closed) when the user clicks the primary CTA.
    // Omit this where there's no specific student in context (e.g. the
    // results listing) — the button then just dismisses the modal.
    onTryItNow?: () => void;
}

export function PlaygroundIntroModal({ onTryItNow }: PlaygroundIntroModalProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const count = Number(window.localStorage.getItem(PLAYGROUND_INTRO_KEY) || '0');
        if (count < PLAYGROUND_INTRO_MAX_SHOWS) {
            setShow(true);
            window.localStorage.setItem(PLAYGROUND_INTRO_KEY, String(count + 1));
        }
    }, []);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="card w-full max-w-sm p-5 relative">
                <button
                    onClick={() => setShow(false)}
                    className="absolute top-3 right-3"
                    style={{ color: 'var(--text-muted)' }}
                    aria-label="Dismiss"
                >
                    <X size={16} />
                </button>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--accent-light)' }}>
                    <FlaskConical size={20} style={{ color: 'var(--accent)' }} />
                </div>
                <p className="font-black text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                    New: Playground Mode
                </p>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Experiment with your academic record risk-free — change any subject&apos;s grade, drop up to 2 subjects, or set a target CGPA and see exactly what SGPA you&apos;ll need. Nothing here is saved.
                    {!onTryItNow && ' Open any student\'s profile to try it.'}
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => { setShow(false); onTryItNow?.(); }}
                        className="btn-accent flex-1 justify-center"
                    >
                        <Sparkles size={14} /> {onTryItNow ? 'Try it now' : 'Got it'}
                    </button>
                    <button onClick={() => setShow(false)} className="btn-ghost flex-1 justify-center">
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
    );
}
