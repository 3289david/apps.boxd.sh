import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navigation } from '@/components/Navigation';
import { BottomNav } from '@/components/BottomNav';

export const metadata: Metadata = {
  title: {
    default:  'apps.boxd.sh — App Store for Web Apps',
    template: '%s · apps.boxd.sh',
  },
  description:
    'Discover, try, and install the best progressive web apps. No download required — open instantly in your browser.',
  keywords: ['web apps', 'pwa', 'app store', 'progressive web apps', 'install'],
  authors: [{ name: 'boxd.sh' }],
  manifest: '/manifest.json',
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         'https://apps.boxd.sh',
    title:       'apps.boxd.sh — App Store for Web Apps',
    description: 'Discover, try, and install the best progressive web apps.',
    siteName:    'apps.boxd.sh',
  },
  twitter: {
    card:  'summary_large_image',
    title: 'apps.boxd.sh — App Store for Web Apps',
  },
  // icons are auto-generated from app/icon.tsx and app/apple-icon.tsx
};

export const viewport: Viewport = {
  themeColor:     '#0A0908',
  width:          'device-width',
  initialScale:   1,
  maximumScale:   1,
  userScalable:   false,
  viewportFit:    'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ background: '#0A0908' }}>
      <body style={{ margin: 0, minHeight: '100vh' }}>
        <Providers>
          <Navigation />
          {/* Desktop top padding for the floating nav */}
          <div className="desktop-spacer" aria-hidden="true" />
          <main>{children}</main>
          <BottomNav />
          {/* Footer */}
          <footer
            style={{
              padding: '40px 24px 80px',
              borderTop: '1px solid rgba(243,240,238,0.06)',
              marginTop: 24,
            }}
          >
            <div
              style={{
                maxWidth: 980,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
              }}
            >
              {/* Brand mark */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <rect width="22" height="22" rx="5" fill="#F37338"/>
                  <rect x="4"  y="4"  width="6" height="6" rx="1.5" fill="#0A0908"/>
                  <rect x="12" y="4"  width="6" height="6" rx="1.5" fill="#0A0908"/>
                  <rect x="4"  y="12" width="6" height="6" rx="1.5" fill="#0A0908"/>
                  <rect x="12" y="12" width="6" height="6" rx="1.5" fill="#0A0908" opacity="0.35"/>
                </svg>
                <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.025em' }}>
                  <span style={{ color: '#F3F0EE' }}>apps.</span>
                  <span style={{ color: '#F37338' }}>boxd</span>
                  <span style={{ color: 'rgba(243,240,238,0.3)' }}>.sh</span>
                </span>
              </div>

              <p style={{ fontSize: 13, color: '#504840', letterSpacing: '-0.01em', textAlign: 'center', margin: 0 }}>
                &copy; {new Date().getFullYear()} apps.boxd.sh &nbsp;·&nbsp;
                <a href="/submit" style={{ color: '#F37338', textDecoration: 'none' }}>Submit an App</a>
                &nbsp;·&nbsp;
                <a href="mailto:hello@boxd.sh" style={{ color: '#504840', textDecoration: 'none' }}>Contact</a>
              </p>
            </div>
          </footer>
        </Providers>

        <style>{`
          @media (min-width: 768px) { .desktop-spacer { height: 88px; } }
          @media (max-width: 767px) { .desktop-spacer { height: 56px; } }
        `}</style>
      </body>
    </html>
  );
}
