'use client';

import { useEffect, useState } from 'react';

/**
 * True once the page has scrolled past the utility strip. Drives the header's
 * compact state: the strip collapses, the logo steps down, and search and the
 * basket stay exactly where they were. Deliberately a single boolean with a
 * dead zone, so the header cannot flicker around the threshold.
 */
export function useCompactHeader(threshold = 28) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const y = window.scrollY;
      setCompact((current) => (current ? y > threshold * 0.5 : y > threshold));
    };
    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return compact;
}
