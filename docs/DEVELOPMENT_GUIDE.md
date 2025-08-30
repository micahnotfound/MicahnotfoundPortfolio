# 🚀 Development Guide & Quick Reference

This guide provides quick reference information and development patterns for the portfolio project.

## 📋 Quick Reference

### Project Structure
```
/app/(site)/          # Pages (Home, Work, About)
/components/shared/    # Reusable components
/components/composition/ # Complex components
/hooks/               # Custom React hooks
/lib/                 # Utilities and helpers
/types/               # TypeScript definitions
/config/              # Site configuration
/content/             # JSON content files
```

### Key Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
```

### Environment Variables
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## 🎯 Development Etiquette

### For LLMs (AI Assistants)

1. **Always check dependencies** before starting a ticket
2. **Update ticket status** when beginning work
3. **Follow TypeScript types** exactly as defined
4. **Test acceptance criteria** before marking complete
5. **Document any deviations** from specifications
6. **Use consistent patterns** from existing code
7. **Respect accessibility requirements** in all implementations

### For Human Developers

1. **Follow the ticket system** in `/docs/PROJECT_MANAGEMENT.md`
2. **Update progress** regularly
3. **Test thoroughly** before marking tickets complete
4. **Document any issues** or blockers
5. **Review acceptance criteria** carefully
6. **Maintain code quality** and consistency

---

## 🔧 Common Patterns

### Component Structure
```typescript
import { type ComponentProps } from 'react'
import { cn } from '@/lib/utils'

interface ComponentNameProps extends ComponentProps<'div'> {
  // Component-specific props
}

export function ComponentName({ className, ...props }: ComponentNameProps) {
  return (
    <div className={cn('base-styles', className)} {...props}>
      {/* Component content */}
    </div>
  )
}
```

### Hook Pattern
```typescript
import { useState, useEffect, useCallback } from 'react'

export function useCustomHook(options: HookOptions) {
  const [state, setState] = useState(initialState)
  
  const handler = useCallback(() => {
    // Hook logic
  }, [dependencies])
  
  useEffect(() => {
    // Side effects
    return () => {
      // Cleanup
    }
  }, [dependencies])
  
  return { state, handler }
}
```

### Cloudinary URL Building
```typescript
import { imageUrl, videoUrl, buildSrcSet } from '@/lib/cloudinary'

// Basic image
const url = imageUrl('projects/blacklands/cover', 'f_auto,q_auto,w_600')

// Video with poster
const videoUrl = videoUrl('projects/blacklands/hero', 'f_auto,q_auto,w_1400')
const posterUrl = imageUrl('projects/blacklands/hero_poster', 'f_auto,q_auto,w_1400')

// Responsive srcset
const { src, srcSet, sizes } = buildSrcSet(
  'projects/blacklands/cover',
  [600, 900, 1400, 2000],
  'f_auto,q_auto'
)
```

### Media Component Usage
```typescript
import { Media } from '@/components/shared/Media'
import type { MediaItem } from '@/types/content'

const mediaItem: MediaItem = {
  kind: 'image',
  publicId: 'projects/blacklands/cover',
  alt: 'Blacklands cover image',
  transforms: {
    thumb: 'f_auto,q_auto,w_600,h_800,c_fill,g_auto',
    full: 'f_auto,q_auto,w_1600'
  }
}

<Media item={mediaItem} className="w-full h-auto" />
```

---

## 🎨 Styling Patterns

### Tailwind Classes (if using Tailwind)
```typescript
// Typography
'text-xs'    // 12px
'text-sm'    // 14px
'text-base'  // 16px
'text-lg'    // 20px
'text-xl'    // 28px
'text-2xl'   // 40px

// Spacing
'p-1'        // 4px
'p-2'        // 8px
'p-3'        // 12px
'p-4'        // 16px
'p-6'        // 24px
'p-8'        // 32px

// Colors
'bg-black'   // #0A0A0A
'text-white' // #F6F6F6

// Radius
'rounded-xl' // 12px (cards)
'rounded-2xl' // 20px (rail knob)

// Shadows
'shadow-lg hover:shadow-xl' // 0 8px 24px rgba(0,0,0,.15)
```

### CSS Variables (if using CSS Modules)
```css
:root {
  /* Typography */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 20px;
  --font-size-xl: 28px;
  --font-size-2xl: 40px;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  
  /* Colors */
  --color-black: #0A0A0A;
  --color-white: #F6F6F6;
  
  /* Radius */
  --radius-card: 12px;
  --radius-rail: 20px;
  
  /* Shadows */
  --shadow-hover: 0 8px 24px rgba(0,0,0,.15);
}
```

---

## ♿ Accessibility Patterns

### Keyboard Navigation
```typescript
// Handle keyboard events
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      onPrevious()
      break
    case 'ArrowRight':
      event.preventDefault()
      onNext()
      break
    case 'Enter':
      event.preventDefault()
      onSelect()
      break
  }
}
```

### Focus Management
```typescript
// Focus trap for modals/lightboxes
useEffect(() => {
  const focusableElements = containerRef.current?.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  if (focusableElements?.length) {
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
    
    firstElement.focus()
  }
}, [])
```

### Reduced Motion Support
```typescript
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

function Component() {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  if (prefersReducedMotion) {
    return <StaticVersion />
  }
  
  return <AnimatedVersion />
}
```

---

## 🚀 Performance Patterns

### Lazy Loading
```typescript
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function Parent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### Image Optimization
```typescript
// Use next/image for local images
import Image from 'next/image'

<Image
  src="/local-image.jpg"
  alt="Description"
  width={600}
  height={400}
  priority={isAboveFold}
  loading={isAboveFold ? 'eager' : 'lazy'}
/>

// Use Media component for Cloudinary images
<Media 
  item={mediaItem} 
  priority={isAboveFold}
  loading={isAboveFold ? 'eager' : 'lazy'}
/>
```

### Throttling/Debouncing
```typescript
import { rafThrottle, rafDebounce } from '@/lib/motion'

// Throttle scroll events
const throttledScrollHandler = rafThrottle((event) => {
  // Handle scroll
})

// Debounce search input
const debouncedSearch = rafDebounce((query) => {
  // Perform search
}, 300)
```

---

## 🧪 Testing Patterns

### Component Testing
```typescript
// Test component rendering
import { render, screen } from '@testing-library/react'
import { ComponentName } from './ComponentName'

test('renders correctly', () => {
  render(<ComponentName />)
  expect(screen.getByRole('button')).toBeInTheDocument()
})

// Test user interactions
import userEvent from '@testing-library/user-event'

test('handles click', async () => {
  const user = userEvent.setup()
  const handleClick = jest.fn()
  
  render(<ComponentName onClick={handleClick} />)
  await user.click(screen.getByRole('button'))
  
  expect(handleClick).toHaveBeenCalled()
})
```

### Hook Testing
```typescript
import { renderHook, act } from '@testing-library/react'
import { useCustomHook } from './useCustomHook'

test('hook works correctly', () => {
  const { result } = renderHook(() => useCustomHook({}))
  
  act(() => {
    result.current.handler()
  })
  
  expect(result.current.state).toBe(expectedValue)
})
```

---

## 🔍 Debugging Patterns

### Console Logging
```typescript
// Development-only logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}

// Error boundaries
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught:', error, errorInfo)
  }
}
```

### Performance Monitoring
```typescript
// Measure component render time
useEffect(() => {
  const start = performance.now()
  
  return () => {
    const end = performance.now()
    console.log(`Component rendered in ${end - start}ms`)
  }
}, [])
```

---

## 📝 Code Quality

### ESLint Rules
```json
{
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react-hooks/exhaustive-deps": "error",
    "prefer-const": "error"
  }
}
```

### TypeScript Strict Mode
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

## 🚨 Common Issues & Solutions

### Issue: Scroll mapping not working
**Solution**: Check that `useHorizontalScrollMapping` is only applied on desktop and container has `overflow-x: scroll`

### Issue: Videos not autoplaying
**Solution**: Ensure videos have `muted`, `playsInline`, and `loop` attributes

### Issue: Rail out of sync
**Solution**: Verify `getScrollProgress()` calculation and resize event handling

### Issue: Performance issues
**Solution**: Use `rafThrottle` for scroll events and lazy load off-screen media

### Issue: TypeScript errors
**Solution**: Check that all props match defined types and no `any` types are used

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

This guide should be updated as the project evolves and new patterns emerge.
