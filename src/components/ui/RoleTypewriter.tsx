'use client';

import { useEffect, useState } from 'react';

interface RoleTypewriterProps {
  roles: string[];
  className?: string;
}

const TYPE_MS = 55;
const DELETE_MS = 28;
const HOLD_MS = 1800;

/** Types each role, holds, deletes, moves to the next. Static when there is one role or reduced motion is on. */
export default function RoleTypewriter({ roles, className }: RoleTypewriterProps) {
  // Read the motion preference after mount so server and client render the same markup first.
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const isStatic = reduceMotion || roles.length < 2;

  const [roleIndex, setRoleIndex] = useState(0);
  // Start fully typed so the server render and first paint show a real role (good for SEO and no layout jump).
  const [length, setLength] = useState(roles[0]?.length ?? 0);
  const [deleting, setDeleting] = useState(false);

  const current = roles[roleIndex % roles.length] ?? '';

  useEffect(() => {
    if (isStatic) return;
    let delay = deleting ? DELETE_MS : TYPE_MS;
    if (!deleting && length === current.length) delay = HOLD_MS;

    const timer = setTimeout(() => {
      if (!deleting && length === current.length) {
        setDeleting(true);
      } else if (deleting && length === 0) {
        setDeleting(false);
        setRoleIndex(i => (i + 1) % roles.length);
      } else {
        setLength(l => l + (deleting ? -1 : 1));
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [isStatic, deleting, length, current, roles.length]);

  if (isStatic) return <span className={className}>{roles.join(' · ')}</span>;

  return (
    <span className={className}>
      {/* Screen readers get the full list once instead of a letter-by-letter stream. */}
      <span className="sr-only">{roles.join(', ')}</span>
      <span aria-hidden="true">
        {current.slice(0, length)}
        <span className="inline-block w-[2px] h-[1em] ml-0.5 align-[-0.12em] bg-brand-400 animate-pulse" />
      </span>
    </span>
  );
}
