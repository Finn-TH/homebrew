# HomeBrew - Development Journal

## Current Framework

- **Framework**: Next.js 15
- **Authentication**: Supabase
- **Key Features**: Server Components, Feature-First Architecture, Supabase Integration

## Architecture Evolution

### Feature-First Architecture Implementation (2024)

The application follows a Feature-First Architecture with Supabase integration:

**Current Structure**:

```
src/app/
├── dashboard/
│   ├── features/         # Self-contained feature modules
│   │   ├── todo-list/
│   │   ├── habit-tracker/
│   │   ├── budget-finance/
│   │   ├── mental-health/
│   │   ├── nutrition-logger/
│   │   └── workout-tracker/
│   └── components/       # Shared dashboard components
```

### Authentication Integration

- Fully integrated Supabase authentication
- Email-password authentication flow
- Protected routes with middleware
- User session management
- Secure data fetching per feature

### Component Organization

- Features are self-contained in `/dashboard/features/`
- Each feature includes:
  - `page.tsx` (Server Component)
  - Feature-specific components
  - Supabase data fetching
  - Consistent styling patterns

### Performance Optimizations

- Server-first approach with Next.js
- Optimized Supabase queries
- Partial rendering through layouts
- Reduced client-side JavaScript

## Design System

### Color Palette

- Primary: `#8B4513` (Coffee Brown)
- Secondary: `#A0522D` (Saddle Brown)
- Background: `#FDF6EC` (Cream)
- Accents: Various opacity levels of primary colors

### UI Components

1. **Feature Cards**

   - Glass-morphism effect
   - Hover states with gradient overlays
   - Interactive icons and buttons
   - Responsive grid layout

2. **Navigation**
   - Clean, minimal header
   - User authentication status
   - Profile management
   - Responsive design

# Future Features

## Todo-list

### Drag and Drop Reordering

- **Library**: @dnd-kit/core for modern, accessible drag-drop
- **Key Features**:
  - Reorder todos via drag and drop
  - Persist custom order in database
  - Touch and keyboard accessible
  - Visual feedback during dragging
  - Optimistic updates

**Technical Implementation**:

```typescript
// Database Schema Update
alter table todos add column "order" integer;

// Supabase Function
create function update_todos_order(order_updates jsonb[])
returns void as $$
  // Atomic updates for todo ordering
$$;
```

**Components Needed**:

- DragContext wrapper
- Sortable todo items
- Order persistence logic
- Loading/error states

### Other Planned Features

- Due dates and reminders
- Categories/Tags system
- Search functionality
- Keyboard shortcuts
- Dark mode support

## Future Considerations

- Enhanced user preferences system
- Additional authentication methods (OAuth)
- Dark mode implementation
- Performance monitoring
- Accessibility improvements

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase
- **Database**: Supabase
- **Animations**: Framer Motion
- **Icons**: Lucide Icons

This document will be updated as the application evolves with new features, design changes, and architectural improvements.
