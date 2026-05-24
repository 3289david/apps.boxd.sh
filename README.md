# apps.boxd.sh

**App Store for Web Apps** — use instantly, install if you want.

Built with Next.js 15, Tailwind CSS v4, NextAuth.js (GitHub OAuth).

---

## Getting Started

### 1. Environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

| Variable | Value |
|---|---|
| `GITHUB_ID` | GitHub OAuth App Client ID |
| `GITHUB_SECRET` | GitHub OAuth App Client Secret |
| `NEXTAUTH_SECRET` | Run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` (dev) or `https://apps.boxd.sh` (prod) |

**Create the GitHub OAuth App:**
1. Go to https://github.com/settings/developers
2. New OAuth App
3. Homepage URL: `https://apps.boxd.sh`
4. Callback URL: `https://apps.boxd.sh/api/auth/callback/github`
5. (For local dev callback: `http://localhost:3000/api/auth/callback/github`)

### 2. Dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3. Production build

```bash
npm run build
npm run start
```

---

## Deployment (boxd.sh)

**Vercel (recommended):**
```bash
vercel --prod
```
Set the environment variables in the Vercel project settings.

**Self-hosted:**
```bash
npm run build
node .next/standalone/server.js
```

---

## Project Structure

```
app/
  page.tsx              # Homepage (Featured + sections)
  apps/[id]/page.tsx    # App detail page
  category/[slug]/      # Category browse
  search/               # Search results
  submit/               # Submit form (requires GitHub login)
  browse/               # All apps grid
  library/              # Saved apps (localStorage)
  api/auth/[...nextauth]/ # GitHub OAuth

components/
  Navigation.tsx        # Desktop floating pill nav + mobile nav
  BottomNav.tsx         # Mobile bottom tab bar
  FeaturedBanner.tsx    # Auto-rotating hero carousel
  CategoryRow.tsx       # Horizontal scroll sections
  AppCard.tsx           # App card (grid + row variants)
  AppIcon.tsx           # Gradient icon with initials
  InstallButton.tsx     # Get/Open with localStorage tracking
  Rating.tsx            # Star rating component
  Badge.tsx             # Offline/PWA/New/Trending badges

lib/
  data.ts               # App catalog + helpers
  auth.ts               # NextAuth config
  utils.ts              # cn() and helpers
```

---

## Adding Apps

Edit `lib/data.ts` and add to the `apps` array:

```ts
{
  id: 'my-app',
  name: 'My App',
  tagline: 'Short description (under 80 chars)',
  description: 'Longer description shown on detail page.',
  url: 'https://myapp.com',
  category: 'utilities',          // see Category type
  iconGradient: ['#4F46E5', '#7C3AED'],  // from, to
  accentColor: '#6366F1',          // for featured banner glow
  rating: 4.5,
  ratingCount: 1200,
  size: '< 2 MB',
  developer: 'Your Name',
  isOfflineReady: true,
  isPWA: true,
  isNew: true,
  isTrending: false,
  isFeatured: false,
  tags: ['tool', 'utilities'],
}
```

---

## Design System

Based on the principles in `DESIGN.md` (Mastercard editorial), adapted for dark mode:

| Token | Value | Usage |
|---|---|---|
| Canvas | `#0A0908` | Page background |
| Surface | `#131210` | Cards |
| Elevated | `#1E1B18` | Nav, modals |
| Cream | `#F3F0EE` | Primary text |
| Orange | `#F37338` | Accent, CTAs |
| Border | `rgba(243,240,238,0.08)` | Card borders |

---

## License

MIT
