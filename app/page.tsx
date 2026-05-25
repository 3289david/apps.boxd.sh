import { FeaturedBanner } from '@/components/FeaturedBanner';
import { CategoryRow } from '@/components/CategoryRow';
import { SectionHeader } from '@/components/SectionHeader';
import { AppCard } from '@/components/AppCard';
import { Badge } from '@/components/Badge';
import Link from 'next/link';
import {
  apps,
  getFeaturedApps,
  getTrendingApps,
  getNewApps,
  getOfflineApps,
  getAppsByCategory,
  categoryMeta,
} from '@/lib/data';

export const metadata = {
  title: 'apps.boxd.sh — App Store for Web Apps',
};

// ── Category icon SVGs ────────────────────────────────────────────────────────

function CategoryCard({ id, label, color }: { id: string; label: string; color: string }) {
  return (
    <Link
      href={`/category/${id}`}
      style={{
        flex: '0 0 auto',
        width: 120,
        height: 64,
        borderRadius: 16,
        background: `${color}14`,
        border: `1px solid ${color}22`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
      }}
      className="press"
    >
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color,
          letterSpacing: '-0.01em',
        }}
      >
        {label}
      </span>
    </Link>
  );
}

export default function HomePage() {
  const featured   = getFeaturedApps();
  const trending   = getTrendingApps();
  const newApps    = getNewApps();
  const offline    = getOfflineApps();
  const devApps    = getAppsByCategory('developer');
  const aiApps     = getAppsByCategory('ai');
  const prodApps   = getAppsByCategory('productivity');
  const designApps = getAppsByCategory('design');

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', paddingBottom: 40 }}>

      {/* ── Brand intro strip ── */}
      <div
        style={{
          padding: '0 16px',
          marginBottom: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#F37338',
              margin: 0,
              marginBottom: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {/* inline grid mark */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect width="14" height="14" rx="3" fill="#F37338"/>
              <rect x="2.5" y="2.5" width="4"  height="4"  rx="1" fill="#0A0908"/>
              <rect x="7.5" y="2.5" width="4"  height="4"  rx="1" fill="#0A0908"/>
              <rect x="2.5" y="7.5" width="4"  height="4"  rx="1" fill="#0A0908"/>
              <rect x="7.5" y="7.5" width="4"  height="4"  rx="1" fill="#0A0908" opacity="0.35"/>
            </svg>
            apps.boxd.sh
          </h1>
          <p
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#F3F0EE',
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            App Store for Web Apps
          </p>
        </div>
        <Link
          href="/browse"
          style={{
            flexShrink: 0,
            padding: '8px 18px',
            borderRadius: 999,
            background: 'rgba(243,240,238,0.06)',
            border: '1px solid rgba(243,240,238,0.1)',
            fontSize: 13,
            fontWeight: 500,
            color: '#9A928A',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Browse all
        </Link>
      </div>

      {/* ── Hero: featured banner ── */}
      {featured.length > 0 && <FeaturedBanner apps={featured} />}

      {/* ── Categories horizontal pill row ── */}
      <section style={{ marginBottom: 48, paddingLeft: 16 }}>
        <p
          style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: '#F37338',
            marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#F37338' }} />
          Browse by Category
        </p>
        <div
          className="scroll-hide"
          style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingRight: 16, paddingBottom: 4 }}
        >
          {categoryMeta.map(cat => (
            <CategoryCard key={cat.id} id={cat.id} label={cat.label} color={cat.color} />
          ))}
        </div>
      </section>

      {/* ── Trending ── */}
      {trending.length > 0 && (
        <CategoryRow
          title="Trending Now"
          eyebrow="Hot"
          apps={trending}
          href="/browse?filter=trending"
          variant="scroll"
        />
      )}

      {/* ── New Arrivals ── */}
      {newApps.length > 0 && (
        <CategoryRow
          title="New Arrivals"
          subtitle="Fresh apps added this week"
          eyebrow="New"
          apps={newApps}
          href="/browse?filter=new"
          variant="scroll"
        />
      )}

      {/* ── AI Apps ── */}
      {aiApps.length > 0 && (
        <CategoryRow
          title="AI Apps"
          subtitle="Powered by intelligence"
          eyebrow="Category"
          apps={aiApps.slice(0, 8)}
          href="/category/ai"
          variant="scroll"
        />
      )}

      {/* ── Offline Ready — list variant ── */}
      {offline.length > 0 && (
        <section style={{ marginBottom: 48 }}>
          <SectionHeader
            title="Works Offline"
            subtitle="These apps keep working without internet"
            eyebrow="Offline Ready"
            href="/browse?filter=offline"
          />
          <div style={{ paddingLeft: 16, paddingRight: 16 }}>
            <div
              style={{
                background: '#131210',
                borderRadius: 24,
                border: '1px solid rgba(243,240,238,0.06)',
                overflow: 'hidden',
              }}
            >
              {offline.slice(0, 5).map((app, i) => (
                <div key={app.id}>
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <Link href={`/apps/${app.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                        <div
                          style={{
                            width: 56, height: 56, borderRadius: 14,
                            background: `linear-gradient(135deg, ${app.iconGradient[0]}, ${app.iconGradient[1]})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.9)',
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {app.name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                      </Link>
                      <Link href={`/apps/${app.id}`} style={{ flex: 1, minWidth: 0, textDecoration: 'none' }}>
                        <p style={{ fontSize: 15, fontWeight: 600, color: '#F3F0EE', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {app.name}
                        </p>
                        <p style={{ fontSize: 12, color: '#9A928A', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {app.tagline}
                        </p>
                        <div style={{ display: 'flex', gap: 4, marginTop: 5 }}>
                          <Badge variant="offline" />
                          {app.isPWA && <Badge variant="pwa" label="PWA" />}
                        </div>
                      </Link>
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flexShrink: 0, padding: '6px 16px', borderRadius: 999,
                          background: 'rgba(243,240,238,0.1)', color: '#F37338',
                          fontSize: 12, fontWeight: 600, textDecoration: 'none',
                          border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                        }}
                      >
                        Get
                      </a>
                    </div>
                  </div>
                  {i < Math.min(offline.length, 5) - 1 && (
                    <div style={{ height: 1, background: 'rgba(243,240,238,0.05)', marginLeft: 16 + 56 + 14 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Developer Tools ── */}
      {devApps.length > 0 && (
        <CategoryRow
          title="Developer Tools"
          subtitle="Built for builders"
          eyebrow="Category"
          apps={devApps.slice(0, 8)}
          href="/category/developer"
          variant="scroll"
        />
      )}

      {/* ── Design ── */}
      {designApps.length > 0 && (
        <CategoryRow
          title="Design"
          eyebrow="Category"
          apps={designApps.slice(0, 6)}
          href="/category/design"
          variant="scroll"
        />
      )}

      {/* ── Productivity: grid ── */}
      {prodApps.length > 0 && (
        <section style={{ marginBottom: 48 }}>
          <SectionHeader
            title="Productivity"
            eyebrow="Category"
            href="/category/productivity"
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 16,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            {prodApps.slice(0, 6).map(app => (
              <AppCard key={app.id} app={app} variant="grid" />
            ))}
          </div>
        </section>
      )}

      {/* ── Submit CTA ── */}
      <div style={{ paddingLeft: 16, paddingRight: 16 }}>
        <div
          style={{
            borderRadius: 32,
            background: 'linear-gradient(135deg, #1E1B18, #131210)',
            border: '1px solid rgba(243,240,238,0.08)',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: '#F37338', marginBottom: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#F37338' }} />
            For Developers
          </p>
          <h2
            style={{
              fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em',
              color: '#F3F0EE', lineHeight: 1.15, marginBottom: 12,
            }}
          >
            Built a great web app?
          </h2>
          <p style={{ fontSize: 15, color: '#9A928A', lineHeight: 1.6, marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
            Submit your PWA to apps.boxd.sh and reach thousands of users looking for great web experiences.
          </p>
          <Link
            href="/submit"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 999,
              background: '#F37338', color: '#0A0908',
              fontSize: 15, fontWeight: 700, textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}
          >
            Submit Your App
          </Link>
        </div>
      </div>

    </div>
  );
}
