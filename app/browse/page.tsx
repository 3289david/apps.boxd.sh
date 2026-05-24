import Link from 'next/link';
import { apps, categoryMeta } from '@/lib/data';
import { AppCard } from '@/components/AppCard';
import { SectionHeader } from '@/components/SectionHeader';

export const metadata = { title: 'Browse All Apps — apps.boxd.sh' };

export default function BrowsePage() {
  const offlineApps  = apps.filter(a => a.isOfflineReady);
  const pwaApps      = apps.filter(a => a.isPWA);
  const trendingApps = apps.filter(a => a.isTrending);

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 16px 60px' }}>

      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#F3F0EE', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          Browse Apps
        </h1>
        <p style={{ fontSize: 15, color: '#9A928A', marginTop: 8 }}>
          {apps.length} apps · {categoryMeta.length} categories
        </p>
      </div>

      {/* Category grid */}
      <section style={{ marginBottom: 48 }}>
        <SectionHeader title="Categories" eyebrow="Browse" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 12,
          }}
        >
          {categoryMeta.map(cat => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              style={{
                padding: '20px 16px', borderRadius: 20,
                background: '#131210',
                border: '1px solid rgba(243,240,238,0.06)',
                textDecoration: 'none',
                display: 'flex', flexDirection: 'column', gap: 8,
                transition: 'border-color 0.15s ease',
              }}
            >
              <div
                style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: `${cat.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 800, color: cat.color }}>
                  {cat.label[0]}
                </span>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#F3F0EE', letterSpacing: '-0.01em' }}>
                  {cat.label}
                </p>
                <p style={{ fontSize: 12, color: '#9A928A', marginTop: 2 }}>
                  {apps.filter(a => a.category === cat.id).length} apps
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All apps */}
      <section>
        <SectionHeader title="All Apps" eyebrow="Catalog" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 16,
          }}
        >
          {apps.map(app => (
            <AppCard key={app.id} app={app} variant="grid" />
          ))}
        </div>
      </section>
    </div>
  );
}
