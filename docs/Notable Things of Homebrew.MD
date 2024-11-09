# HomeBrew - Development Journal

## Current Framework

- **Framework**: Next.js 15
- **Key Features**: Server Components, improved data fetching, and enhanced performance optimizations.

## Architecture Evolution

### Server vs Client Components Refactor (2024)

The dashboard underwent a significant architectural change from a single client-side component to a more optimized server-first approach:

**Previous Structure (Client-Side)**:

- Entire dashboard was client-side rendered.
- All data fetching happened on the client.
- Heavier JavaScript bundle size.

**Current Structure (Server-First)**:

- Main dashboard is a Server Component.
- Data fetching moved to server-side.
- Client components isolated to interactive features only.
- Reduced JavaScript bundle size.
- Better initial page load performance.

### Component Organization

- Features data separated into dedicated files.
- Proper TypeScript interfaces implemented.
- Clear separation between server and client logic.
- Follows Next.js 15 best practices for folder structure.

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
