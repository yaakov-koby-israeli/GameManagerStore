import { useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/shared/context/ThemeContext';

// direction  1 = Dark→Light : Moon exits right,  Sun  enters from left
// direction -1 = Light→Dark : Sun  exits left,   Moon enters from right
const variants: Variants = {
  enter: (dir: number) => ({
    x:      dir > 0 ? -16 : 16,
    rotate: dir > 0 ? -20 : 20,
    opacity: 0,
  }),
  center: {
    x: 0,
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: (dir: number) => ({
    x:      dir > 0 ? 16 : -16,
    rotate: dir > 0 ? 20 : -20,
    opacity: 0,
    transition: { duration: 0.15, ease: 'easeIn' },
  }),
};

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  // direction drives the slide direction; starts at 0 so the initial icon
  // renders without animation (AnimatePresence initial={false} handles this).
  const [direction, setDirection] = useState(0);

  function handleClick() {
    setDirection(theme === 'dark' ? 1 : -1);
    toggleTheme();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={[
        'relative h-8 w-8 overflow-hidden rounded-lg',
        'border border-border bg-secondary',
        'cursor-pointer text-muted-foreground transition-colors',
        'hover:bg-accent hover:text-foreground',
        'outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
      ].join(' ')}
    >
      {/* initial={false} prevents the icon from animating on first render */}
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.span
          key={theme}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 flex items-center justify-center"
        >
          {theme === 'dark' ? (
            <Moon className="size-4" aria-hidden />
          ) : (
            <Sun className="size-4" aria-hidden />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
