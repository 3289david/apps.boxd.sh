import { ImageResponse } from 'next/og';

export const dynamic     = 'force-static';
export const contentType = 'image/png';

const SIZE = 1024;

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: 220,
          background: '#F37338',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 56,
          padding: 188,
        }}
      >
        {/* Row 1 */}
        <div style={{ display: 'flex', gap: 56 }}>
          <div style={{ width: 296, height: 296, borderRadius: 56, background: '#0A0908' }} />
          <div style={{ width: 296, height: 296, borderRadius: 56, background: '#0A0908' }} />
        </div>
        {/* Row 2 */}
        <div style={{ display: 'flex', gap: 56 }}>
          <div style={{ width: 296, height: 296, borderRadius: 56, background: '#0A0908' }} />
          <div style={{ width: 296, height: 296, borderRadius: 56, background: 'rgba(10,9,8,0.35)' }} />
        </div>
      </div>
    ),
    { width: SIZE, height: SIZE },
  );
}
