import Link from 'next/link';
import { AppCard } from './AppCard';
import { AppIcon } from './AppIcon';
import { Rating } from './Rating';
import { Badge } from './Badge';
import { InstallButton } from './InstallButton';
import { SectionHeader } from './SectionHeader';
import type { App } from '@/lib/data';

interface CategoryRowProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  apps: App[];
  href?: string;
  variant?: 'scroll' | 'list';
}

export function CategoryRow({
  title,
  subtitle,
  eyebrow,
  apps,
  href,
  variant = 'scroll',
}: CategoryRowProps) {
  if (variant === 'list') {
    return (
      <section style={{ marginBottom: 48 }}>
        <SectionHeader title={title} subtitle={subtitle} eyebrow={eyebrow} href={href} />
        <div style={{ paddingLeft: 16, paddingRight: 16 }}>
          <div
            style={{
              background: '#131210',
              borderRadius: 24,
              border: '1px solid rgba(243,240,238,0.06)',
              overflow: 'hidden',
            }}
          >
            {apps.map((app, i) => (
              <div key={app.id}>
                <div style={{ padding: '16px 16px' }}>
                  <RowItem app={app} />
                </div>
                {i < apps.length - 1 && (
                  <div
                    style={{
                      height: 1,
                      background: 'rgba(243,240,238,0.05)',
                      marginLeft: 16 + 56 + 14,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Horizontal scroll
  return (
    <section style={{ marginBottom: 48 }}>
      <SectionHeader title={title} subtitle={subtitle} eyebrow={eyebrow} href={href} />
      <div
        className="scroll-hide"
        style={{
          overflowX: 'auto',
          display: 'flex',
          gap: 16,
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 4,
        }}
      >
        {apps.map(app => (
          <div key={app.id} style={{ flex: '0 0 200px', minWidth: 200 }}>
            <AppCard app={app} variant="grid" />
          </div>
        ))}
      </div>
    </section>
  );
}

function RowItem({ app }: { app: App }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Link href={`/apps/${app.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
        <AppIcon gradient={app.iconGradient} name={app.name} size="sm" />
      </Link>
      <Link href={`/apps/${app.id}`} style={{ flex: 1, minWidth: 0, textDecoration: 'none' }}>
        <p
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#F3F0EE',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {app.name}
        </p>
        <p
          style={{
            fontSize: 12,
            color: '#9A928A',
            marginTop: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {app.tagline}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <Rating value={app.rating} size="sm" />
          {app.isOfflineReady && <Badge variant="offline" label="Offline" />}
        </div>
      </Link>
      <InstallButton appId={app.id} appUrl={app.url} size="sm" />
    </div>
  );
}
