'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#F37338' : 'none'} stroke={active ? '#F37338' : '#9A928A'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#F37338' : '#9A928A'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}

function SearchIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#F37338' : '#9A928A'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  );
}

function LibraryIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#F37338' : '#9A928A'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function UploadIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#F37338' : '#9A928A'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

const tabs = [
  { href: '/',        label: 'Home',     Icon: HomeIcon    },
  { href: '/browse',  label: 'Browse',   Icon: GridIcon    },
  { href: '/search',  label: 'Search',   Icon: SearchIcon  },
  { href: '/library', label: 'Library',  Icon: LibraryIcon },
  { href: '/submit',  label: 'Submit',   Icon: UploadIcon  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* spacer so content isn't hidden behind the nav */}
      <div style={{ height: 72 }} className="mobile-only-block" aria-hidden="true" />

      <div
        className="mobile-only-block"
        style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          zIndex: 50,
        }}
      >
        <div
          className="glass-nav"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            paddingTop: 8,
            paddingBottom: 'env(safe-area-inset-bottom, 8px)',
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          {tabs.map(({ href, label, Icon }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                  textDecoration: 'none',
                  padding: '4px 0',
                }}
              >
                <Icon active={active} />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: active ? 600 : 400,
                    color: active ? '#F37338' : '#9A928A',
                    letterSpacing: '0.01em',
                  }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) { .mobile-only-block { display: none !important; } }
        @media (max-width: 767px) { .mobile-only-block { display: block; } }
      `}</style>
    </>
  );
}
