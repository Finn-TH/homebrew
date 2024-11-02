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

The project includes a convenient script to switch between auth providers. You can use the following commands:

```bash
pnpm auth:clerk    # Switch to Clerk authentication
pnpm auth:supabase # Switch to Supabase authentication
```

Add `--force` flag to discard any local changes during switching:

```bash
pnpm auth:clerk --force    # Force switch to Clerk
pnpm auth:supabase --force # Force switch to Supabase
```

The script will:

- Check for uncommitted changes
- Switch branches
- Clean up build files
- Reinstall dependencies

> Note: Remember to update your `.env.local` with the appropriate variables for each auth provider.```

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
