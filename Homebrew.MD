# HomeBrew - Development Journal

## Current Framework

- **Framework**: Next.js 15
- **Key Features**: Server Components, improved data fetching, and enhanced performance optimizations.

## Architecture Evolution

### Feature-First Architecture Implementation (2024)

Restructured the application to follow Feature-First Architecture:

**Previous Structure**:

- Flat component hierarchy
- Mixed concerns between features
- Unclear boundaries between features

**Current Structure**:

- Features organized in dedicated directories
- Clear separation of concerns
- Self-contained feature modules
- Proper use of Next.js 15 layouts
- Optimized server/client component split

### Component Organization

- Features live in `/dashboard/features/`
- Each feature has its own:
  - `page.tsx` (Server Component)
  - Feature-specific components
  - Supabase data fetching
  - Consistent styling patterns

### Authentication Integration

- Moved auth components into app directory
- Integrated with Supabase auth
- User-specific data fetching per feature
- Proper session management

### Performance Optimizations

- Server-first approach
- Partial rendering through layouts
- Optimized data fetching
- Reduced client-side JavaScript

## Design System

### Color Palette

- Primary: `#8B4513` (Coffee Brown)
- Secondary: `#A0522D` (Saddle Brown)
- Background: `#FDF6EC` (Cream)
- Accents: Various opacity levels of primary colors.

### Animation Philosophy

- Subtle background animations with slow pulse effects.
- Smooth card transitions with spring physics.
- Staggered loading for better visual hierarchy.
- Interactive elements with micro-animations.
- Performance-optimized animation timings.

### UI Components

1. **Feature Cards**

   - Glass-morphism effect.
   - Hover states with gradient overlays.
   - Interactive icons and buttons.
   - Responsive grid layout.

2. **Navigation**
   - Clean, minimal header.
   - Animated status indicators.
   - User menu integration.
   - Spinning coffee cup logo.

## Performance Considerations

- Server-side data fetching for faster initial loads.
- Optimized animation performance.
- Lazy-loaded components where appropriate.
- Proper TypeScript implementation for better maintainability.
- Reduced client-side JavaScript footprint.

## Authentication Strategy

- Implementing email-password authentication using NextAuth.js.
- Simplified session management and user authentication flow.
- Future considerations for OAuth and passwordless logins.

## Future Considerations

- Dark mode implementation.
- Enhanced user preferences system.
- More interactive features.
- Performance monitoring.
- Accessibility improvements.

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase
- **Icons**: Lucide Icons

This document will be updated as the application evolves with new features, design changes, and architectural improvements.
