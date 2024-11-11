# HomeBrew

A Next.js application for home management powered by Supabase authentication.

## Project Structure

The project follows a Feature-First Architecture:

```
src/app/
├── dashboard/
│   ├── layout.tsx        # Shared dashboard layout
│   ├── features/         # Feature-specific pages and components
│   │   ├── todo-list/
│   │   ├── habit-tracker/
│   │   ├── budget-finance/
│   │   ├── mental-health/
│   │   ├── nutrition-logger/
│   │   └── workout-tracker/
│   └── components/       # Dashboard-specific shared components
├── components/           # Global shared components
├── lib/                  # Shared utilities and helpers
└── types/               # TypeScript definitions
```

## Getting Started

1. Clone the repository:

```bash
git clone [your-repo-url]
cd [your-repo-name]
```

2. Copy the environment variables:

```bash
cp .env.example .env.local
```

3. Configure your `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Development

```bash
pnpm dev     # Start development server
pnpm build   # Build for production
pnpm start   # Start production server
```

## Tech Stack

- Next.js 14
- TypeScript
- TailwindCSS
- Supabase (Authentication & Database)
- Framer Motion
- Lucide Icons
