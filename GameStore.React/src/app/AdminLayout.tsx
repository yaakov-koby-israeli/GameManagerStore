import { useCallback, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

export function AdminLayout() {
  // Write --x / --y directly to the DOM — zero React re-renders on mouse move.
  const layoutRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = layoutRef.current;
    if (!el) return;
    // clientX/Y are viewport-relative, matching the fixed spotlight element.
    el.style.setProperty('--x', `${e.clientX}px`);
    el.style.setProperty('--y', `${e.clientY}px`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = layoutRef.current;
    if (!el) return;
    // Park the gradient off-screen so it doesn't freeze visibly when the cursor exits.
    el.style.setProperty('--x', '-9999px');
    el.style.setProperty('--y', '-9999px');
  }, []);

  return (
    <div ref={layoutRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="min-h-screen">
      {/*
        Spotlight — fixed + inset-0 covers the full viewport at all times.
        z-[-1] keeps it behind every page element in the root stacking context.
      */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-[-1]"
        style={{
          background:
            'radial-gradient(200px circle at var(--x, 0px) var(--y, 0px), rgba(168, 85, 247, 0.25) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 80%)',
        }}
      />

      {/*
        Navbar — fixed so it persists on scroll.
        z-50 places it above the spotlight (z-[-1]) and all page content.
        backdrop-blur-md + bg-card/80 creates the glassy dark panel; the
        spotlight glow is visible bleeding through the translucent background.
        border-b + drop-shadow form the neon purple line at the bottom edge.
      */}
      <header className={[
        'fixed top-0 inset-x-0 z-50 h-14',
        'flex items-center px-6',
        'bg-card/80 backdrop-blur-md',
        'border-b border-[#a855f7]/40',
        'shadow-[0_4px_20px_rgba(168,85,247,0.3)]',
      ].join(' ')}>
        {/* Logo */}
        <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-[#a855f7] to-[#06b6d4] bg-clip-text text-transparent select-none">
          GameStore Admin
        </span>
      </header>

      {/* pt-14 offsets the fixed navbar (h-14 = 56px) so content is never hidden behind it */}
      <main className="pt-14">
        <Outlet />
      </main>

      {/*
        Footer — normal flow (not fixed), scrolls into view at the bottom of
        long pages. border-t + upward shadow mirrors the navbar's bottom line.
      */}
      <footer className={[
        'flex items-center justify-center px-6 py-4',
        'bg-background',
        'border-t border-[#a855f7]/40',
        'shadow-[0_-4px_20px_rgba(168,85,247,0.3)]',
      ].join(' ')}>
        <p className="text-sm text-muted-foreground">
          © 2026 GameStore Admin. built by{' '}
          <span className="font-semibold text-primary">koby</span>
        </p>
      </footer>

      {/* Sonner portals toasts to <body> — placement here is just for co-location */}
      <Toaster />
    </div>
  );
}
