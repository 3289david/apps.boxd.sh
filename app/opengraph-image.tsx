import { ImageResponse } from 'next/og';

export const size        = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt         = 'apps.boxd.sh — App Store for Web Apps';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#0A0908',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '0 100px',
          position: 'relative',
          fontFamily: 'sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Glow top-right */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: -160,
            right: -120,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'rgba(243,115,56,0.12)',
          }}
        />
        {/* Glow bottom-left */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: -120,
            left: 160,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'rgba(243,115,56,0.07)',
          }}
        />

        {/* ── Logo row ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 48,
          }}
        >
          {/* Grid mark */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 64,
              height: 64,
              borderRadius: 14,
              background: '#F37338',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              padding: 13,
            }}
          >
            <div style={{ display: 'flex', gap: 7 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: '#0A0908' }} />
              <div style={{ width: 16, height: 16, borderRadius: 4, background: '#0A0908' }} />
            </div>
            <div style={{ display: 'flex', gap: 7 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: '#0A0908' }} />
              <div style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(10,9,8,0.35)' }} />
            </div>
          </div>

          {/* Wordmark */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 42, fontWeight: 800, color: '#F3F0EE', letterSpacing: '-0.03em', lineHeight: 1 }}>
              apps.
            </span>
            <span style={{ fontSize: 42, fontWeight: 800, color: '#F37338', letterSpacing: '-0.03em', lineHeight: 1 }}>
              boxd
            </span>
            <span style={{ fontSize: 42, fontWeight: 800, color: 'rgba(243,240,238,0.28)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              .sh
            </span>
          </div>
        </div>

        {/* ── Headline ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            marginBottom: 24,
            maxWidth: 900,
            gap: 0,
          }}
        >
          <span style={{ color: '#F3F0EE' }}>App Store for&nbsp;</span>
          <span style={{ color: '#F37338' }}>Web Apps</span>
        </div>

        {/* ── Subline ── */}
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: 'rgba(243,240,238,0.45)',
            letterSpacing: '-0.01em',
            lineHeight: 1.4,
            marginBottom: 52,
          }}
        >
          Use instantly in your browser. Install if you want.
        </div>

        {/* ── Stat pills ── */}
        <div style={{ display: 'flex', gap: 12 }}>
          {['30 curated apps', '8 categories', 'Offline Ready', 'PWA Installable'].map(label => (
            <div
              key={label}
              style={{
                display: 'flex',
                padding: '10px 20px',
                borderRadius: 999,
                background: 'rgba(243,240,238,0.06)',
                border: '1px solid rgba(243,240,238,0.1)',
                fontSize: 17,
                color: 'rgba(243,240,238,0.55)',
                fontWeight: 500,
                letterSpacing: '-0.01em',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
