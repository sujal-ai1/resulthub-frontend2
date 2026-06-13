'use client';

import { useCollege, COLLEGE_LABELS } from './CollegeProvider';

export function FooterBrand() {
  const { college } = useCollege();
  return (
    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
      © {new Date().getFullYear()} ResultHub{COLLEGE_LABELS[college]} · Built for {COLLEGE_LABELS[college]} Students
    </span>
  );
}
