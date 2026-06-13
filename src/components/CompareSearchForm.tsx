"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { saveRollNo } from '@/components/RollNoSaver';

export function CompareSearchForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Read current rolls from URL
    const currentRolls = searchParams.get('rolls');
    const [rolls, setRolls] = useState<string[]>(currentRolls ? currentRolls.split(',') : []);
    const [input, setInput] = useState('');
    const [error, setError] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const cleaned = input.trim().toUpperCase();

        if (!cleaned) return;

        if (rolls.includes(cleaned)) {
            setError('Roll number already added.');
            return;
        }

        // Roll number validation for multiple colleges
        // NSUT: 2025UCA1915, DTU: 2K22/EE/138, IGDTUW: varies
        const rollRegex = /^\d{4}[A-Z]{3}\d{4}$|^\d[A-Z0-9]{1,3}\/[A-Z]{2,4}\/\d{1,4}$/;
        if (!rollRegex.test(cleaned)) {
            // Let it pass for now but warn, user might want to try weird formats 
            // We'll enforce strictly if needed, but for now just let the API 404
        }

        const newRolls = [...rolls, cleaned];
        setRolls(newRolls);
        setInput('');
        saveRollNo(cleaned);

        updateUrl(newRolls);
    };

    const removeRoll = (rollToRemove: string) => {
        const newRolls = rolls.filter(r => r !== rollToRemove);
        setRolls(newRolls);
        updateUrl(newRolls);
    };

    const updateUrl = (newRolls: string[]) => {
        const params = new URLSearchParams(searchParams.toString());
        if (newRolls.length > 0) {
            params.set('rolls', newRolls.join(','));
        } else {
            params.delete('rolls');
        }
        router.push(`/compare?${params.toString()}`);
    };

    return (
        <div className="card p-6 mb-8 max-w-2xl mx-auto">
            <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Compare Squad</h2>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Add roll numbers to compare performance head-on.</p>

            <form onSubmit={handleAdd} className="relative w-full mb-4">
                <input
                    type="text"
                    placeholder="Roll Number (e.g. 2025UCA1915 or 2K22/EE/138)"
                    className="input w-full"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </form>

            {error && (
                <p className="text-sm mb-4" style={{ color: 'var(--danger)' }}>{error}</p>
            )}

            {rolls.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm mr-2" style={{ color: 'var(--text-muted)' }}>Comparing ({rolls.length}):</span>
                    {rolls.map(roll => (
                        <div 
                            key={roll} 
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium"
                            style={{ backgroundColor: 'var(--accent-light)', border: '1px solid var(--accent-light-border)' }}
                        >
                            <span className="font-mono" style={{ color: 'var(--accent)' }}>{roll}</span>
                            <button
                                onClick={() => removeRoll(roll)}
                                className="transition-colors p-0.5 rounded-full"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                    {rolls.length > 1 && (
                        <button
                            onClick={() => { setRolls([]); updateUrl([]); }}
                            className="text-xs ml-2 underline underline-offset-2 transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            Clear All
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
