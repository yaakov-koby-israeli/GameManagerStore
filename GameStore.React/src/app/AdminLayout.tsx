import { useCallback, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useTheme } from '@/shared/context/ThemeContext';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

// Dark: vibrant neon purple/blue halo — centred on the cursor.
const SPOTLIGHT_DARK =
  'radial-gradient(200px circle at var(--x, 0px) var(--y, 0px), rgba(168, 85, 247, 0.25) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 80%)';

// Light: barely-visible frosted slate whisper — marks cursor position without staining the white page.
const SPOTLIGHT_LIGHT =
  'radial-gradient(200px circle at var(--x, 0px) var(--y, 0px), rgba(148, 163, 184, 0.15) 0%, transparent 60%)';

export function AdminLayout() {
  const { theme } = useTheme();

  // Write --x / --y directly to the DOM — zero React re-renders on mouse move.
  const layoutRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = layoutRef.current;
    if (!el) return;
    el.style.setProperty('--x', `${e.clientX}px`);
    el.style.setProperty('--y', `${e.clientY}px`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = layoutRef.current;
    if (!el) return;
    el.style.setProperty('--x', '-9999px');
    el.style.setProperty('--y', '-9999px');
  }, []);

  return (
    <div ref={layoutRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="min-h-screen">
      {/*
        Spotlight — fixed + inset-0 covers the full viewport at all times.
        The gradient string switches on theme change (React re-render).
        --x / --y still update via setProperty, outside React's cycle.
      */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-[-1]"
        style={{ background: theme === 'dark' ? SPOTLIGHT_DARK : SPOTLIGHT_LIGHT }}
      />

      {/* Navbar */}
      <header className={[
        'fixed top-0 inset-x-0 z-50 h-14',
        'flex items-center justify-between px-6',
        'bg-card/80 backdrop-blur-md',
        'border-b border-[#a855f7]/40',
        'shadow-[0_4px_20px_rgba(168,85,247,0.3)]',
      ].join(' ')}>
        <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-[#a855f7] to-[#06b6d4] bg-clip-text text-transparent select-none">
          GameStore Admin
        </span>
        <ThemeToggle />
      </header>

      <main className="pt-14">
        <Outlet />
      </main>

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

      <Toaster />
    </div>
  );
}
