"use client";

import { useState, useEffect, useRef } from 'react';
import { getSavedRollNo, saveRollNo, clearSavedRollNo } from './RollNoSaver';
import { BrandHeading } from './BrandHeading';
import { useCollege } from './CollegeProvider';
import type { College } from './CollegeProvider';

interface RollNoPromptProps {
    title: string;
    description: string;
    buttonLabel: string;
    onSubmit: (rollNo: string) => void;
    /** If true, auto-submit saved roll number. Defaults to false. */
    autoLoad?: boolean;
    /** Pre-fill the input with this roll number (e.g. from URL param). */
    initialRollNo?: string;
}

export function RollNoPrompt({ title, description, buttonLabel, onSubmit, autoLoad = false, initialRollNo }: RollNoPromptProps) {
    const { college } = useCollege();
    const [rollNo, setRollNo] = useState(initialRollNo?.toUpperCase() ?? '');
    const [error, setError] = useState('');
    const [savedRoll, setSavedRoll] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const didAutoSubmit = useRef(false);

    useEffect(() => {
        // If an initialRollNo is provided and autoLoad is on, submit immediately
        if (initialRollNo && autoLoad && !didAutoSubmit.current) {
            didAutoSubmit.current = true;
            const cleaned = initialRollNo.trim().toUpperCase();
            setSavedRoll(cleaned);
            setRollNo(cleaned);
            setTimeout(() => {
                saveRollNo(cleaned);
                onSubmit(cleaned);
            }, 400);
            return;
        }

        // Otherwise check saved roll number
        const saved = getSavedRollNo();
        if (saved && !didAutoSubmit.current) {
            didAutoSubmit.current = true;
            setSavedRoll(saved);
            setRollNo(saved);
            if (autoLoad) {
                // Auto-submit after a brief moment so user sees it
                setTimeout(() => {
                    saveRollNo(saved);
                    onSubmit(saved);
                }, 600);
            } else {
                // Just prefill, don't auto-submit — show the form
                setShowForm(true);
            }
        } else {
            setShowForm(true);
            inputRef.current?.focus();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleClear() {
        clearSavedRollNo();
        didAutoSubmit.current = true; // prevent re-auto-submit
        setSavedRoll(null);
        setRollNo('');
        setShowForm(true);
        setTimeout(() => inputRef.current?.focus(), 50);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const cleaned = rollNo.trim().toUpperCase();
        if (!cleaned) { setError('Enter your roll number'); return; }
        // Accept NSUT (2024UEE4639), DTU (2K22/EE/138), IGDTUW, or any alphanumeric with slashes
        const rollRegex = /^[A-Z0-9][A-Z0-9\/]{2,}$/;
        if (!rollRegex.test(cleaned)) { setError('Invalid roll number'); return; }
        setError('');
        saveRollNo(cleaned);
        onSubmit(cleaned);
    }

    // Show saved-rollNo confirmation briefly before auto-redirect (only when autoLoad)
    if (savedRoll && !showForm && autoLoad) {
        return (
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                <div className="text-center">
                    <BrandHeading
                        className="text-3xl sm:text-5xl tracking-tight font-black"
                        style={{ fontFamily: 'var(--font-bungee), Bungee, sans-serif', color: 'var(--text-primary)' }}
                    />
                </div>
                <div className="card p-6 sm:p-8 text-center">
                    <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>
                        {title}
                    </h2>
                    <p className="text-sm mt-2 mb-4" style={{ color: 'var(--text-secondary)' }}>
                        Continuing as
                    </p>
                    <p className="mono text-lg font-bold" style={{ color: 'var(--accent)' }}>
                        {savedRoll}
                    </p>
                    <button
                        onClick={handleClear}
                        className="text-xs mt-3 underline underline-offset-2 transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                        Not you? Change roll number
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            <div className="text-center">
                <BrandHeading
                    className="text-3xl sm:text-5xl tracking-tight font-black"
                    style={{ fontFamily: 'var(--font-bungee), Bungee, sans-serif', color: 'var(--text-primary)' }}
                />
            </div>
            <div className="card p-6 sm:p-8">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>
                        {title}
                    </h2>
                    <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                        {description}
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={rollNo}
                        onChange={(e) => { setRollNo(e.target.value.toUpperCase()); setError(''); }}
                        placeholder={college === 'dtu' ? 'e.g. 2K22/EE/138' : college === 'igdtuw' ? 'e.g. 01234567890' : 'e.g. 2024UEE4639'}
                        className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors mono text-center"
                        style={{
                            backgroundColor: 'var(--surface)',
                            borderColor: error ? 'var(--danger)' : 'var(--border)',
                            color: 'var(--text-primary)',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--border)')}
                    />
                    <button
                        type="submit"
                        className="btn-accent px-5"
                    >
                        {buttonLabel}
                    </button>
                </form>
                {error && (
                    <p className="text-xs mt-2 text-center" style={{ color: 'var(--danger)' }}>{error}</p>
                )}
            </div>
        </div>
    );
}
