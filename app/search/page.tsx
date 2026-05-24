'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AppCard } from '@/components/AppCard';
import { searchApps } from '@/lib/data';

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
  const [results, setResults] = useState(() => searchApps(initialQ));

  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    setQuery(q);
    setResults(searchApps(q));
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 16px 60px' }}>

      {/* Search input */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 40 }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: '#131210',
            border: '1px solid rgba(243,240,238,0.1)',
            borderRadius: 999,
            padding: '12px 20px',
          }}
        >
          <span style={{ color: '#504840', flexShrink: 0 }}><SearchIcon /></span>
          <input
            autoFocus
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setResults(searchApps(e.target.value));
            }}
            placeholder="Search apps, categories, developers..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: 16, color: '#F3F0EE', fontFamily: 'inherit',
              letterSpacing: '-0.01em',
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setResults([]); }}
              style={{
                background: 'none', border: 'none', color: '#504840',
                cursor: 'pointer', padding: 0, display: 'flex',
                alignItems: 'center', fontSize: 18,
              }}
            >
              ×
            </button>
          )}
        </div>
      </form>

      {/* Results */}
      {query && (
        <p style={{ fontSize: 13, color: '#504840', marginBottom: 24 }}>
          {results.length > 0
            ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
            : `No results for "${query}"`}
        </p>
      )}

      {results.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 16,
          }}
        >
          {results.map(app => (
            <AppCard key={app.id} app={app} variant="grid" />
          ))}
        </div>
      ) : query ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontSize: 16, color: '#9A928A', marginBottom: 8 }}>No apps found</p>
          <p style={{ fontSize: 14, color: '#504840' }}>Try a different search term</p>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ fontSize: 16, color: '#9A928A' }}>Start typing to search apps...</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '0 16px 32px' }}>
        <h1
          style={{
            fontSize: 28, fontWeight: 700, color: '#F3F0EE',
            letterSpacing: '-0.03em', marginBottom: 4,
          }}
        >
          Search
        </h1>
        <p style={{ fontSize: 14, color: '#9A928A' }}>
          Find the perfect web app
        </p>
      </div>
      <Suspense
        fallback={
          <div style={{ textAlign: 'center', padding: '40px', color: '#504840' }}>Loading...</div>
        }
      >
        <SearchContent />
      </Suspense>
    </div>
  );
}
