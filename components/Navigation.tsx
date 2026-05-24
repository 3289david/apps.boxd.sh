'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

// ── SVG Icons ────────────────────────────────────────────────────────────────

function SearchIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  );
}

function BoxdLogo() {
  return (
    <svg width="80" height="22" viewBox="0 0 80 22" fill="none">
      {/* apps.boxd */}
      <text x="0" y="17" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="15" letterSpacing="-0.03em" fill="#F3F0EE">
        apps.
      </text>
      <text x="38" y="17" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="15" letterSpacing="-0.03em" fill="#F37338">
        boxd
      </text>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

// ── Nav links ─────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: '/',                   label: 'Home'         },
  { href: '/category/ai',        label: 'AI'           },
  { href: '/category/developer', label: 'Developer'    },
  { href: '/category/productivity',label:'Productivity' },
  { href: '/submit',             label: 'Submit App'   },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* ── Desktop nav — floating pill ──────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          width: 'calc(100% - 48px)',
          maxWidth: 960,
          display: 'none', // shown via media query override below
        }}
        className="desktop-nav"
      >
        <nav
          className="glass-nav"
          style={{
            borderRadius: 999,
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: scrolled
              ? '0 8px 32px 0 rgba(0,0,0,0.5)'
              : '0 4px 24px 0 rgba(0,0,0,0.4)',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', marginRight: 8, flexShrink: 0 }}>
            <BoxdLogo />
          </Link>

          {/* Links */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            {NAV_LINKS.map(link => {
              const active = link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: 14,
                    fontWeight: active ? 600 : 400,
                    color: active ? '#F3F0EE' : '#9A928A',
                    textDecoration: 'none',
                    padding: '6px 12px',
                    borderRadius: 999,
                    background: active ? 'rgba(243,240,238,0.08)' : 'transparent',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right: Search + Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {searchOpen ? (
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search apps..."
                  style={{
                    background: 'rgba(243,240,238,0.06)',
                    border: '1px solid rgba(243,240,238,0.12)',
                    borderRadius: 999,
                    padding: '6px 16px',
                    fontSize: 14,
                    color: '#F3F0EE',
                    outline: 'none',
                    width: 200,
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#9A928A',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CloseIcon />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(243,240,238,0.06)',
                  border: 'none',
                  color: '#9A928A',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s ease',
                }}
              >
                <SearchIcon size={16} />
              </button>
            )}

            {session ? (
              <button
                onClick={() => signOut()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(243,240,238,0.06)',
                  border: 'none',
                  borderRadius: 999,
                  padding: '6px 12px 6px 6px',
                  cursor: 'pointer',
                  color: '#9A928A',
                  fontSize: 13,
                  fontFamily: 'inherit',
                }}
              >
                {session.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt="avatar"
                    width={24}
                    height={24}
                    style={{ borderRadius: '50%' }}
                  />
                ) : (
                  <div
                    style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: '#F37338', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: '#0A0908',
                    }}
                  >
                    {session.user?.name?.[0] ?? '?'}
                  </div>
                )}
                Sign out
              </button>
            ) : (
              <button
                onClick={() => signIn('github')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#F3F0EE',
                  border: 'none',
                  borderRadius: 999,
                  padding: '7px 16px',
                  cursor: 'pointer',
                  color: '#0A0908',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  letterSpacing: '-0.01em',
                }}
              >
                <GithubIcon size={15} />
                Sign in
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* ── Mobile nav ───────────────────────────────────────────────────── */}
      <div className="mobile-nav" style={{ display: 'none' }}>
        <div
          className="glass-nav"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0,
            zIndex: 50,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none' }}>
            <BoxdLogo />
          </Link>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link
              href="/search"
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(243,240,238,0.06)', border: 'none',
                color: '#9A928A', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              <SearchIcon size={16} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(243,240,238,0.06)', border: 'none',
                color: '#9A928A', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-over menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(10,9,8,0.85)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              position: 'absolute', top: 0, right: 0, bottom: 0,
              width: '80%', maxWidth: 320,
              background: '#1E1B18',
              borderLeft: '1px solid rgba(243,240,238,0.08)',
              padding: '24px',
              display: 'flex', flexDirection: 'column',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32 }}>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'none', border: 'none', color: '#9A928A', cursor: 'pointer' }}
              >
                <CloseIcon />
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: pathname === link.href ? '#F37338' : '#F3F0EE',
                    textDecoration: 'none',
                    padding: '12px 0',
                    letterSpacing: '-0.02em',
                    borderBottom: '1px solid rgba(243,240,238,0.06)',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: 24 }}>
              {session ? (
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  style={{
                    width: '100%', padding: '12px', borderRadius: 12,
                    background: 'rgba(243,240,238,0.06)',
                    border: '1px solid rgba(243,240,238,0.1)',
                    color: '#9A928A', fontSize: 15, cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Sign out ({session.user?.name})
                </button>
              ) : (
                <button
                  onClick={() => signIn('github')}
                  style={{
                    width: '100%', padding: '12px', borderRadius: 12,
                    background: '#F3F0EE', border: 'none',
                    color: '#0A0908', fontSize: 15, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 8,
                  }}
                >
                  <GithubIcon size={17} />
                  Sign in with GitHub
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Responsive overrides */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: block !important; }
          .mobile-nav  { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-nav  { display: block !important; }
        }
      `}</style>
    </>
  );
}
