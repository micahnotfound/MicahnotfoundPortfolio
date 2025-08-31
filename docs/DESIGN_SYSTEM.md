# 🎨 Design System - Micah Milner Portfolio

## 📋 **Overview**
This document outlines the design system for Micah Milner's portfolio website, including typography, spacing, colors, and component patterns.

---

## 🎯 **Typography**

### **Font Stack**
- **Headings**: Playfair Display (serif)
- **Body Text**: Epilogue (sans-serif)
- **UI Elements**: Epilogue (sans-serif)
- **Small Text**: Inter (sans-serif)

### **Font Classes**
```css
.font-heading    /* Playfair Display for titles */
.font-body       /* Epilogue for body text */
.font-ui         /* Epilogue for UI elements */
.font-sans       /* Inter for small text */
```

### **Type Scale**
- **H1**: 5xl-7xl (desktop), 4xl-6xl (mobile)
- **H2**: 3xl-4xl
- **H3**: 2xl-3xl
- **Body**: base-lg
- **Small**: sm-xs

---

## 🎨 **Color Palette**

### **Primary Colors**
- **Black**: `#0A0A0A`
- **White**: `#F6F6F6`
- **Gray Light**: `#F3F4F6`
- **Gray Medium**: `#9CA3AF`
- **Gray Dark**: `#374151`

### **Accent Colors**
- **Blue**: `#3B82F6` (links, buttons)
- **Blue Dark**: `#2563EB` (hover states)

### **Semantic Colors**
- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Error**: `#EF4444`

---

## 📏 **Spacing System**

### **Base Unit**: 4px
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

### **Layout Spacing**
- **Section Padding**: 64px (desktop), 32px (mobile)
- **Component Gap**: 24px (desktop), 16px (mobile)
- **Text Spacing**: 16px (paragraphs), 8px (lines)

---

## 🔲 **Borders & Shadows**

### **Border Styles**
- **Thin**: 1px solid
- **Medium**: 2px solid
- **Thick**: 4px solid (header separator, project buttons)

### **Border Radius**
- **Small**: 4px
- **Medium**: 8px
- **Large**: 12px
- **Full**: 9999px (buttons)

### **Shadows**
- **Subtle**: `0 1px 3px rgba(0,0,0,0.1)`
- **Medium**: `0 4px 6px rgba(0,0,0,0.1)`
- **Strong**: `0 10px 15px rgba(0,0,0,0.1)`

---

## 🧩 **Component Patterns**

### **Header Design**
```
[Logo (icon+text)] | [4px Black Border] | [about] | [MICAH MILNER]
```

**Specifications:**
- Logo: Combined icon + text on left
- Separator: 4px thick black border
- About text: After separator
- Logotype: "MICAH MILNER" on far right
- Mobile: Similar layout, responsive

### **Project Cards**
```
Desktop Layout:
[Date]
[Thumbnail]
[Thick Square Border Button - Project Name]

Mobile Layout:
[Carousel with staggered button positioning]
- MoMA: button below
- BLACKLANDS: button above
- Signature Series: button below
- There Goes Nikki: button above
```

**Specifications:**
- **Date Format**: MM/YY (e.g., 2/21, 7/25)
- **Thumbnail**: Full-width image
- **Button**: Thick square border with project name
- **Mobile**: Carousel with alternating button positions

### **Footer Design**
```
Desktop:
[Thick Contact Button] [Instagram] [Email]

Mobile:
[Thick Contact Button]
[Instagram Handle]
[Email Address]
```

**Specifications:**
- **Contact Button**: Thick black border
- **Email**: micah@art404.com
- **Instagram**: @micahnotfound
- **Mobile**: Stacked vertically

---

## 📱 **Responsive Breakpoints**

### **Mobile First Approach**
- **xs**: 0px - 640px
- **sm**: 640px - 768px
- **md**: 768px - 1024px
- **lg**: 1024px - 1280px
- **xl**: 1280px+

### **Layout Changes**
- **Desktop**: Column layout for projects
- **Mobile**: Carousel layout for projects
- **Header**: Maintains structure across breakpoints
- **Footer**: Horizontal (desktop) → Vertical (mobile)

---

## 🎨 **Project Dates**

### **Updated Project Timeline**
- **MoMA Exhibition**: 2/21
- **BlackLands**: 7/25
- **eSignature Series**: 12/23
- **There Goes Nikki**: 7/25

---

## 🔧 **Interactive States**

### **Button States**
- **Default**: Solid background, white text
- **Hover**: Darker background
- **Focus**: Ring outline
- **Active**: Pressed state

### **Link States**
- **Default**: Blue color
- **Hover**: Darker blue
- **Focus**: Ring outline
- **Visited**: Same as default

### **Card States**
- **Default**: Subtle shadow
- **Hover**: Stronger shadow
- **Focus**: Ring outline

---

## ♿ **Accessibility**

### **Color Contrast**
- **Text on Background**: 4.5:1 minimum
- **Large Text**: 3:1 minimum
- **UI Elements**: 3:1 minimum

### **Focus Indicators**
- **Visible Focus**: Blue ring (2px)
- **Focus Offset**: 2px from element
- **High Contrast**: Always visible

### **Reduced Motion**
- **Animations**: Respect `prefers-reduced-motion`
- **Transitions**: Disabled for motion-sensitive users
- **Static Fallbacks**: Provided for all animations

---

## 📊 **Table-Friendly Design**

### **High Contrast Mode**
- **Borders**: Always visible
- **Text**: High contrast
- **Backgrounds**: Solid colors
- **Images**: Alt text required

### **Print-Friendly**
- **Colors**: High contrast
- **Layout**: Single column
- **Images**: Optimized for print
- **Links**: Full URLs visible

---

## 🎯 **Design Tokens**

### **CSS Variables**
```css
:root {
  --color-black: #0A0A0A;
  --color-white: #F6F6F6;
  --color-blue: #3B82F6;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --border-thick: 4px;
  --border-medium: 2px;
  --border-thin: 1px;
}
```

### **Tailwind Classes**
```css
.font-heading    /* Playfair Display */
.font-body       /* Epilogue */
.font-ui         /* Epilogue */
.border-thick    /* 4px border */
.border-medium   /* 2px border */
.border-thin     /* 1px border */
```

---

## 📝 **Implementation Notes**

### **Logo Assets**
- **Combined Logo**: Use for header (icon + text)
- **Icon Only**: Use for favicon
- **Text Only**: Use for print materials

### **Image Specifications**
- **Thumbnails**: 16:9 aspect ratio
- **Hero Images**: 21:9 aspect ratio
- **Profile Images**: 1:1 aspect ratio
- **Format**: WebP with JPEG fallback

### **Performance Considerations**
- **Lazy Loading**: All images below fold
- **Responsive Images**: Multiple sizes
- **Optimization**: Cloudinary transforms
- **Caching**: Proper cache headers

---

## 🔄 **Maintenance Guidelines**

### **Adding New Projects**
1. Update `content/projects.json`
2. Add images to Cloudinary
3. Update project dates
4. Test responsive behavior

### **Updating Design**
1. Modify design tokens
2. Update component patterns
3. Test across breakpoints
4. Verify accessibility

### **Typography Changes**
1. Update font imports
2. Modify font classes
3. Test readability
4. Check performance impact

---

This design system ensures consistency, accessibility, and maintainability across the entire portfolio website.
