'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AppCard } from '@/components/AppCard';
import type { App } from '@/lib/data';

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<App[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    setQuery(q);
    fetchResults(q);
  }, [searchParams, fetchResults]);

  const handleInput = (val: string) => {
    setQuery(val);
    fetchResults(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 16px 60px' }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#131210', border: '1px solid rgba(243,240,238,0.1)', borderRadius: 999, padding: '12px 20px' }}>
          <span style={{ color: '#504840', flexShrink: 0 }}><SearchIcon /></span>
          <input
            autoFocus value={query}
            onChange={e => handleInput(e.target.value)}
            placeholder="Search apps, categories, developers..."
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 16, color: '#F3F0EE', fontFamily: 'inherit', letterSpacing: '-0.01em' }}
          />
          {query && (
            <button type="button" onClick={() => handleInput('')}
              style={{ background: 'none', border: 'none', color: '#504840', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', fontSize: 18 }}>
              ×
            </button>
          )}
        </div>
      </form>

      {query && !loading && (
        <p style={{ fontSize: 13, color: '#504840', marginBottom: 24 }}>
          {results.length > 0 ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"` : `No results for "${query}"`}
        </p>
      )}

      {results.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {results.map(app => <AppCard key={app.id} app={app} variant="grid" />)}
        </div>
      ) : query && !loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontSize: 16, color: '#9A928A', marginBottom: 8 }}>No apps found</p>
          <p style={{ fontSize: 14, color: '#504840' }}>Try a different search term</p>
        </div>
      ) : !query ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ fontSize: 16, color: '#9A928A' }}>Start typing to search apps...</p>
        </div>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '0 16px 32px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#F3F0EE', letterSpacing: '-0.03em', marginBottom: 4 }}>Search</h1>
        <p style={{ fontSize: 14, color: '#9A928A' }}>Find the perfect web app</p>
      </div>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px', color: '#504840' }}>Loading...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
