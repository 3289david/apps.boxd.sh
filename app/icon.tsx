import { ImageResponse } from 'next/og';

export const size        = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: '#F37338',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          padding: 6,
        }}
      >
        {/* Row 1 */}
        <div style={{ display: 'flex', gap: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: '#0A0908' }} />
          <div style={{ width: 8, height: 8, borderRadius: 2, background: '#0A0908' }} />
        </div>
        {/* Row 2 */}
        <div style={{ display: 'flex', gap: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: '#0A0908' }} />
          <div style={{ width: 8, height: 8, borderRadius: 2, background: 'rgba(10,9,8,0.35)' }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
