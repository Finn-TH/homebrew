# HomeBrew

A Next.js application for home management with dual authentication implementations.

## Project Structure

The project maintains three branches for authentication testing and implementation:

- `main` - Clean, auth-agnostic base code
- `feature/clerk-auth` - Clerk Authentication implementation
- `feature/supabase-auth` - Supabase Authentication implementation

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

# For Clerk Auth (feature/clerk-auth branch)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## Authentication Testing Workflow

### Initial Testing

To test either authentication implementation, checkout the respective feature branch:

```bash
git checkout feature/clerk-auth     # Test Clerk implementation
# or
git checkout feature/supabase-auth  # Test Supabase implementation
```

### Switching Between Branches

During testing, use our convenient switching script:

```bash
pnpm auth:main     # Switch to clean main branch
pnpm auth:clerk    # Switch to Clerk authentication
pnpm auth:supabase # Switch to Supabase authentication
```

Add `--force` flag for a fresh start:

```bash
pnpm auth:main --force     # Force switch to clean main
pnpm auth:clerk --force    # Force switch to Clerk
pnpm auth:supabase --force # Force switch to Supabase
```

The switching script will:

- Check for uncommitted changes
- Switch between branches
- Clean up build files
- Reinstall dependencies

> Note: When switching to auth branches, remember to update your `.env.local` with the appropriate variables for each auth provider.

## Development

```bash
pnpm dev     # Start development server
pnpm build   # Build for production
pnpm start   # Start production server
```

## Note

This project maintains separate authentication implementations for evaluation purposes. Once an auth provider is chosen, its feature branch will be merged into main and the alternative implementation will be archived.

## Tech Stack

- Next.js 14
- TypeScript
- TailwindCSS
- Authentication: Clerk / Supabase
