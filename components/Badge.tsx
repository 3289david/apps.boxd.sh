import { cn } from '@/lib/utils';

type BadgeVariant = 'offline' | 'pwa' | 'new' | 'trending' | 'featured' | 'category';

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

const badgeConfig: Record<BadgeVariant, { label: string; color: string; bg: string; icon?: string }> = {
  offline:  { label: 'Works Offline', color: '#22C55E', bg: 'rgba(34,197,94,0.12)',  icon: 'wifi-off' },
  pwa:      { label: 'Installable',   color: '#60A5FA', bg: 'rgba(96,165,250,0.12)', icon: 'download' },
  new:      { label: 'New',           color: '#F37338', bg: 'rgba(243,115,56,0.12)' },
  trending: { label: 'Trending',      color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  featured: { label: 'Featured',      color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' },
  category: { label: '',              color: '#9A928A', bg: 'rgba(154,146,138,0.12)' },
};

function WifiOffIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23"/>
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
      <path d="M10.71 5.05A16 16 0 0 1 22.56 9"/>
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
      <line x1="12" y1="20" x2="12.01" y2="20"/>
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

export function Badge({ variant, label, className }: BadgeProps) {
  const cfg = badgeConfig[variant];
  const text = label ?? cfg.label;

  return (
    <span
      className={cn('inline-flex items-center gap-1 font-medium', className)}
      style={{
        fontSize: 11,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 3,
        paddingBottom: 3,
        borderRadius: 6,
        color: cfg.color,
        background: cfg.bg,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.icon === 'wifi-off' && <WifiOffIcon />}
      {cfg.icon === 'download' && <DownloadIcon />}
      {text}
    </span>
  );
}
