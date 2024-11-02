# HomeBrew

A Next.js application for home management with dual authentication implementations.

## Project Structure

The project maintains two authentication approaches in separate branches:

- `main` - Clerk Authentication
- `feature/supabase-auth` - Supabase Authentication

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
# For Supabase Auth (feature/supabase-auth branch)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# For Clerk Auth (main branch)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## Switching Authentication Providers

### For Clerk (main branch):

```bash
git checkout main
# Comment out Supabase variables in .env.local
# Uncomment Clerk variables in .env.local
rm -rf node_modules .next pnpm-lock.yaml
pnpm install
pnpm dev
```

### For Supabase (feature/supabase-auth branch):

```bash
git checkout feature/supabase-auth
# Comment out Clerk variables in .env.local
# Uncomment Supabase variables in .env.local
rm -rf node_modules .next pnpm-lock.yaml
pnpm install
pnpm dev
```

## Development

```bash
pnpm dev     # Start development server
pnpm build   # Build for production
pnpm start   # Start production server
```

## Note

This project currently maintains two authentication implementations for evaluation purposes. Eventually, one approach will be chosen and merged into the main branch.

## Tech Stack

- Next.js 14
- TypeScript
- TailwindCSS
- Authentication: Clerk / Supabase
