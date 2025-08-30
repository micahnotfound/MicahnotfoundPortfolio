# 🎛️ Portfolio (Next.js + Cloudinary) — README

Single-author portfolio with desktop-only kinetic carousels, a project index, and project detail pages.

**Desktop**: vertical wheel → horizontal movement; project detail uses a left "rail" slider that controls vertical scroll.  
**Mobile**: standard vertical pages (no custom scroll mapping).

## Table of Contents

- [Goals & Non-Goals](#goals--non-goals)
- [Architecture Overview](#architecture-overview)
- [Routes & Behaviors](#routes--behaviors)
- [Data Model](#data-model)
- [Cloudinary Conventions](#cloudinary-conventions)
- [Components](#components)
- [Hooks](#hooks)
- [Utilities](#utilities)
- [Styling Tokens](#styling-tokens)
- [Accessibility](#accessibility)
- [Performance Budget](#performance-budget)
- [Analytics Events](#analytics-events)
- [Project Structure](#project-structure)
- [Environment & Setup](#environment--setup)
- [Content: Seeding & Updating](#content-seeding--updating)
- [Acceptance Criteria](#acceptance-criteria)
- [QA Checklist](#qa-checklist)
- [Troubleshooting](#troubleshooting)
- [LLM Implementation Notes](#llm-implementation-notes)

## Goals & Non-Goals

### Goals
- 4 routes: `/`, `/work`, `/work/[slug]`, `/about`
- Desktop kinetic interactions (scroll↔carousel, wraparound; rail on detail)
- Mobile keeps to native, accessible patterns
- Content driven by Cloudinary public IDs + one JSON file

### Non-Goals
- No CMS admin UI (JSON is the source of truth)
- No SSR image optimization dependency beyond Cloudinary transforms
- No parallax or heavy WebGL

## Architecture Overview

- **Framework**: Next.js (App Router), React
- **Assets**: Cloudinary (public_ids + transforms)
- **State**: Local component state + URL for routing
- **Styling**: Tailwind or CSS Modules (either is fine; tokens listed below)
- **A11y & Motion**: Respect `prefers-reduced-motion`. Custom inputs are enhancements, never the only control

## Routes & Behaviors

### `/` — Home (desktop)
- A carousel window of hero media (image/video)
- Vertical wheel maps to horizontal movement of the carousel (no visible slider)
- Infinite wrap: reaching either end loops seamlessly
- `prefers-reduced-motion`: disable kinetic mapping; show the first frame/poster

### `/work` — Work index (desktop)
- Horizontal reel of 5 project cards
- Vertical wheel maps to horizontal movement; CSS scroll-snap or virtualized scrolling
- Keyboard: ←/→ moves one snap; Enter opens focused card

### `/work/[slug]` — Project detail (desktop)
- Long vertical page with hero media (optional video) + gallery
- Left rail: horizontal drag right = scroll down (drag left = up)
- Rail reflects scroll progress and stays in sync with native wheel scroll
- Rail auto-hides on mobile and when reduced motion is on

### `/about` — Info/contact
- Static content

### Mobile (all pages)
- No scroll mapping or rail; native vertical scroll
- Galleries become horizontal swipe with scroll-snap

## Data Model

### `/types/content.ts`

```typescript
export type SiteSettings = {
  siteTitle: string;
  email: string;
  cloudinary: { cloudName: string; baseImagePath?: string };
  nav: Array<{ label: string; href: string }>;
};

export type MediaKind = "image" | "video";
export type MediaItem = {
  kind: MediaKind;
  publicId: string;         // Cloudinary public_id (no extension)
  alt: string;
  width?: number;
  height?: number;
  posterId?: string;        // for video poster
  loop?: boolean;           // default true
  muted?: boolean;          // default true
  playsInline?: boolean;    // default true
  transforms?: {
    thumb?: string;         // e.g. "w_600,h_800,c_fill,q_auto,f_auto,g_auto"
    full?: string;          // e.g. "w_1600,q_auto,f_auto"
  };
};

export type Project = {
  slug: string;             // "blacklands"
  title: string;            // "BLACKLANDS"
  order: number;            // 1..N (index ordering)
  year?: number;
  client?: string;
  roleTags?: string[];
  summary?: string;
  cover: MediaItem;         // card cover
  hero?: MediaItem;         // optional hero (image or video)
  gallery: MediaItem[];     // detail shots
  palette?: { bg?: string; fg?: string };
  seo?: { title?: string; description?: string; ogImageId?: string };
};

export type HomeData = { hero: MediaItem; featured: MediaItem[] };
export type WorkData = { projects: Project[] };
export type ProjectData = { project: Project; next?: Project; prev?: Project };
```

## Cloudinary Conventions

### Foldering
```
projects/{slug}/cover              # image or video
projects/{slug}/hero               # optional video hero
projects/{slug}/hero_poster        # poster image for hero
projects/{slug}/detail/{01..NN}    # detailed shots
```

### Default transforms
- **Thumb (cards)**: `f_auto,q_auto,w_600,h_800,c_fill,g_auto`
- **Reel/Home**: `f_auto,q_auto,w_1400,c_fill,g_auto`
- **Detail full**: `f_auto,q_auto,w_1600` (also provide 2x srcset up to 2400)

### URL building
```javascript
// image
https://res.cloudinary.com/<cloud>/image/upload/{TRANSFORMS}/{PUBLIC_ID}
// video
https://res.cloudinary.com/<cloud>/video/upload/{TRANSFORMS}/{PUBLIC_ID}
```

## Components

**Location**: `/components`

### Shared
- **Header**: site nav from `SiteSettings.nav`
- **Footer**: contact strip (email)
- **Button**: base button/link
- **Media**: renders `MediaItem`. For video, set `muted loop playsInline` by default and apply `posterId` if present
- **VisuallyHidden**: a11y helper for labels

### Composition
- **CarouselWindow**
  - Props: `{ items: MediaItem[]; loop?: boolean; initialIndex?: number }`
  - Desktop → wheel→horizontal mapping + infinite wrap. Mobile → swipe with scroll-snap

- **HorizontalReel**
  - Props: `{ projects: Project[] }`
  - Renders `ProjectCard` items with snap; arrow buttons appear on hover; supports keyboard

- **ProjectCard**
  - Props: `{ project: Project }` → navigates to `/work/[slug]`

- **ProjectRail**
  - Props: `{ value: number; onChange: (v01:number)=>void }`
  - Left rail (desktop); value in [0..1] mirrors page scroll; dragging updates scroll

- **Gallery**
  - Props: `{ items: MediaItem[] }`
  - Grid/full-bleed sections; optional lightbox (if enabled later)

## Hooks

**Location**: `/hooks`

- **useHorizontalScrollMapping**`({ ref, factor = 1 })`
  - Convert `wheel.deltaY` to `ref.current.scrollLeft += delta * factor`
  - Handles normalization for different input devices

- **useInfiniteWrap**`({ containerRef, itemWidth, gap })`
  - Duplicates head/tail or uses modulo index to create seamless wrap

- **useRailScrollSync**`({ value, setValue })`
  - Two-way sync between document scroll progress and rail value

- **usePrefersReducedMotion**`()` → boolean
- **useMediaQuery**`(query: string)` → boolean
- **useKeyNav**`({ onPrev, onNext })` — Binds ←/→ and PgUp/PgDn

## Utilities

**Location**: `/lib`

### cloudinary.ts
- `imageUrl(publicId, transform?)`
- `videoUrl(publicId, transform?)`
- `buildSrcSet(publicId, widths:number[], baseTransform:string)`

### motion.ts
- `clamp(n,min,max)` `lerp(a,b,t)`
- `rafThrottle(fn)` `rafDebounce(fn)`

### scroll.ts
- `getScrollProgress()` → [0..1]
- `scrollSnapTo(container, index)`

### analytics.ts
- `track(eventName: string, payload?: Record<string, unknown>)`

## Styling Tokens

Define in Tailwind theme or CSS variables.

- **Font**: Inter (400/600/800)
- **Type scale**: 12, 14, 16, 20, 28, 40
- **Spacing**: 4, 8, 12, 16, 24, 32
- **Radius**: 12 (cards), 20 (rail knob)
- **Shadow**: `0 8px 24px rgba(0,0,0,.15)` on hover
- **Colors**: base `#0A0A0A` / `#F6F6F6`; per-project palette optional

## Accessibility

- Every `MediaItem` must include meaningful alt text (poster too)
- Focus states are visible; keyboard access for carousels (←/→)
- `prefers-reduced-motion`: disable kinetic mapping, disable looped animations, show posters for videos
- Rail is supplemental—page always scrolls naturally with the wheel/keys
- If a lightbox is added: trap focus; ESC closes; arrows navigate

## Performance Budget

- LCP ≤ 2.5s, CLS < 0.05, JS ≤ 150kb on initial route
- Lazy-load media off-screen; prefetch next/prev project JSON
- Use Cloudinary `q_auto,f_auto` + responsive srcset
- Virtualize long lists if needed (5 items doesn't require it)

## Analytics Events

- `carousel_impression` { route, count }
- `carousel_seek` { route, fromIndex, toIndex, input: "wheel"|"key" }
- `project_open` { slug }
- `rail_drag_start|end` { slug }
- `gallery_view` { slug, index }

## Project Structure

```
/app
  /(site)
    /page.tsx                 # Home
    /work/page.tsx            # Work index
    /work/[slug]/page.tsx     # Project detail
    /about/page.tsx
/components
  /shared
    Button.tsx
    Header.tsx
    Footer.tsx
    Media.tsx
    VisuallyHidden.tsx
  /composition
    CarouselWindow.tsx
    HorizontalReel.tsx
    ProjectCard.tsx
    ProjectRail.tsx
    Gallery.tsx
/hooks
  useHorizontalScrollMapping.ts
  useInfiniteWrap.ts
  useRailScrollSync.ts
  usePrefersReducedMotion.ts
  useMediaQuery.ts
  useKeyNav.ts
/lib
  cloudinary.ts
  motion.ts
  scroll.ts
  analytics.ts
/types
  content.ts
/config
  siteSettings.ts
/content
  projects.json               # 5 projects; see sample below
/styles
  globals.css                 # or tailwind.css
/public
  icons/  cursors/            # optional
```

## Environment & Setup

### Requirements
- Node 18+
- Next.js (App Router)
- Cloudinary account (cloud name)

### `.env`
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud
```

### Install & run
```bash
pnpm i   # or npm i / yarn
pnpm dev # http://localhost:3000
```

## Content: Seeding & Updating

### `/content/projects.json` (source of truth)

**Sample entry:**
```json
{
  "slug": "blacklands",
  "title": "BLACKLANDS",
  "order": 1,
  "year": 2024,
  "summary": "Poster and installation series.",
  "cover": { "kind": "image", "publicId": "projects/blacklands/cover", "alt": "Blacklands cover" },
  "hero":  { "kind": "video", "publicId": "projects/blacklands/hero", "posterId": "projects/blacklands/hero_poster", "alt": "Looping hero" },
  "gallery": [
    { "kind": "image", "publicId": "projects/blacklands/detail/01", "alt": "Detail 1" },
    { "kind": "image", "publicId": "projects/blacklands/detail/02", "alt": "Detail 2" }
  ],
  "palette": { "bg": "#0A0A0A", "fg": "#F6F6F6" }
}
```

### Add a new project
1. Upload assets to Cloudinary using the foldering pattern
2. Add a new JSON object to `projects.json`
3. Ensure `order` is unique (1..5)
4. Run and verify `/work` card appears and `/work/[slug]` renders

## Acceptance Criteria

- **Home**: vertical wheel moves carousel horizontally; wraps seamlessly; reduced-motion shows static poster
- **Work**: reel shows 5 cards; wheel and ←/→ move one snap; Enter opens focused card
- **Detail**: left rail synchronizes with page scroll within ±1%; dragging right scrolls down; rail hidden on mobile/reduced-motion
- **Mobile**: native vertical pages; galleries swipe horizontally; no rail or kinetic scroll mapping
- **Assets**: all images/videos load from Cloudinary with `q_auto,f_auto` and responsive srcset
- **A11y**: alt text present; focus visible; keyboard usable

## QA Checklist

- [ ] Broken Cloudinary IDs = 0 (404 check)
- [ ] All `MediaItem.alt` strings populated
- [ ] `prefers-reduced-motion` disables kinetic features & loops
- [ ] Keyboard navigation works on Home, Work, and Gallery
- [ ] LCP ≤ 2.5s on `/` and `/work` (throttle "Slow 4G" in DevTools)
- [ ] Rail behavior: drag start/end events fire; value persists through resize

## Troubleshooting

### Wheel doesn't move horizontally
→ Check `useHorizontalScrollMapping` is only bound on desktop breakpoints and that container has `overflow-x: scroll`

### Wrap jump visible
→ Validate `useInfiniteWrap` is cloning correct number of items and snap alignment matches item width/gap

### Rail out of sync
→ Ensure `getScrollProgress()` uses `scrollHeight - innerHeight` and updates on resize

### Videos not autoplaying
→ Must be `muted` and `playsInline`; provide `posterId` for first frame

## LLM Implementation Notes

⚠️ **Critical Implementation Guidelines**

1. **Do not change** the exported TypeScript types or prop names without updating this README and all usages

2. **Desktop vs Mobile**: All kinetic behaviors are desktop-only. Mobile must remain standard vertical UX

3. **Reduced Motion**: Wrap every kinetic feature in a `usePrefersReducedMotion()` check

4. **Cloudinary**: Always apply `q_auto,f_auto` and generate srcset for 600/900/1400/2000 widths

5. **Order of Work Cards**: Sort strictly by `Project.order` ascending

6. **Routing**: Work cards link to `/work/[slug]`; next/prev on project detail may use sorted list to compute neighbors

7. **Testing**: For scroll mapping, throttle updates with `rafThrottle`; don't use `setInterval`

8. **Error handling**: If a `publicId` is missing, render a placeholder with clear label in dev mode

### Implementation Order
1. **Foundation**: Next.js app, types, config
2. **Cloudinary**: URL builders, Media component
3. **Shared Components**: Header, Footer, Button, Media
4. **Composition Components**: CarouselWindow, HorizontalReel, ProjectCard, ProjectRail, Gallery
5. **Pages**: Home, Work, Project Detail, About
6. **Hooks & Utilities**: Scroll mapping, rail sync, motion helpers
7. **A11y & Performance**: Reduced motion, keyboard nav, lazy loading
8. **Analytics & Polish**: Event tracking, error handling, documentation

### Key Implementation Patterns

```typescript
// Desktop-only kinetic behavior
const isDesktop = useMediaQuery('(min-width: 768px)');
const prefersReducedMotion = usePrefersReducedMotion();

if (isDesktop && !prefersReducedMotion) {
  // Apply kinetic scroll mapping
}

// Cloudinary URL with transforms
const imageUrl = buildCloudinaryUrl(publicId, 'image', {
  transforms: 'f_auto,q_auto,w_1400,c_fill,g_auto'
});

// Responsive srcset
const { src, srcSet, sizes } = buildSrcSet(publicId, [600, 900, 1400, 2000], 'f_auto,q_auto');
```

This README serves as the complete specification for both human developers and LLM code generation. Follow the patterns and constraints exactly as specified.
