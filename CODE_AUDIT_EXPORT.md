# Portfolio Website Code Audit Export

**Date:** 2025-11-08
**Git Commit:** 10a5788
**Purpose:** Code audit and review
**Tech Stack:** Next.js 14.0.4, TypeScript, Tailwind CSS

---

## Project Overview

Interactive portfolio website featuring:
- Horizontal scrolling carousel with progressive card falloff
- Three-state system (home/card/textbox hover)
- Staggered text fade-in animations (1s title, 1.5s description)
- Responsive design with breakpoints at 500px, 1000px, 1300px
- Circle clip-path image reveals from mouse entry point
- Morphing SVG logo (3 states)

---

## Key Questions for Audit

### Performance
1. Are 4 timeout refs per card (textFadeTimeoutRef, descriptionFadeTimeoutRef) causing memory issues?
2. Should window resize listener be throttled/debounced?
3. Is `passive: false` on wheel events impacting scroll performance?
4. ResizeObserver depends on `[project.title]` - should it be `[]`?

### Architecture
1. Is mixing global `hoverArea` context + local `isTextboxHovered` state the right pattern?
2. Should fade-in logic be extracted to custom hook?
3. Are magic numbers (42px, 550px, 1300px) OK or should they be constants?
4. Can ProjectCard be split into smaller components?

### Code Quality
1. Progressive falloff has 9 conditional branches - too complex?
2. Textbox padding calculation inline - extract to function?
3. Are staggered delays (50ms, 200ms) necessary or arbitrary?
4. Is flex-grow 2.0 actually achieving ~550px target width?

### Accessibility
1. Do animations respect `prefers-reduced-motion`?
2. Is text readable at 42px textbox height?
3. Keyboard navigation for horizontal carousel?
4. Screen reader support for hover states?

---

## Core Logic Breakdown

### Three-State System
```
HOME STATE (hoverArea = null)
  - Logo: tall (state 1)
  - Buttons: visible
  - Cards: all equal, photos 97% height

CARD STATE (hoverArea = 'card')
  - Logo: short (state 3)
  - Buttons: hidden
  - Active card: flex-grow 2.0 (~550px)
  - Textbox: 42px height, width expands
  - Photos: 98.5% height

TEXTBOX STATE (hoverArea = 'textbox')
  - Logo: short (state 3)
  - Buttons: hidden
  - Textbox: grows to 340px height
  - Description: fades in over 1.5s
  - Photos: 85% height
```

### Animation Timeline
```
User hovers card (t=0ms)
  → Textbox expands horizontally (0px → buttonWidth)

t=50ms
  → showText = true
  → Title starts fading in (1000ms transition)

User hovers textbox (t=variable)
  → Textbox grows vertically (42px → 340px)

t=textbox_hover + 200ms
  → showDescription = true
  → Description starts fading in (1500ms transition)
```

### Progressive Falloff Algorithm
```typescript
Active card: 2.0
Distance 1: 0.9 (45% reduction)
Distance 2: 0.7 (22% reduction)
Distance 3: 0.5 (29% reduction)
Distance 4: 0.35 (30% reduction)
Distance 5: 0.2 (43% reduction)
Distance 6+: 0.12 (40% reduction)

Mobile (<500px):
Distance 1: 0.25
Distance 2: 0.15
Distance 3+: 0.08
```

### Responsive Breakpoints
```
< 500px:
  - Aggressive card shrinking
  - Active card flex-grow stays 2.0

< 1300px:
  - Regular bezel: 39px 0 0 39px
  - Fixed bevel radius in padding calc

≥ 1300px:
  - Half-circle bezel: height/2 radius
  - Dynamic bevel based on textbox height
```

---

## Potential Issues

**State Complexity:**
- Global: `hoverArea` (context)
- Per Card Local: `isTextboxHovered`, `showText`, `showDescription`, `windowWidth`, `buttonWidth`
- 6 refs per card: `cardRef`, `buttonTextRef`, `lastMousePosRef`, `velocityRef`, `textFadeTimeoutRef`, `descriptionFadeTimeoutRef`

**Hard-Coded Values:**
- Textbox height: 42px (comment says "1.5x About button ~28px" - fragile)
- Active card target: ~550px (achieved via flex-grow 2.0 - not guaranteed)
- Bevel breakpoint: 1300px (why this number?)
- Fade delays: 50ms, 200ms (why these values?)

**Cleanup Concerns:**
- 4 setTimeout calls per card hover
- ResizeObserver per card
- Window resize listener (not throttled)
- Wheel event listeners with `passive: false`

---

## Code Snippets

### Textbox Height Logic
```typescript
const getTextboxHeight = () => {
  if (isTextboxHovered) {
    return '340px' // Textbox hovered: tall
  } else {
    return '42px' // Card hovered: 1.5x About button
  }
}
```

### Responsive Bevel
```typescript
const bevelRadius = windowWidth < 1300 ? 39 : height / 2
const leftPadding = `${bevelRadius + 24}px`
const rightPadding = '32px'

borderRadius: someoneIsHovered && isHovered
  ? (windowWidth < 1300
      ? '39px 0 0 39px'
      : `${parseInt(getTextboxHeight()) / 2}px 0 0 ${parseInt(getTextboxHeight()) / 2}px`)
  : '27px'
```

### Fade-In Pattern
```typescript
// useEffect triggers on card hover
useEffect(() => {
  if (someoneIsHovered && isHovered) {
    setShowText(false)
    textFadeTimeoutRef.current = setTimeout(() => {
      setShowText(true) // Triggers 1s opacity transition
    }, 50)
  }
}, [someoneIsHovered, isHovered])

// Render
<div style={{
  opacity: showText ? 1 : 0,
  transition: 'opacity 1000ms ease-out'
}}>
```

---

## Files Included

1. **ProjectCard.tsx** (430 lines) - Main carousel card component
2. **page.tsx** (157 lines) - Homepage with carousel layout
3. **Header.tsx** (122 lines) - Morphing header component
4. **HoverContext.tsx** (36 lines) - Global hover state management

---

## Request

Please review for:
1. Performance bottlenecks
2. State management anti-patterns
3. Accessibility concerns
4. Browser compatibility issues
5. Code maintainability
6. Potential memory leaks

Suggest improvements for:
- Simplifying state management
- Extracting reusable logic
- Optimizing animations
- Better responsive patterns

---

**Export Complete**
Ready to send to ChatGPT for audit.
