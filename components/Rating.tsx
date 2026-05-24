import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
}

function StarIcon({ filled, partial, size }: { filled: boolean; partial: number; size: number }) {
  const id = `star-clip-${Math.random().toString(36).slice(2)}`;

  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path
          d="M8 1L9.85 5.9 15.18 6.27 11.24 9.69 12.47 15 8 12.15 3.53 15 4.76 9.69 0.82 6.27 6.15 5.9Z"
          fill="#F37338"
        />
      </svg>
    );
  }

  if (partial > 0) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <defs>
          <clipPath id={id}>
            <rect x="0" y="0" width={16 * partial} height="16" />
          </clipPath>
        </defs>
        <path
          d="M8 1L9.85 5.9 15.18 6.27 11.24 9.69 12.47 15 8 12.15 3.53 15 4.76 9.69 0.82 6.27 6.15 5.9Z"
          fill="rgba(243,240,238,0.15)"
        />
        <path
          d="M8 1L9.85 5.9 15.18 6.27 11.24 9.69 12.47 15 8 12.15 3.53 15 4.76 9.69 0.82 6.27 6.15 5.9Z"
          fill="#F37338"
          clipPath={`url(#${id})`}
        />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1L9.85 5.9 15.18 6.27 11.24 9.69 12.47 15 8 12.15 3.53 15 4.76 9.69 0.82 6.27 6.15 5.9Z"
        fill="rgba(243,240,238,0.15)"
      />
    </svg>
  );
}

export function Rating({ value, count, size = 'sm', className }: RatingProps) {
  const starSize = size === 'sm' ? 11 : 14;
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(value);
    const partial = !filled && i < value ? value - Math.floor(value) : 0;
    return { filled, partial };
  });

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {stars.map((s, i) => (
          <StarIcon key={i} filled={s.filled} partial={s.partial} size={starSize} />
        ))}
      </div>
      {count !== undefined && (
        <span
          style={{ fontSize: size === 'sm' ? 11 : 12, color: '#9A928A', fontWeight: 400 }}
        >
          {count >= 1000 ? `${(count / 1000).toFixed(0)}K` : count}
        </span>
      )}
    </div>
  );
}
