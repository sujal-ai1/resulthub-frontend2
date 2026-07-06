import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Result Hub DTU — Check DTU Results, SGPA Leaderboard & Analytics',
  description:
    'Result Hub DTU is the fastest way to check DTU results online. Search any Delhi Technological University student by name or roll number, view SGPA & CGPA, branch-wise leaderboards, semester analytics, subject difficulty and more — free on ResultHub.',
  keywords: [
    'result hub dtu',
    'resulthub dtu',
    'resulthubdtu',
    'result hub',
    'resulthub',
    'DTU result hub',
    'DTU results',
    'DTU result checker',
    'DTU SGPA',
    'DTU CGPA calculator',
    'DTU leaderboard',
    'DTU semester results',
    'Delhi Technological University results',
    'DTU branch wise results',
    'DTU analytics',
  ],
  alternates: { canonical: 'https://www.resulthubnsut.com/dtu' },
  openGraph: {
    title: 'Result Hub DTU — DTU Results, SGPA Leaderboard & Analytics',
    description:
      'Check DTU results instantly on Result Hub DTU. SGPA leaderboards, semester analytics, subject difficulty, compare students & CGPA calculator — free for all Delhi Technological University students.',
    url: 'https://www.resulthubnsut.com/dtu',
  },
};

const dtuFeatures = [
  { href: '/result', title: 'DTU Results & Leaderboards', desc: 'Search any DTU student by name or roll number — full result with SGPA, grades, and batch rank.' },
  { href: '/analytics', title: 'DTU Analytics Dashboard', desc: 'Branch-wise SGPA trends, topper lists, and performance breakdowns across DTU semesters.' },
  { href: '/subjects', title: 'DTU Subject Difficulty', desc: 'See which DTU subjects are toughest, based on real grade distributions and fail rates.' },
  { href: '/compare', title: 'Compare DTU Students', desc: 'Side-by-side SGPA comparison of DTU students across all semesters.' },
  { href: '/wrapped', title: 'DTU Semester Wrapped', desc: 'Your personalized DTU semester recap — rank, SGPA journey, and a shareable card.' },
  { href: '/tools/cgpa-calculator', title: 'DTU CGPA Calculator', desc: 'Compute your DTU CGPA instantly with custom credit and grade inputs.' },
];

const faqs = [
  {
    q: 'What is Result Hub DTU?',
    a: 'Result Hub DTU is the DTU section of ResultHub — a free, student-built platform to check Delhi Technological University (DTU) results. It offers SGPA leaderboards, branch-wise analytics, subject difficulty maps, student comparison, semester wrapped, and a CGPA calculator, all in one place.',
  },
  {
    q: 'How do I check my DTU result on Result Hub DTU?',
    a: 'Open the Results page, select DTU as your college, and search your name or roll number. You will instantly see your full DTU result with SGPA, subject-wise grades, and your rank within your batch and branch.',
  },
  {
    q: 'Is Result Hub DTU free to use?',
    a: 'Yes, Result Hub DTU is completely free. It is built by students, for students of DTU, NSUT, and IGDTUW — no login or payment required to check results.',
  },
  {
    q: 'How is Result Hub DTU different from the official DTU result portal?',
    a: 'The official DTU portal only shows individual PDF results. Result Hub DTU indexes them into a searchable database, adding SGPA leaderboards, branch-wise analytics, subject difficulty insights, student comparison, and shareable semester recaps on top.',
  },
  {
    q: 'Can I see DTU branch-wise toppers and leaderboards on Result Hub DTU?',
    a: 'Yes. The leaderboard and analytics pages let you filter DTU results by batch and branch, view topper lists, and track SGPA trends across semesters.',
  },
];

export default function ResultHubDtuPage() {
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
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08]"
            style={{
              fontFamily: 'var(--font-bungee), Bungee, sans-serif',
              color: 'var(--text-primary)',
            }}
          >
            RESULT HUB <span style={{ color: 'var(--accent)' }}>DTU</span>
          </h1>

          <p
            className="mt-5 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            The fastest way to check{' '}
            <strong style={{ color: 'var(--text-primary)' }}>DTU results</strong> — SGPA leaderboards,
            semester analytics, subject difficulty, and every academic tool for{' '}
            <strong style={{ color: 'var(--text-primary)' }}>Delhi Technological University</strong> students, free.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/result" className="btn-accent px-6 py-2.5 text-base rounded-lg">
              Check DTU Results
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/analytics" className="btn-ghost px-6 py-2.5 text-base rounded-lg">
              DTU Analytics
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>
          Everything Result Hub DTU Offers
        </h2>
        <p className="text-center text-sm sm:text-base mb-10 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          One platform for every DTU semester — results, rankings, analytics, and tools.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dtuFeatures.map((f) => (
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

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="card p-6 sm:p-8 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Why DTU Students Use Result Hub
          </h2>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>
              Checking your semester result on the official DTU portal means downloading a PDF and scanning for your roll number.{' '}
              <strong style={{ color: 'var(--text-primary)' }}>Result Hub DTU</strong> turns those same results into a
              searchable database — look up any Delhi Technological University student&apos;s SGPA, subject grades, and
              batch rank in seconds, the moment results are declared.
            </p>
            <p>
              Beyond raw results, the <em>Analytics Dashboard</em> shows branch-wise SGPA trends and topper lists for every
              DTU batch, the <em>Subject Difficulty</em> map reveals which DTU subjects have the harshest grade
              distributions, and the <em>CGPA Calculator</em> lets you simulate grade scenarios before results are out.
              You can also compare DTU students side by side, find your academic twin, and generate a shareable{' '}
              <em>Semester Wrapped</em> card.
            </p>
            <p>
              Result Hub is completely free and also supports{' '}
              <strong style={{ color: 'var(--text-primary)' }}>NSUT</strong> and{' '}
              <strong style={{ color: 'var(--text-primary)' }}>IGDTUW</strong> — so whichever Delhi engineering college
              your friends are at, everyone&apos;s results live in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6" style={{ color: 'var(--text-primary)' }}>
          Result Hub DTU — Frequently Asked Questions
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Result Hub', item: 'https://www.resulthubnsut.com' },
                { '@type': 'ListItem', position: 2, name: 'Result Hub DTU', item: 'https://www.resulthubnsut.com/dtu' },
              ],
            }),
          }}
        />
      </section>
    </>
  );
}
