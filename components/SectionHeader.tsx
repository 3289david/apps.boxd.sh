import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  eyebrow?: string;
}

export function SectionHeader({ title, subtitle, href, eyebrow }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-4 px-4 md:px-0">
      <div>
        {eyebrow && (
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#F37338',
              marginBottom: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#F37338',
                flexShrink: 0,
              }}
            />
            {eyebrow}
          </p>
        )}
        <h2
          style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: '#F3F0EE',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: 14, color: '#9A928A', marginTop: 2 }}>{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: '#F37338',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            marginLeft: 16,
            paddingBottom: 2,
          }}
        >
          See All
        </Link>
      )}
    </div>
  );
}
