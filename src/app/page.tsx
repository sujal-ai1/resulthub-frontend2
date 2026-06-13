import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ResultHubNSUT — NSUT, DTU & Delhi University Results, Analytics & Leaderboards',
  description:
    'ResultHubNSUT is the #1 student-built academic platform for NSUT, DTU & Delhi colleges. Check results, SGPA leaderboards, semester analytics, subject difficulty, compare students, academic twins, semester wrapped & more. ResultHubNSUT · ResultHubDTU · ResultHubDelhi.',
  alternates: { canonical: 'https://www.resulthubnsut.com' },
};

const features = [
  { href: '/result', title: 'Results & Leaderboards', desc: 'Instantly look up semester results and SGPA rankings - sorted by batch, branch, and college.' },
  { href: '/analytics', title: 'Analytics Dashboard', desc: 'Branch-wise SGPA trends, topper lists, and performance breakdowns across semesters.' },
  { href: '/compare', title: 'Compare Students', desc: 'Side-by-side SGPA comparison of N students across all semesters.' },
  { href: '/battle', title: 'Battle Mode', desc: 'Head-to-head academic showdown - find which branch and year performs best.' },
  { href: '/subjects', title: 'Subject Difficulty', desc: 'See which subjects are the toughest - based on real grade distributions and fail rates.' },
  { href: '/wrapped', title: 'Semester Wrapped', desc: 'Your personalized semester recap - top subjects, rank, SGPA journey, shareable card.' },
  { href: '/twin', title: 'Academic Twin', desc: 'Find the student with the most similar academic profile to yours across semesters.' },
  { href: '/tools/cgpa-calculator', title: 'CGPA Calculator', desc: 'Compute your cumulative GPA instantly - supports custom credit and grade inputs.' },
];

const colleges = [
  { name: 'NSUT', full: 'Netaji Subhas University of Technology', color: '#0EA5E9' },
  { name: 'DTU', full: 'Delhi Technological University', color: '#6366F1' },
  { name: 'IGDTUW', full: 'Indira Gandhi Delhi Technical University for Women', color: '#10B981' },
];

const stats = [
  { value: '3', label: 'Colleges Supported' },
  { value: '50k+', label: 'Results Indexed' },
  { value: '10k+', label: 'Active Users' },
];

const faqs = [
  {
    q: 'What is ResultHubNSUT?',
    a: 'ResultHubNSUT is a free, student-built platform to check NSUT, DTU and IGDTUW results. It provides SGPA leaderboards, analytics, semester wrapped, subject difficulty maps, and tools like a CGPA calculator - all in one place.',
  },
  {
    q: 'How do I check my NSUT or DTU or IGDTUW results on ResultHubNSUT?',
    a: 'Head to the Results page and search your name or roll number. You\'ll see your full result with SGPA, grades, and rank. You can also compare with classmates or view analytics for your batch.',
  },
  {
    q: 'Is ResultHubNSUT free to use?',
    a: 'Yes! ResultHubNSUT is completely free. It\'s built by NSUT students for students of NSUT, DTU, and IGDTUW.',
  },
  {
    q: 'What colleges does ResultHubNSUT support?',
    a: 'ResultHubNSUT currently supports NSUT (Netaji Subhas University of Technology), DTU (Delhi Technological University), and IGDTUW (Indira Gandhi Delhi Technical University for Women).',
  },
  {
    q: 'What is Semester Wrapped on ResultHubNSUT?',
    a: 'Semester Wrapped is a personalized visual recap of your academic semester - showing your SGPA, rank, top subjects, and a shareable card you can post on social media.',
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, var(--accent-light) 0%, transparent 70%)',
          }}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 sm:pb-16 text-center">
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.08]"
            style={{
              fontFamily: 'var(--font-bungee), Bungee, sans-serif',
              color: 'var(--text-primary)',
            }}
          >
            RESULTHUB<span style={{ color: 'var(--accent)' }}>NSUT</span>
          </h1>

          <p
            className="mt-5 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            The <strong style={{ color: 'var(--text-primary)' }}>#1 student-built platform</strong>{' '}
            for NSUT, DTU &amp; IGDTUW - results, leaderboards, analytics, and everything academic in one place.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/result"
              className="btn-accent px-6 py-2.5 text-base rounded-lg"
            >
              Check Results
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/analytics"
              className="btn-ghost px-6 py-2.5 text-base rounded-lg"
            >
              View Analytics
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {colleges.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-2 text-xs sm:text-sm font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span>
                  <strong style={{ color: 'var(--text-primary)' }}>{c.name}</strong>
                  <span className="hidden sm:inline"> — {c.full}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card text-center py-6 px-3">
              <div className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--accent)' }}>
                {s.value}
              </div>
              <div className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>
          Everything You Need, One Platform
        </h2>
        <p className="text-center text-sm sm:text-base mb-10 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          ResultHubNSUT &middot; ResultHubDTU &middot; ResultHubIGDTUW - built for Delhi&apos;s top engineering colleges.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <Link key={f.href} href={f.href} className="card-hover p-5 flex flex-col gap-3 group">
              <h3 className="font-semibold text-sm group-hover:underline" style={{ color: 'var(--text-primary)' }}>
                {f.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {f.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10" style={{ color: 'var(--text-primary)' }}>
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Search or Browse', desc: 'Enter your name, roll number, or filter by batch and branch to find any student.' },
            { step: '2', title: 'Explore Your Data', desc: 'View results, SGPA trends, rankings, subject analytics, and your personalized Wrapped.' },
            { step: '3', title: 'Compare & Share', desc: 'Compare with classmates, find your academic twin, and share your Wrapped card.' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div
                className="w-10 h-10 rounded-full mx-auto flex items-center justify-center text-lg font-bold"
                style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
              >
                {item.step}
              </div>
              <h3 className="font-semibold mt-3 mb-1" style={{ color: 'var(--text-primary)' }}>
                {item.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/result" className="btn-accent px-8 py-2.5 text-base rounded-lg">
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section> */}

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="card p-6 sm:p-8 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Why 10,000+ Students Use ResultHubNSUT Every Semester
          </h2>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>
              Checking semester results shouldn&apos;t mean refreshing a slow university portal for hours.{' '}
              <strong style={{ color: 'var(--text-primary)' }}>ResultHubNSUT</strong> indexes over 50,000 results from{' '}
              <strong style={{ color: 'var(--text-primary)' }}>NSUT</strong>,{' '}
              <strong style={{ color: 'var(--text-primary)' }}>DTU</strong>, and{' '}
              <strong style={{ color: 'var(--text-primary)' }}>IGDTUW</strong> so you can look up any student&apos;s SGPA, grades, and batch rank in seconds — the moment results are out.
            </p>
            <p>
              But results are just the starting point. Use the <em>Analytics Dashboard</em> to spot branch-wise SGPA trends and topper lists,
              check <em>Subject Difficulty</em> maps powered by real grade distributions before picking electives,
              or fire up <em>Battle Mode</em> to see how your branch stacks up against others. Every feature runs on the same live dataset, so the numbers
              you see are always current.
            </p>
            <p>
              The tools students love most are the personal ones:{' '}
              <em>Semester Wrapped</em> turns your academic journey into a shareable visual card,{' '}
              <em>Academic Twin</em> finds the student whose grades most closely mirror yours across semesters,
              and the <em>CGPA Calculator</em> lets you plan ahead by simulating different grade scenarios.
            </p>
            <p>
              ResultHubNSUT is completely free, built and maintained by NSUT students who were tired of scattered data and
              clunky portals. Whether you&apos;re at{' '}
              <strong style={{ color: 'var(--text-primary)' }}>Netaji Subhas University of Technology</strong>,{' '}
              <strong style={{ color: 'var(--text-primary)' }}>Delhi Technological University</strong>, or{' '}
              <strong style={{ color: 'var(--text-primary)' }}>Indira Gandhi Delhi Technical University for Women</strong>{' '}
              — one platform, every tool you need, zero cost.
            </p>
          </div>
        </div>
      </section>

      {/* ━━ FAQ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6" style={{ color: 'var(--text-primary)' }}>
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="card group">
              <summary
                className="cursor-pointer p-4 font-medium text-sm flex items-center justify-between"
                style={{ color: 'var(--text-primary)' }}
              >
                {faq.q}
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="shrink-0 ml-2 transition-transform duration-300 group-open:rotate-180"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <div className="px-4 pb-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        {/* FAQ JSON-LD for rich snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: { '@type': 'Answer', text: faq.a },
              })),
            }),
          }}
        />
      </section>

      {/* ━━ Structured data ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'ResultHub',
            alternateName: ['ResultHubNSUT', 'ResultHubDTU', 'ResultHubDelhi', 'resulthubnust', 'resulthubdelhi', 'resulthubdtu'],
            url: 'https://www.resulthubnsut.com',
          }),
        }}
      />
    </>
  );
}
