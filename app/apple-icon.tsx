import { ImageResponse } from 'next/og';

export const size        = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 38,
          background: '#0A0908',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Outer orange rounded square */}
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: 24,
            background: '#F37338',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: 20,
          }}
        >
          {/* 2×2 grid */}
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#0A0908' }} />
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#0A0908' }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#0A0908' }} />
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(10,9,8,0.35)' }} />
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
