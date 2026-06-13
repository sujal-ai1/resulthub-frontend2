'use client';

import { useCollege } from './CollegeProvider';
import { useEffect, useRef, useState } from 'react';

interface BrandHeadingProps {
  className?: string;
  style?: React.CSSProperties;
}

export function BrandHeading({ className, style }: BrandHeadingProps) {
  const { collegeLabel } = useCollege();
  const [displayLabel, setDisplayLabel] = useState(collegeLabel);
  const [animating, setAnimating] = useState(false);
  const prevLabel = useRef(collegeLabel);

  useEffect(() => {
    if (prevLabel.current !== collegeLabel) {
      setAnimating(true);
      // After fade-out, swap text and fade-in
      const t = setTimeout(() => {
        setDisplayLabel(collegeLabel);
        setAnimating(false);
        prevLabel.current = collegeLabel;
      }, 250);
      return () => clearTimeout(t);
    }
  }, [collegeLabel]);

  return (
    <h1 className={className} style={style}>
      RESULTHUB
      <span
        style={{
          color: 'var(--accent)',
          display: 'inline-block',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateY(8px)' : 'translateY(0)',
        }}
      >
        {displayLabel}
      </span>
    </h1>
  );
}
