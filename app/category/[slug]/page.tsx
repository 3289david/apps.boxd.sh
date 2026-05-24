import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAppsByCategory, getCategoryMeta, categoryMeta, type Category } from '@/lib/data';
import { AppCard } from '@/components/AppCard';
import { SectionHeader } from '@/components/SectionHeader';

interface Props { params: Promise<{ slug: string }> }

const validCategories = categoryMeta.map(c => c.id);

export function generateStaticParams() {
  return categoryMeta.map(c => ({ slug: c.id }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cat = getCategoryMeta(slug as Category);
  if (!cat) return {};
  return { title: `${cat.label} — apps.boxd.sh`, description: cat.description };
}

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  if (!validCategories.includes(slug as Category)) notFound();

  const cat  = getCategoryMeta(slug as Category)!;
  const apps = getAppsByCategory(slug as Category);

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 16px 60px' }}>

      {/* Back */}
      <div style={{ marginBottom: 24 }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 14, color: '#F37338', textDecoration: 'none', fontWeight: 500,
          }}
        >
          <BackIcon /> Home
        </Link>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <p
          style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: '#F37338', marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#F37338' }} />
          Category
        </p>
        <h1
          style={{
            fontSize: 36, fontWeight: 700, color: '#F3F0EE',
            letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 8,
          }}
        >
          {cat.label}
        </h1>
        <p style={{ fontSize: 15, color: '#9A928A' }}>{cat.description}</p>
      </div>

      {/* Other categories pills */}
      <div
        className="scroll-hide"
        style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 40, paddingBottom: 4 }}
      >
        {categoryMeta.map(c => (
          <Link
            key={c.id}
            href={`/category/${c.id}`}
            style={{
              flexShrink: 0,
              padding: '7px 16px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: c.id === slug ? 600 : 400,
              color: c.id === slug ? '#0A0908' : '#9A928A',
              background: c.id === slug ? '#F37338' : 'rgba(243,240,238,0.06)',
              border: c.id === slug ? 'none' : '1px solid rgba(243,240,238,0.08)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {/* Apps count */}
      <p style={{ fontSize: 13, color: '#504840', marginBottom: 24 }}>
        {apps.length} app{apps.length !== 1 ? 's' : ''}
      </p>

      {/* Apps grid */}
      {apps.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontSize: 16, color: '#9A928A' }}>No apps in this category yet.</p>
          <Link
            href="/submit"
            style={{
              display: 'inline-block', marginTop: 16,
              padding: '10px 24px', borderRadius: 999,
              background: '#F37338', color: '#0A0908',
              fontSize: 14, fontWeight: 600, textDecoration: 'none',
            }}
          >
            Submit the first one
          </Link>
        </div>
      ) : (
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
      )}
    </div>
  );
}
