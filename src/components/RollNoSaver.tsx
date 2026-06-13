"use client";

import { useEffect } from 'react';

const ROLLNO_KEY = 'rh_rollno';

/** Drop this in any page that knows the user's roll number. It persists it to localStorage. */
export function RollNoSaver({ rollNo }: { rollNo: string }) {
    useEffect(() => {
        if (rollNo) {
            try { localStorage.setItem(ROLLNO_KEY, rollNo.trim().toUpperCase()); } catch {}
        }
    }, [rollNo]);
    return null;
}

/** Read the saved roll number (client-only). */
export function getSavedRollNo(): string | null {
    if (typeof window === 'undefined') return null;
    try { return localStorage.getItem(ROLLNO_KEY); } catch { return null; }
}

/** Save roll number from anywhere. */
export function saveRollNo(rollNo: string) {
    if (!rollNo) return;
    try { localStorage.setItem(ROLLNO_KEY, rollNo.trim().toUpperCase()); } catch {}
}

/** Clear the saved roll number. */
export function clearSavedRollNo() {
    try { localStorage.removeItem(ROLLNO_KEY); } catch {}
}
