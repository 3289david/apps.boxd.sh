import Link from 'next/link';
import { AppIcon } from './AppIcon';
import { Rating } from './Rating';
import { Badge } from './Badge';
import { InstallButton } from './InstallButton';
import type { App } from '@/lib/data';

interface AppCardProps {
  app: App;
  variant?: 'grid' | 'row';
}

export function AppCard({ app, variant = 'grid' }: AppCardProps) {
  if (variant === 'row') {
    return (
      <div
        className="lift"
        style={{
          background: '#131210',
          borderRadius: 20,
          border: '1px solid rgba(243,240,238,0.06)',
          overflow: 'hidden',
        }}
      >
        <Link
          href={`/apps/${app.id}`}
          style={{ textDecoration: 'none', display: 'block', padding: '16px 16px 0 16px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <AppIcon gradient={app.iconGradient} name={app.name} size="sm" />
            <div style={{ flex: 1, minWidth: 0 }}>
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
                  marginTop: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {app.tagline}
              </p>
              <Rating value={app.rating} count={app.ratingCount} className="mt-1" />
            </div>
            <InstallButton appId={app.id} appUrl={app.url} size="sm" />
          </div>
        </Link>

        {/* Divider line — subtle */}
        <div
          style={{
            height: 1,
            background: 'rgba(243,240,238,0.05)',
            margin: '14px 0 0 86px',
          }}
        />
      </div>
    );
  }

  // Grid card (vertical)
  return (
    <div
      className="lift press"
      style={{
        background: '#131210',
        borderRadius: 24,
        border: '1px solid rgba(243,240,238,0.06)',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Header: icon + install button */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Link href={`/apps/${app.id}`} style={{ textDecoration: 'none' }}>
          <AppIcon gradient={app.iconGradient} name={app.name} size="md" />
        </Link>
        <InstallButton appId={app.id} appUrl={app.url} size="sm" />
      </div>

      {/* Info */}
      <Link href={`/apps/${app.id}`} style={{ textDecoration: 'none', flex: 1 }}>
        <div>
          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#F3F0EE',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            {app.name}
          </p>
          <p
            style={{
              fontSize: 13,
              color: '#9A928A',
              marginTop: 4,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {app.tagline}
          </p>
        </div>
      </Link>

      {/* Footer: rating + badges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Rating value={app.rating} size="sm" />
        <div style={{ display: 'flex', gap: 4 }}>
          {app.isOfflineReady && <Badge variant="offline" label="Offline" />}
          {app.isNew && <Badge variant="new" />}
        </div>
      </div>
    </div>
  );
}
