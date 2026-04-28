// Design tokens — single source of truth for the GameStore admin UI aesthetic.
// Values here are mirrored as --gs-* CSS custom properties in index.css.

// ─── Primitive palette ────────────────────────────────────────────────────────

export const palette = {
  white: '#ffffff',

  // Dark surfaces (deep blue-black with a subtle purple cast)
  dark950: '#0c0c14',   // near-black — page background
  dark900: '#12121e',   // card surface
  dark800: '#1c1c2e',   // surfaceSubtle — table headers, muted sections
  dark700: '#22223a',   // border
  dark600: '#2e2e4e',   // borderStrong

  // Slate (text scale — light values for dark-bg readability)
  slate50:  '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',

  // Neon Purple (primary accent — CTAs, focus rings, active states)
  neonPurple300: '#d8b4fe',   // light — text on subtle bg
  neonPurple400: '#c084fc',   // hover
  neonPurple500: '#a855f7',   // primary
  neonPurple600: '#9333ea',   // pressed / active

  // Neon Blue / Cyan (secondary accent — info, data, secondary actions)
  neonBlue300: '#67e8f9',   // light
  neonBlue400: '#22d3ee',   // hover
  neonBlue500: '#06b6d4',   // primary
  neonBlue600: '#0891b2',   // pressed

  // Red
  red400: '#f87171',   // brighter — dark bg
  red500: '#ef4444',
  red600: '#dc2626',   // darker  — light bg

  // Green
  green400: '#4ade80',  // brighter — dark bg
  green600: '#16a34a',  // darker  — light bg

  // Amber
  amber400: '#fbbf24',  // brighter — dark bg
  amber600: '#d97706',  // darker  — light bg

  // Extra purple/cyan shades for light-mode contrast
  neonPurple700: '#7e22ce',  // hover on light bg
  neonBlue700:   '#0e7490',  // hover on light bg
} as const

export type PaletteKey = keyof typeof palette

// ─── Semantic color tokens ────────────────────────────────────────────────────
// Maps conceptual roles to palette values. Use CSS vars (see `cssVars`) in components.

export const colors = {
  // Surfaces
  background:    palette.dark950,    // near-black page background
  surface:       palette.dark900,    // card / panel background
  surfaceSubtle: palette.dark800,    // table headers, inner muted sections

  // Borders
  border:        palette.dark700,
  borderStrong:  palette.dark600,

  // Text (light on dark for readability)
  textPrimary:   palette.slate50,    // near-white — headings, body
  textSecondary: palette.slate300,   // secondary labels
  textMuted:     palette.slate500,   // placeholders, hints, disabled
  textOnAccent:  palette.white,

  // Neon Purple — primary accent (CTA buttons, links, focus, row hover)
  accentPurple:           palette.neonPurple500,
  accentPurpleHover:      palette.neonPurple400,
  accentPurpleForeground: palette.white,
  accentPurpleSubtle:     'rgb(168 85 247 / 0.12)',   // translucent tint for hover / chip bg
  accentPurpleBorder:     'rgb(168 85 247 / 0.30)',
  accentPurpleMutedFg:    palette.neonPurple300,      // text sitting on accentPurpleSubtle

  // Neon Blue / Cyan — secondary accent (info, data, secondary actions)
  accentBlue:           palette.neonBlue500,
  accentBlueHover:      palette.neonBlue400,
  accentBlueForeground: palette.white,
  accentBlueSubtle:     'rgb(6 182 212 / 0.12)',
  accentBlueBorder:     'rgb(6 182 212 / 0.30)',
  accentBlueMutedFg:    palette.neonBlue300,

  // Danger (brighter reds on dark bg)
  dangerRed:            palette.red400,
  dangerRedHover:       palette.red500,
  dangerRedForeground:  palette.white,
  dangerRedSubtle:      'rgb(248 113 113 / 0.12)',
  dangerRedBorder:      'rgb(248 113 113 / 0.25)',

  // Success
  successGreen:         palette.green400,
  successGreenSubtle:   'rgb(74 222 128 / 0.12)',

  // Warning
  warningAmber:         palette.amber400,
  warningAmberSubtle:   'rgb(251 191 36 / 0.12)',

  // Focus ring — neon purple glow
  focusRing: palette.neonPurple400,
} as const

// ─── Light theme semantic tokens ──────────────────────────────────────────────
// Mirrors `colors` structure but mapped to a white/light palette.
// Neon accents are shifted one stop darker for WCAG AA contrast on white bg.

export const lightColors = {
  // Surfaces
  background:    palette.white,        // pure white — user-specified
  surface:       palette.white,        // cards match bg; border provides separation
  surfaceSubtle: palette.slate50,      // #f8fafc — user-specified subtle grey

  // Borders
  border:        palette.slate200,     // #e2e8f0
  borderStrong:  palette.slate300,     // #cbd5e1

  // Text
  textPrimary:   '#0f172a',            // near-black — user-specified
  textSecondary: palette.slate500,     // #64748b
  textMuted:     palette.slate400,     // #94a3b8
  textOnAccent:  palette.white,

  // Neon Purple — one stop darker (600/700) for AA contrast on white
  accentPurple:           palette.neonPurple600,    // #9333ea  ~4.5:1 on white
  accentPurpleHover:      palette.neonPurple700,    // #7e22ce
  accentPurpleForeground: palette.white,
  accentPurpleSubtle:     'rgb(168 85 247 / 0.08)',
  accentPurpleBorder:     'rgb(168 85 247 / 0.20)',
  accentPurpleMutedFg:    palette.neonPurple700,    // text on subtle bg

  // Neon Blue / Cyan — one stop darker for AA contrast on white
  accentBlue:           palette.neonBlue600,        // #0891b2  ~4.6:1 on white
  accentBlueHover:      palette.neonBlue700,        // #0e7490
  accentBlueForeground: palette.white,
  accentBlueSubtle:     'rgb(6 182 212 / 0.08)',
  accentBlueBorder:     'rgb(6 182 212 / 0.20)',
  accentBlueMutedFg:    palette.neonBlue700,

  // Danger
  dangerRed:            palette.red600,             // #dc2626  ~5.9:1 on white
  dangerRedHover:       '#b91c1c',
  dangerRedForeground:  palette.white,
  dangerRedSubtle:      'rgb(220 38 38 / 0.08)',
  dangerRedBorder:      'rgb(220 38 38 / 0.20)',

  // Success
  successGreen:         palette.green600,           // #16a34a
  successGreenSubtle:   'rgb(22 163 74 / 0.08)',

  // Warning
  warningAmber:         palette.amber600,           // #d97706
  warningAmberSubtle:   'rgb(217 119 6 / 0.08)',

  // Focus ring
  focusRing:            palette.neonPurple500,      // #a855f7 — vivid ring on white
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
  background:             '--gs-background',
  surface:                '--gs-surface',
  surfaceSubtle:          '--gs-surface-subtle',
  border:                 '--gs-border',
  borderStrong:           '--gs-border-strong',
  textPrimary:            '--gs-text-primary',
  textSecondary:          '--gs-text-secondary',
  textMuted:              '--gs-text-muted',
  textOnAccent:           '--gs-text-on-accent',
  accentPurple:           '--gs-accent-purple',
  accentPurpleForeground: '--gs-accent-purple-fg',
  accentPurpleSubtle:     '--gs-accent-purple-subtle',
  accentPurpleBorder:     '--gs-accent-purple-border',
  accentPurpleMutedFg:    '--gs-accent-purple-muted-fg',
  accentBlue:             '--gs-accent-blue',
  accentBlueForeground:   '--gs-accent-blue-fg',
  accentBlueSubtle:       '--gs-accent-blue-subtle',
  accentBlueBorder:       '--gs-accent-blue-border',
  accentBlueMutedFg:      '--gs-accent-blue-muted-fg',
  dangerRed:              '--gs-danger-red',
  dangerRedForeground:    '--gs-danger-red-fg',
  dangerRedSubtle:        '--gs-danger-red-subtle',
  dangerRedBorder:        '--gs-danger-red-border',
  successGreen:           '--gs-success-green',
  successGreenSubtle:     '--gs-success-green-subtle',
  warningAmber:           '--gs-warning-amber',
  warningAmberSubtle:     '--gs-warning-amber-subtle',
  focusRing:              '--gs-focus-ring',
} as const satisfies Record<string, `--gs-${string}`>
