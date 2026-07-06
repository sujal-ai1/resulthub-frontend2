import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Result Hub — Built by Students, for Students',
  description:
    'Result Hub (ResultHub) is a free, student-built platform for DTU, NSUT & IGDTUW results, leaderboards, and analytics. Meet the team behind Result Hub DTU & NSUT.',
  alternates: { canonical: 'https://www.resulthubnsut.com/about' },
};

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

// ── Social icon SVGs (inline, no extra dep) ───────────────
function GlobeIcon({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    );
}

function GitHubIcon({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
    );
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
        </svg>
    );
}

// ── Maker card ────────────────────────────────────────────
interface MakerCardProps {
    name: string;
    role: string;
    imageUrl: string;
    contributions: string[];
    websiteUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
}

function MakerCard({ name, role, imageUrl, contributions, websiteUrl, githubUrl, linkedinUrl }: MakerCardProps) {
    const socials = [
        { label: 'Website', icon: <GlobeIcon size={13} />, url: websiteUrl },
        { label: 'GitHub', icon: <GitHubIcon size={13} />, url: githubUrl },
        { label: 'LinkedIn', icon: <LinkedInIcon size={13} />, url: linkedinUrl },
    ];

    return (
        <div className="card p-6 flex flex-col gap-5">
            {/* Avatar + name (centered) */}
            <div className="flex flex-col items-center gap-3 text-center">
                <div
                    className="w-20 h-20 rounded-full overflow-hidden shrink-0"
                    style={{ boxShadow: '0 0 0 3px var(--accent)' }}
                >
                    <Image src={imageUrl} alt={name} width={80} height={80} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h3 className="font-black text-lg leading-tight" style={{ color: 'var(--text-primary)' }}>
                        {name}
                    </h3>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {role}
                    </p>
                </div>
            </div>

            {/* Contributions */}
            <div>
                <p className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Key Contributions:</p>
                <ul className="space-y-1.5">
                    {contributions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <span className="mt-0.5 shrink-0" style={{ color: 'var(--success)' }}>✓</span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Social links */}
            <div className="mt-auto">
                <p className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Connect:</p>
                <div className="flex items-center gap-2">
                    {socials.map(s => (
                        <a
                            key={s.label}
                            href={s.url || '#'}
                            target={s.url ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:opacity-80"
                            style={{
                                borderColor: 'var(--border)',
                                color: s.url ? 'var(--text-secondary)' : 'var(--text-muted)',
                                backgroundColor: 'var(--surface-elevated)',
                                cursor: s.url ? 'pointer' : 'not-allowed',
                                opacity: s.url ? 1 : 0.5,
                            }}
                            title={s.url ? s.label : 'Coming soon'}
                        >
                            {s.icon}
                            {s.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────
export default function AboutPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-10">

            {/* Back */}
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity"
                style={{ color: 'var(--text-muted)' }}>
                <ArrowLeft size={14} />
                Home
            </Link>

            {/* ── Hero ── */}
            <div className="text-center space-y-4">
                <h1
                    className="text-5xl sm:text-7xl font-black tracking-tight"
                    style={{ fontFamily: 'var(--font-bungee), Bungee, sans-serif', color: 'var(--text-primary)' }}
                >
                    RESULTHUB
                    <span style={{ color: 'var(--accent)' }}>NSUT</span>
                </h1>
            </div>

            {/* ── Story ── */}
            <div className="card p-6 sm:p-8 space-y-4">
                <h2 className="font-black text-xl" style={{ color: 'var(--text-primary)' }}>
                    Why we built this
                </h2>
                <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <p>
    Many of us used ResultHubDTU frequently and often wondered - why isn’t there
    something like this for ResultHubNSUT? That idea eventually led to the creation of 
    <strong style={{ color: 'var(--text-primary)' }}> ResultHubNSUT</strong>.
</p>

<p>
    While ResultHubDTU was useful, over time it became cluttered with ads and
    still lacked several features students actually wanted. We decided to build
    something better - a cleaner platform with a significantly improved UI and
    tools that make exploring academic data easier and more meaningful.
</p>

<p>
    ResultHubNSUT turns raw marksheet data into something genuinely useful.
    You can explore leaderboards, filter by batch and branch, view detailed
    academic profiles with SGPA trends, compare students side-by-side, find
    your academic twins, analyse subject difficulty, simulate subject drops,
    and even get a Spotify-Wrapped style semester recap.
</p>

<p>
    And this is just the beginning. We're continuously shipping improvements
    and new features to make the platform more insightful for NSUT students.
</p>
                </div>
            </div>

            {/* ── Makers ── */}
            <div>
                <h2 className="font-black text-xl mb-4" style={{ color: 'var(--text-primary)' }}>
                    The makers
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <MakerCard
                        name="Sujal Chaudhary"
                        role="Lead Developer & AI Engineer"
                        imageUrl="/sujal.png"
                        contributions={[
                            'Architected the complete AI-powered agent',
                            'Built scalable backend infrastructure with Node.js',
                            'Implemented data pipelines and OCR processing',
                            'Designed the API layer and deployment',
                            'Integrated multiple AI models and APIs',
                        ]}
                        websiteUrl={"https://www.sujal.info"}
                        githubUrl={"https://sujal.info/github"}
                        linkedinUrl={"https://sujal.info/linkedin"}
                    />
                    <MakerCard
                        name="Aryan Anand"
                        role="Frontend Developer"
                        imageUrl="/aryan.png"
                        contributions={[
                            'Designed and built the frontend UI system',
                            'Implemented responsive layouts with Next.js',
                            'Created the Wrapped experience and analytics dashboards',
                            'Obsessed with making things look good and feel fast',
                        ]}
                        websiteUrl={"https://www.devaryan.tech"}
                        githubUrl={"https://github.com/ar586"}
                        linkedinUrl={"https://www.linkedin.com/in/aryan-anand-4aba06309/"}
                    />
                </div>
            </div>

            {/* ── Disclaimer ── */}
            <div
                className="rounded-xl p-5 space-y-2 border"
                style={{
                    backgroundColor: 'var(--surface-elevated)',
                    borderColor: 'var(--border)',
                }}
            >
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">⚠️</span>
                    <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                        Data Accuracy Disclaimer
                    </h3>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    All academic data on ResultHubNSUT has been collected and processed using OCR
                    (Optical Character Recognition) from official marksheet documents. While we strive
                    for accuracy, OCR is an imperfect process — there may be occasional discrepancies
                    in marks, grades, or other values. This data is provided for informational and
                    analytical purposes only.
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    If you spot an inaccuracy in your own data, please cross-check with your official
                    marksheet from NSUT. We are not affiliated with NSUT officially in any capacity.
                </p>
            </div>
        </div>
    );
}
