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
  icons: {
    icon:  '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
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
          <footer style={{ padding: '48px 24px 80px', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#504840', letterSpacing: '-0.01em' }}>
              &copy; {new Date().getFullYear()} apps.boxd.sh &nbsp;·&nbsp;
              <a href="/submit" style={{ color: '#F37338', textDecoration: 'none' }}>Submit an App</a>
              &nbsp;·&nbsp;
              <a href="mailto:hello@boxd.sh" style={{ color: '#504840', textDecoration: 'none' }}>Contact</a>
            </p>
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
