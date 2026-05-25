import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getApp, getApps, getAppsByCategory, formatRatingCount } from '@/lib/data';
import { AppIcon } from '@/components/AppIcon';
import { Rating } from '@/components/Rating';
import { Badge } from '@/components/Badge';
import { InstallButton } from '@/components/InstallButton';
import { AppCard } from '@/components/AppCard';

interface Props { params: Promise<{ id: string }> }

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return getApps().map(a => ({ id: a.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const app = getApp(id);
  if (!app) return {};
  return {
    title: `${app.name} — apps.boxd.sh`,
    description: app.tagline,
  };
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '20px 16px',
        borderRight: '1px solid rgba(243,240,238,0.06)',
      }}
    >
      <p style={{ fontSize: 18, fontWeight: 700, color: '#F3F0EE', letterSpacing: '-0.02em' }}>
        {value}
      </p>
      <p style={{ fontSize: 11, color: '#9A928A', marginTop: 4, textAlign: 'center', letterSpacing: '0.01em' }}>
        {label}
      </p>
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}

export default async function AppDetailPage({ params }: Props) {
  const { id } = await params;
  const app = getApp(id);
  if (!app) notFound();

  const related = getAppsByCategory(app.category)
    .filter(a => a.id !== app.id)
    .slice(0, 4);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 16px 60px' }}>

      {/* Back link */}
      <div style={{ marginBottom: 24 }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 14, color: '#F37338', textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          <BackIcon /> Home
        </Link>
      </div>

      {/* App header */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 32 }}>
        <div style={{ flexShrink: 0 }}>
          <AppIcon gradient={app.iconGradient} name={app.name} size="xl" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              fontSize: 28, fontWeight: 700, color: '#F3F0EE',
              letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 6,
            }}
          >
            {app.name}
          </h1>
          <p style={{ fontSize: 14, color: '#9A928A', marginBottom: 10 }}>
            {app.developer}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            <Badge variant="category" label={app.category.charAt(0).toUpperCase() + app.category.slice(1)} />
            {app.isOfflineReady && <Badge variant="offline" />}
            {app.isPWA && <Badge variant="pwa" />}
            {app.isTrending && <Badge variant="trending" />}
            {app.isNew && <Badge variant="new" />}
          </div>
          <Rating value={app.rating} count={app.ratingCount} size="md" />
        </div>
      </div>

      {/* Primary actions */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
        <InstallButton appId={app.id} appUrl={app.url} size="lg" variant="solid" />
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '0 20px', height: 40, borderRadius: 999,
            background: 'rgba(243,240,238,0.06)',
            border: '1px solid rgba(243,240,238,0.1)',
            color: '#9A928A', fontSize: 14, fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Open site <ExternalIcon />
        </a>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'flex',
          background: '#131210',
          borderRadius: 20,
          border: '1px solid rgba(243,240,238,0.06)',
          overflow: 'hidden',
          marginBottom: 32,
        }}
      >
        <StatItem label="Rating" value={app.rating.toFixed(1)} />
        <StatItem label="Reviews" value={formatRatingCount(app.ratingCount)} />
        <StatItem label="Size" value={app.size} />
        <div
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', padding: '20px 16px',
          }}
        >
          <p style={{ fontSize: 18, fontWeight: 700, color: '#F3F0EE', letterSpacing: '-0.02em' }}>
            {app.isPWA ? 'Yes' : 'No'}
          </p>
          <p style={{ fontSize: 11, color: '#9A928A', marginTop: 4, textAlign: 'center', letterSpacing: '0.01em' }}>
            Installable
          </p>
        </div>
      </div>

      {/* Description */}
      <div
        style={{
          background: '#131210',
          borderRadius: 20,
          border: '1px solid rgba(243,240,238,0.06)',
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontSize: 18, fontWeight: 700, color: '#F3F0EE',
            letterSpacing: '-0.02em', marginBottom: 12,
          }}
        >
          About {app.name}
        </h2>
        <p style={{ fontSize: 15, color: '#9A928A', lineHeight: 1.7 }}>
          {app.description}
        </p>
        <p style={{ fontSize: 15, color: '#9A928A', lineHeight: 1.7, marginTop: 12 }}>
          {app.tagline}. Works seamlessly in any modern browser and {app.isPWA ? 'can be installed as a native-like app on your device' : 'runs entirely in your browser with no installation needed'}.
          {app.isOfflineReady ? ' Fully functional even without an internet connection.' : ''}
        </p>
      </div>

      {/* Tags */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#9A928A', letterSpacing: '-0.01em', marginBottom: 12 }}>
          Tags
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {app.tags.map(tag => (
            <span
              key={tag}
              style={{
                padding: '5px 12px', borderRadius: 999,
                background: 'rgba(243,240,238,0.06)',
                border: '1px solid rgba(243,240,238,0.08)',
                fontSize: 13, color: '#9A928A',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Developer info */}
      <div
        style={{
          background: '#131210',
          borderRadius: 20,
          border: '1px solid rgba(243,240,238,0.06)',
          padding: '20px 24px',
          marginBottom: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p style={{ fontSize: 11, color: '#504840', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>
            Developer
          </p>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#F3F0EE', letterSpacing: '-0.01em' }}>
            {app.developer}
          </p>
        </div>
        <a
          href={app.developerUrl ?? app.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 16px', borderRadius: 999,
            background: 'rgba(243,240,238,0.06)',
            border: '1px solid rgba(243,240,238,0.1)',
            color: '#9A928A', fontSize: 13, fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Visit <ExternalIcon />
        </a>
      </div>

      {/* Related apps */}
      {related.length > 0 && (
        <div>
          <h2
            style={{
              fontSize: 20, fontWeight: 700, color: '#F3F0EE',
              letterSpacing: '-0.02em', marginBottom: 16,
            }}
          >
            More in {app.category.charAt(0).toUpperCase() + app.category.slice(1)}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 16,
            }}
          >
            {related.map(a => (
              <AppCard key={a.id} app={a} variant="grid" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
