// Design tokens — single source of truth for the GameStore admin UI aesthetic.
// Values here are mirrored as --gs-* CSS custom properties in index.css.

// ─── Primitive palette ────────────────────────────────────────────────────────

export const palette = {
  white:    '#ffffff',

  // Slate (neutral scale)
  slate50:  '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',

  // Blue (primary action / accent)
  blue50:  '#eff6ff',
  blue100: '#dbeafe',
  blue300: '#93c5fd',
  blue400: '#60a5fa',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue700: '#1d4ed8',

  // Red (destructive / danger)
  red50:   '#fef2f2',
  red100:  '#fee2e2',
  red400:  '#f87171',
  red500:  '#ef4444',
  red600:  '#dc2626',

  // Green (success)
  green50:  '#f0fdf4',
  green400: '#4ade80',
  green500: '#22c55e',
  green600: '#16a34a',

  // Amber (warning)
  amber50:  '#fffbeb',
  amber400: '#fbbf24',
  amber500: '#f59e0b',

  // Violet (chart / decorative)
  violet500: '#8b5cf6',
} as const

export type PaletteKey = keyof typeof palette

// ─── Semantic color tokens ────────────────────────────────────────────────────
// Maps conceptual roles to palette values. Use CSS vars (see `cssVars`) in components.

export const colors = {
  // Page & panel surfaces
  background:           palette.slate50,    // outermost page bg — slightly cool off-white
  surface:              palette.white,      // cards, panels — pure white to pop against bg
  surfaceSubtle:        palette.slate100,   // inner sections, table headers, muted areas

  // Borders
  border:               palette.slate200,   // default dividers, input borders
  borderStrong:         palette.slate300,   // focused or prominent borders

  // Text
  textPrimary:          palette.slate900,   // headings, body copy
  textSecondary:        palette.slate600,   // labels, secondary info
  textMuted:            palette.slate400,   // placeholders, hints, disabled
  textOnAccent:         palette.white,      // text on colored backgrounds

  // Accent — blue (interactive: primary buttons, links, focus)
  accentBlue:           palette.blue500,
  accentBlueHover:      palette.blue600,
  accentBlueForeground: palette.white,
  accentBlueSubtle:     palette.blue50,     // hover tint on rows/items
  accentBlueBorder:     palette.blue100,
  accentBlueMutedFg:    palette.blue700,    // text on accentBlueSubtle bg

  // Danger — red (destructive actions, error states)
  dangerRed:            palette.red500,
  dangerRedHover:       palette.red600,
  dangerRedForeground:  palette.white,
  dangerRedSubtle:      palette.red50,
  dangerRedBorder:      palette.red100,

  // Success
  successGreen:         palette.green500,
  successGreenSubtle:   palette.green50,

  // Warning
  warningAmber:         palette.amber500,
  warningAmberSubtle:   palette.amber50,

  // Focus ring
  focusRing:            palette.blue300,
} as const

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const spacing = {
  0:    '0px',
  px:   '1px',
  1:    '0.25rem',   //  4px
  2:    '0.5rem',    //  8px
  3:    '0.75rem',   // 12px
  4:    '1rem',      // 16px
  5:    '1.25rem',   // 20px
  6:    '1.5rem',    // 24px
  8:    '2rem',      // 32px
  10:   '2.5rem',    // 40px
  12:   '3rem',      // 48px
  16:   '4rem',      // 64px
  20:   '5rem',      // 80px
  24:   '6rem',      // 96px
} as const

// ─── Border radii ─────────────────────────────────────────────────────────────

export const radii = {
  none:  '0px',
  sm:    '0.25rem',   //  4px — tags, badges
  md:    '0.375rem',  //  6px — small inputs
  lg:    '0.5rem',    //  8px — cards, inputs (default)
  xl:    '0.75rem',   // 12px — modals, large panels
  '2xl': '1rem',      // 16px — extra-large cards
  full:  '9999px',    //       — pills
} as const

// ─── Typography ───────────────────────────────────────────────────────────────

export const fontSizes = {
  xs:   { size: '0.75rem',  lineHeight: '1rem'    },  // 12/16
  sm:   { size: '0.875rem', lineHeight: '1.25rem' },  // 14/20
  base: { size: '1rem',     lineHeight: '1.5rem'  },  // 16/24
  lg:   { size: '1.125rem', lineHeight: '1.75rem' },  // 18/28
  xl:   { size: '1.25rem',  lineHeight: '1.75rem' },  // 20/28
  '2xl':{ size: '1.5rem',   lineHeight: '2rem'    },  // 24/32
  '3xl':{ size: '1.875rem', lineHeight: '2.25rem' },  // 30/36
  '4xl':{ size: '2.25rem',  lineHeight: '2.5rem'  },  // 36/40
} as const

export const fontWeights = {
  normal:   400,
  medium:   500,
  semibold: 600,
  bold:     700,
} as const

// ─── Shadows ──────────────────────────────────────────────────────────────────

export const shadows = {
  none: 'none',
  xs:   '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm:   '0 1px 3px 0 rgb(0 0 0 / 0.10), 0 1px 2px -1px rgb(0 0 0 / 0.10)',
  md:   '0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)',
  lg:   '0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.10)',
  xl:   '0 20px 25px -5px rgb(0 0 0 / 0.10), 0 8px 10px -6px rgb(0 0 0 / 0.10)',
} as const

// ─── CSS variable name map ────────────────────────────────────────────────────
// Use these in JS/TS when you need to reference a token as a CSS var string,
// e.g. `style={{ color: `var(${cssVars.textMuted})` }}`.

export const cssVars = {
  background:           '--gs-background',
  surface:              '--gs-surface',
  surfaceSubtle:        '--gs-surface-subtle',
  border:               '--gs-border',
  borderStrong:         '--gs-border-strong',
  textPrimary:          '--gs-text-primary',
  textSecondary:        '--gs-text-secondary',
  textMuted:            '--gs-text-muted',
  textOnAccent:         '--gs-text-on-accent',
  accentBlue:           '--gs-accent-blue',
  accentBlueForeground: '--gs-accent-blue-fg',
  accentBlueSubtle:     '--gs-accent-blue-subtle',
  accentBlueBorder:     '--gs-accent-blue-border',
  accentBlueMutedFg:    '--gs-accent-blue-muted-fg',
  dangerRed:            '--gs-danger-red',
  dangerRedForeground:  '--gs-danger-red-fg',
  dangerRedSubtle:      '--gs-danger-red-subtle',
  dangerRedBorder:      '--gs-danger-red-border',
  successGreen:         '--gs-success-green',
  successGreenSubtle:   '--gs-success-green-subtle',
  warningAmber:         '--gs-warning-amber',
  warningAmberSubtle:   '--gs-warning-amber-subtle',
  focusRing:            '--gs-focus-ring',
} as const satisfies Record<string, `--gs-${string}`>
