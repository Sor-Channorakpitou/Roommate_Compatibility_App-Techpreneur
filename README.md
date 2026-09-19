# RoomieMatch

Roommate compatibility matching for university students in Phnom Penh.
React + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui (Base UI `base-nova` style).

## Scripts

```bash
npm run dev        # Vite dev server
npm run build      # tsc -b && vite build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run format     # prettier (incl. Tailwind class sorting)
```

## Folder structure

```
src/
├── assets/images/        Committed binary assets (brand mark, photography)
├── components/
│   ├── ui/               shadcn registry components — regenerate, don't rewrite
│   ├── common/           Cross-feature primitives (Eyebrow, SectionIntro, ButtonLink)
│   └── layout/           App shell (Container, Brand, SiteHeader, SiteFooter)
├── config/
│   └── site.ts           Site-level content: name, nav, footer links
├── features/
│   └── landing/
│       ├── components/   Section components, one file per page section
│       ├── data/         Typed page content, kept out of the markup
│       ├── landing-page.tsx
│       └── index.ts      Public surface of the feature
├── lib/utils.ts          `cn` re-export
├── App.tsx               Shell: skip link + header + main + footer
├── index.css             Design tokens, fonts, Tailwind theme
└── main.tsx
```

**Conventions**

- Features own their sections and content; anything reused across features graduates
  to `components/common` or `config/`.
- Content lives in `data/` and `config/` as typed constants, so section components
  stay presentational.
- Import through the `@/` alias, never relative parent paths.

## Design tokens

The palette, typography, and elevation scale in `src/index.css` are ported from the
[Figma file](https://www.figma.com/design/IyU8yu2NyM0eT0By4cfZAE/Untitled?node-id=1-2),
with source hex values kept in comments beside their `oklch()` equivalents.

Two groups of tokens:

- **Theme-aware** (`--background`, `--primary`, `--surface`, `--peach`, `--sage`, …)
  invert between light and dark.
- **Brand constants** (`--brand`, `--brand-surface*`) stay the same in both themes,
  because the CTA banner is always the deep terracotta slab from the design.

Fonts: Newsreader (`font-heading`) and Plus Jakarta Sans (`font-sans`), self-hosted
via Fontsource.

Dark mode is handled by `ThemeProvider`; press <kbd>d</kbd> to toggle.

## Adding components

```bash
npx shadcn@latest add dialog
```

Registry components land in `src/components/ui`. `button.tsx` has been extended with
the design's `pill*` sizes and `brand` / `brand-outline` / `on-brand` variants —
re-check those additions after any `--overwrite` regeneration.
