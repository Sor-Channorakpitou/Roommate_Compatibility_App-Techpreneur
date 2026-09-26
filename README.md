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

## Supabase

This branch uses Supabase Auth for registration/sign-in and stores completed
compatibility tests in Postgres. It also includes a listings schema and seed data
derived from `src/features/find-roommates/data/roommates-data.ts`.

1. Create a Supabase project, then copy `.env.example` to `.env.local`.
2. In **Project Settings → API**, set `VITE_SUPABASE_URL` and the browser-safe
   `VITE_SUPABASE_PUBLISHABLE_KEY`. Never expose a `service_role` or secret key in Vite.
3. Run `supabase db push` (or paste the migration into the SQL Editor), then run
   `supabase db reset` locally or execute `supabase/seed.sql`.
4. In **Authentication → URL Configuration**, add `http://localhost:5173` as a redirect URL.

Until environment values are configured, the app deliberately does not fall back
to localStorage authentication.

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
[Figma file](https://www.figma.com/design/IyU8yu2NyM0eT0By4cfZAE/Untitled?node-id=5-2) (frame `Homepage`),
with source hex values kept in comments beside their `oklch()` equivalents.

Fonts: Gabarito (`font-heading`) and Inter (`font-sans`), self-hosted via Fontsource.

Gabarito ships **no italic face**, so emphasis in headings uses weight and colour
(`font-semibold text-primary`) rather than `italic` — a faux-oblique Gabarito looks
broken. Swapping typefaces means editing the two `@import` lines and the two
`--font-*` tokens in `src/index.css`; no component references a font by name.

### Light-only interface

The UI is always light and deliberately ignores the OS colour scheme. Three things
enforce that, and all three matter:

1. There is a single `:root` token set and no `.dark` block.
2. `@custom-variant dark (&:is(.dark *))` rebinds `dark:` away from the browser's
   `prefers-color-scheme` default onto a `.dark` class nothing ever adds — without
   it, the `dark:` utilities still shipped inside the shadcn registry components
   would fire on a dark-mode machine.
3. `color-scheme: light` (plus the matching `<meta>` in `index.html`) keeps native
   UI — form controls, scrollbars — light too.

To reintroduce dark mode later: restore a `.dark` token block, drop the `color-scheme`
declaration and the meta tag, and add something that toggles the `.dark` class on
`<html>`.

## Adding components

```bash
npx shadcn@latest add dialog
```

Registry components land in `src/components/ui`. `button.tsx` has been extended with
the design's `pill*` sizes and `brand` / `brand-outline` / `on-brand` variants —
re-check those additions after any `--overwrite` regeneration.
