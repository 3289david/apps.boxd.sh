'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apps } from '@/lib/data';
import { AppCard } from '@/components/AppCard';

function BookmarkIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
    </svg>
  );
}

export default function LibraryPage() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const ids: string[] = JSON.parse(localStorage.getItem('boxd-library') ?? '[]');
      setSavedIds(ids);
    } catch {}
  }, []);

  const savedApps = apps.filter(a => savedIds.includes(a.id));

  const removeApp = (id: string) => {
    const next = savedIds.filter(s => s !== id);
    setSavedIds(next);
    localStorage.setItem('boxd-library', JSON.stringify(next));
  };

  if (!mounted) return null;

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 16px 60px' }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#F3F0EE', letterSpacing: '-0.03em' }}>
          My Library
        </h1>
        <p style={{ fontSize: 15, color: '#9A928A', marginTop: 8 }}>
          {savedApps.length} saved app{savedApps.length !== 1 ? 's' : ''}
        </p>
      </div>

      {savedApps.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ color: '#504840', marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
            <BookmarkIcon />
          </div>
          <p style={{ fontSize: 18, fontWeight: 600, color: '#9A928A', marginBottom: 8 }}>
            No saved apps yet
          </p>
          <p style={{ fontSize: 14, color: '#504840', marginBottom: 28 }}>
            Tap Get on any app to add it to your library
          </p>
          <Link
            href="/"
            style={{
              padding: '12px 28px', borderRadius: 999,
              background: '#F37338', color: '#0A0908',
              fontSize: 15, fontWeight: 700, textDecoration: 'none',
            }}
          >
            Discover Apps
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 16,
          }}
        >
          {savedApps.map(app => (
            <AppCard key={app.id} app={app} variant="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
