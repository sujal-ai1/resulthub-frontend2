'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCollege, College } from './CollegeProvider';

const colleges: { id: College; label: string; color: string; description: string }[] = [
  { id: 'nsut', label: 'NSUT', color: 'var(--accent)', description: 'Netaji Subhas University of Technology' },
  { id: 'dtu', label: 'DTU', color: '#6366F1', description: 'Delhi Technological University' },
  { id: 'igdtuw', label: 'IGDTUW', color: '#10B981', description: 'Indira Gandhi Delhi Technical University for Women' },
];

export function CollegePicker() {
  const { hasChosen, setCollege } = useCollege();
  const pathname = usePathname();
  const [selected, setSelected] = useState<College | null>(null);
  const [animatingOut, setAnimatingOut] = useState(false);

  // Don't show the picker on the home page
  if (pathname === '/') return null;
  if (hasChosen) return null;

  const handleSelect = (id: College) => {
    setSelected(id);
    setAnimatingOut(true);
    setTimeout(() => {
      setCollege(id);
    }, 500);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${animatingOut ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
      style={{
        backgroundColor: 'color-mix(in srgb, var(--background) 85%, transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="w-full max-w-md mx-4 space-y-10 text-center">
        {/* Heading */}
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1
            className="text-4xl sm:text-5xl font-black tracking-tight"
            style={{ fontFamily: 'var(--font-bungee), Bungee, sans-serif' }}
          >
            <span style={{ color: 'var(--text-primary)' }}>RESULTHUB</span>
            <span style={{ color: 'var(--accent)' }}>NSUT</span>
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Select your college to continue
          </p>
        </div>

        {/* College cards */}
        <div className="grid gap-4">
          {colleges.map((c, i) => {
            const isSelected = selected === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className="group relative w-full rounded-2xl border-2 text-left transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{
                  animationDelay: `${200 + i * 120}ms`,
                  animationFillMode: 'backwards',
                  borderColor: isSelected ? c.color : 'var(--border)',
                  backgroundColor: isSelected ? 'var(--accent-light)' : 'var(--surface)',
                  boxShadow: isSelected ? `0 0 20px ${c.color}25` : 'var(--shadow-sm)',
                  transform: isSelected ? 'scale(1.02)' : undefined,
                }}
                onMouseEnter={(e) => {
                  if (!selected) {
                    e.currentTarget.style.borderColor = c.color;
                    e.currentTarget.style.boxShadow = `0 0 20px ${c.color}20`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selected) {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }
                }}
              >
                <div className="flex items-center justify-between px-6 py-6 sm:px-8 sm:py-7">
                  <div>
                    <div
                      className="text-xl sm:text-2xl font-black tracking-tight"
                      style={{ fontFamily: 'var(--font-bungee), Bungee, sans-serif', color: c.color }}
                    >
                      {c.label}
                    </div>
                    <div className="text-xs sm:text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                      {c.description}
                    </div>
                  </div>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isSelected ? c.color : 'var(--text-muted)'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 transition-all duration-300 group-hover:translate-x-1"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
