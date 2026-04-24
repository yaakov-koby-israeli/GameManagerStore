import { useCallback, useRef } from 'react';
import { Outlet } from 'react-router-dom';

export function AdminLayout() {
  // Write --x / --y directly to the DOM — zero React re-renders on mouse move.
  const layoutRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = layoutRef.current;
    if (!el) return;
    // clientX/Y are already viewport-relative, matching the fixed spotlight.
    el.style.setProperty('--x', `${e.clientX}px`);
    el.style.setProperty('--y', `${e.clientY}px`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = layoutRef.current;
    if (!el) return;
    // Move gradient off-screen so it doesn't freeze visibly in the corner.
    el.style.setProperty('--x', '-9999px');
    el.style.setProperty('--y', '-9999px');
  }, []);

  return (
    <div ref={layoutRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="min-h-screen">
      {/*
        Fixed + inset-0 → always covers the full viewport, never clipped by any
        scrolling container or local stacking context.
        z-[-1]           → sits behind every page element in the root stacking context.
        pointer-events-none → cursor/click events pass through unobstructed.
      */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-[-1]"
        style={{
          background:
            'radial-gradient(200px circle at var(--x, 0px) var(--y, 0px), rgba(168, 85, 247, 0.25) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 80%)',
        }}
      />
      <Outlet />
    </div>
  );
}
