import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DTU & NSUT CGPA Calculator — Free & Instant',
  description:
    'Free CGPA calculator for DTU, NSUT & IGDTUW students on Result Hub. Enter credits and grades to compute your CGPA instantly, or simulate future semesters to plan your target GPA.',
  alternates: { canonical: 'https://www.resulthubnsut.com/tools/cgpa-calculator' },
};

export default function CgpaCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
