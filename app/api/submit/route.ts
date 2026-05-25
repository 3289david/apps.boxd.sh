import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { urlExists, idExists, getRateLimitCount, recordSubmission, insertApp } from '@/lib/db';
import type { Category } from '@/lib/data';

// Category → gradient + accent
const CATEGORY_COLORS: Record<Category, { gradient: [string, string]; accent: string }> = {
  ai:            { gradient: ['#7C3AED', '#8B5CF6'], accent: '#8B5CF6' },
  productivity:  { gradient: ['#EA580C', '#F97316'], accent: '#F97316' },
  developer:     { gradient: ['#059669', '#10B981'], accent: '#10B981' },
  design:        { gradient: ['#DB2777', '#EC4899'], accent: '#EC4899' },
  student:       { gradient: ['#1D4ED8', '#3B82F6'], accent: '#3B82F6' },
  utilities:     { gradient: ['#D97706', '#F59E0B'], accent: '#F59E0B' },
  communication: { gradient: ['#4F46E5', '#6366F1'], accent: '#6366F1' },
  media:         { gradient: ['#B91C1C', '#DC2626'], accent: '#DC2626' },
};

const VALID_CATEGORIES = new Set<string>([
  'ai', 'productivity', 'developer', 'design',
  'student', 'utilities', 'communication', 'media',
]);

// Strip all HTML tags and trim
function sanitize(s: string): string {
  return s.replace(/<[^>]*>/g, '').trim();
}

// Slugify name → id, ensure uniqueness
function makeId(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

// Basic spam / abuse patterns to block
const BLOCKED_PATTERNS = [
  /\b(click here|free money|make money fast|earn \$|casino|porn|xxx|sex|viagra|crypto airdrop)\b/i,
  /<script/i,
  /javascript:/i,
  /data:text\/html/i,
];

function containsSpam(text: string): boolean {
  return BLOCKED_PATTERNS.some(p => p.test(text));
}

// Check that a URL is reachable (HEAD with 6s timeout)
async function isUrlReachable(url: string): Promise<{ ok: boolean; reason?: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timeout);
    if (!res.ok) {
      return { ok: false, reason: `URL returned HTTP ${res.status}` };
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: 'URL is not reachable or timed out' };
  }
}

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Sign in with GitHub first' }, { status: 401 });
  }
  const userId = session.user.email;

  // ── Rate limit: 5 submissions per 24 hours ────────────────────────────────
  const count = getRateLimitCount(userId);
  if (count >= 5) {
    return NextResponse.json(
      { error: 'Rate limit reached — max 5 submissions per 24 hours' },
      { status: 429 }
    );
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const raw = {
    name:         String(body.name         ?? ''),
    tagline:      String(body.tagline      ?? ''),
    description:  String(body.description  ?? ''),
    url:          String(body.url          ?? ''),
    category:     String(body.category     ?? ''),
    developer:    String(body.developer    ?? ''),
    developerUrl: String(body.developerUrl ?? ''),
    size:         String(body.size         ?? ''),
    isOfflineReady: Boolean(body.isOfflineReady),
    isPWA:          Boolean(body.isPWA),
    tagsRaw:      String(body.tags         ?? ''),
  };

  // ── Sanitize all text inputs ──────────────────────────────────────────────
  const name        = sanitize(raw.name);
  const tagline     = sanitize(raw.tagline);
  const description = sanitize(raw.description);
  const url         = sanitize(raw.url);
  const category    = sanitize(raw.category);
  const developer   = sanitize(raw.developer);
  const developerUrl = sanitize(raw.developerUrl);
  const size        = sanitize(raw.size) || '< 5 MB';
  const tagsInput   = sanitize(raw.tagsRaw);

  // ── Required field validation ─────────────────────────────────────────────
  const missing: string[] = [];
  if (!name)        missing.push('App Name');
  if (!tagline)     missing.push('Tagline');
  if (!description) missing.push('Description');
  if (!url)         missing.push('URL');
  if (!category)    missing.push('Category');
  if (!developer)   missing.push('Developer');
  if (missing.length) {
    return NextResponse.json({ error: `Missing required fields: ${missing.join(', ')}` }, { status: 400 });
  }

  // ── Length limits ─────────────────────────────────────────────────────────
  if (name.length > 100)        return NextResponse.json({ error: 'App name too long (max 100 chars)' }, { status: 400 });
  if (tagline.length > 100)     return NextResponse.json({ error: 'Tagline too long (max 100 chars)' }, { status: 400 });
  if (description.length < 20)  return NextResponse.json({ error: 'Description too short (min 20 chars)' }, { status: 400 });
  if (description.length > 1000) return NextResponse.json({ error: 'Description too long (max 1000 chars)' }, { status: 400 });
  if (developer.length > 100)   return NextResponse.json({ error: 'Developer name too long (max 100 chars)' }, { status: 400 });

  // ── Category validation ───────────────────────────────────────────────────
  if (!VALID_CATEGORIES.has(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  // ── URL: must be HTTPS ────────────────────────────────────────────────────
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
  }
  if (parsedUrl.protocol !== 'https:') {
    return NextResponse.json({ error: 'App URL must use HTTPS' }, { status: 400 });
  }

  // ── Developer URL: if provided, must be HTTPS ─────────────────────────────
  if (developerUrl) {
    try {
      const devParsed = new URL(developerUrl);
      if (devParsed.protocol !== 'https:') {
        return NextResponse.json({ error: 'Developer URL must use HTTPS' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid developer URL format' }, { status: 400 });
    }
  }

  // ── Spam / injection checks ───────────────────────────────────────────────
  const textFields = [name, tagline, description, developer];
  for (const t of textFields) {
    if (containsSpam(t)) {
      return NextResponse.json({ error: 'Submission contains disallowed content' }, { status: 400 });
    }
  }

  // ── Duplicate URL check ───────────────────────────────────────────────────
  if (urlExists(url)) {
    return NextResponse.json({ error: 'This URL is already listed' }, { status: 409 });
  }

  // ── URL reachability check ────────────────────────────────────────────────
  const reachable = await isUrlReachable(url);
  if (!reachable.ok) {
    return NextResponse.json(
      { error: reachable.reason ?? 'App URL is not reachable' },
      { status: 400 }
    );
  }

  // ── Build tags from category + user input ─────────────────────────────────
  const userTags = tagsInput
    .split(/[,\s]+/)
    .map(t => sanitize(t).toLowerCase().replace(/[^a-z0-9-]/g, ''))
    .filter(t => t.length >= 2 && t.length <= 30)
    .slice(0, 8);
  const tags = Array.from(new Set([category, ...userTags]));

  // ── Generate unique ID ────────────────────────────────────────────────────
  let id = makeId(name);
  if (!id) id = `app-${Date.now()}`;
  let suffix = 0;
  while (idExists(suffix === 0 ? id : `${id}-${suffix}`)) suffix++;
  if (suffix > 0) id = `${id}-${suffix}`;

  // ── Pick colors from category ─────────────────────────────────────────────
  const colors = CATEGORY_COLORS[category as Category];

  // ── Insert into DB (auto-listed immediately) ──────────────────────────────
  try {
    insertApp({
      id,
      name,
      tagline,
      description,
      url,
      category: category as Category,
      iconGradient: colors.gradient,
      accentColor: colors.accent,
      size,
      developer,
      developerUrl: developerUrl || undefined,
      isOfflineReady: raw.isOfflineReady,
      isPWA: raw.isPWA,
      tags,
      submittedBy: userId,
    });
    recordSubmission(userId);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('UNIQUE')) {
      return NextResponse.json({ error: 'This URL is already listed' }, { status: 409 });
    }
    console.error('DB insert error:', err);
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id }, { status: 201 });
}
