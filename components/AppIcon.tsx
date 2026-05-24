import { cn } from '@/lib/utils';

interface AppIconProps {
  gradient: [string, string];
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs: { px: 40,  text: 14, radius: 10 },
  sm: { px: 56,  text: 18, radius: 14 },
  md: { px: 72,  text: 24, radius: 18 },
  lg: { px: 96,  text: 32, radius: 22 },
  xl: { px: 128, text: 44, radius: 28 },
};

export function AppIcon({ gradient, name, size = 'md', className }: AppIconProps) {
  const { px, text, radius } = sizeMap[size];

  // Show the first two characters (or first char if single word)
  const letters = name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      className={cn('flex-none flex items-center justify-center select-none', className)}
      style={{
        width: px,
        height: px,
        borderRadius: radius,
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
        boxShadow: `0 4px 16px 0 ${gradient[1]}44`,
      }}
      aria-hidden="true"
    >
      <span
        style={{
          fontSize: text,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: 'rgba(255,255,255,0.9)',
          lineHeight: 1,
          fontFamily: 'Inter, ui-sans-serif, sans-serif',
        }}
      >
        {letters}
      </span>
    </div>
  );
}
