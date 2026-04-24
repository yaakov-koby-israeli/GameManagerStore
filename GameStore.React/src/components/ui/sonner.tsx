import { Toaster as SonnerToaster } from 'sonner'

// Neon glow shadow values sourced from our design tokens:
//   success → --gs-success-green  #4ade80  rgb(74 222 128)
//   error   → --gs-danger-red     #f87171  rgb(248 113 113)
const GLOW_SUCCESS = '0 0 0 1px rgba(74,222,128,0.35), 0 0 20px rgba(74,222,128,0.18)'
const GLOW_ERROR   = '0 0 0 1px rgba(248,113,113,0.35), 0 0 20px rgba(248,113,113,0.18)'

export function Toaster(props: React.ComponentProps<typeof SonnerToaster>) {
  return (
    <SonnerToaster
      theme="dark"
      position="top-center"
      gap={8}
      toastOptions={{
        classNames: {
          // Base card — dark surface, subtle border, foreground text.
          // The `!` prefix forces !important so Sonner's own dark-theme
          // inline styles don't win the cascade.
          toast: [
            '!bg-[var(--gs-surface)]',
            '!border !border-[var(--gs-border)]',
            '!text-[var(--gs-text-primary)]',
            '!rounded-lg !shadow-lg',
            '!font-sans',
          ].join(' '),
          title:       '!text-sm !font-medium !text-[var(--gs-text-primary)]',
          description: '!text-xs !text-[var(--gs-text-secondary)]',

          // Type-specific glow — a 1px neon ring + a soft spread shadow.
          // Applied in addition to the base `toast` classes above.
          success: `![box-shadow:${GLOW_SUCCESS}] !border-[rgba(74,222,128,0.35)]`,
          error:   `![box-shadow:${GLOW_ERROR}]   !border-[rgba(248,113,113,0.35)]`,

          // Action / cancel buttons
          actionButton: '!bg-[var(--gs-accent-purple)] !text-white !rounded-md',
          cancelButton: '!bg-[var(--gs-surface-subtle)] !text-[var(--gs-text-secondary)] !rounded-md',

          // Close ×
          closeButton: [
            '!bg-[var(--gs-surface-subtle)]',
            '!border !border-[var(--gs-border)]',
            '!text-[var(--gs-text-muted)]',
          ].join(' '),
        },
      }}
      {...props}
    />
  )
}
