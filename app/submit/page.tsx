'use client';

import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';

function GithubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function CheckIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5L20 7"/>
    </svg>
  );
}

const requirements = [
  { label: 'Mobile optimized',       desc: 'Responsive design that works on phones' },
  { label: 'HTTPS required',         desc: 'App must be served over a secure connection' },
  { label: 'Fast loading',           desc: 'Under 3 seconds on a typical connection' },
  { label: 'No intrusive ads',       desc: 'Clean experience without popups' },
  { label: 'App must be reachable',  desc: 'URL is verified live before listing' },
];

function InputField({
  label, id, type = 'text', placeholder, required = false,
  value, onChange, hint, maxLength,
}: {
  label: string; id: string; type?: string; placeholder: string;
  required?: boolean; value: string; onChange: (v: string) => void;
  hint?: string; maxLength?: number;
}) {
  return (
    <div>
      <label htmlFor={id} style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#9A928A', letterSpacing: '-0.01em', marginBottom: 6 }}>
        {label} {required && <span style={{ color: '#F37338' }}>*</span>}
      </label>
      {hint && <p style={{ fontSize: 12, color: '#504840', marginBottom: 8 }}>{hint}</p>}
      {type === 'textarea' ? (
        <textarea
          id={id} required={required} placeholder={placeholder}
          value={value} onChange={e => onChange(e.target.value)}
          maxLength={maxLength} rows={3}
          style={{
            width: '100%', padding: '12px 16px', borderRadius: 12,
            background: 'rgba(243,240,238,0.04)', border: '1px solid rgba(243,240,238,0.1)',
            color: '#F3F0EE', fontSize: 15, fontFamily: 'inherit',
            resize: 'vertical', outline: 'none', lineHeight: 1.5, boxSizing: 'border-box',
          }}
        />
      ) : (
        <input
          id={id} type={type} required={required} placeholder={placeholder}
          value={value} onChange={e => onChange(e.target.value)}
          maxLength={maxLength}
          style={{
            width: '100%', padding: '12px 16px', borderRadius: 12,
            background: 'rgba(243,240,238,0.04)', border: '1px solid rgba(243,240,238,0.1)',
            color: '#F3F0EE', fontSize: 15, fontFamily: 'inherit',
            outline: 'none', boxSizing: 'border-box',
          }}
        />
      )}
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }: {
  label: string; desc: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px', borderRadius: 12, textAlign: 'left', width: '100%',
        background: checked ? 'rgba(243,115,56,0.08)' : 'rgba(243,240,238,0.03)',
        border: `1px solid ${checked ? 'rgba(243,115,56,0.3)' : 'rgba(243,240,238,0.08)'}`,
        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease',
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: 6, flexShrink: 0,
        background: checked ? '#F37338' : 'rgba(243,240,238,0.1)',
        border: `1.5px solid ${checked ? '#F37338' : 'rgba(243,240,238,0.2)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s ease',
      }}>
        {checked && <CheckIcon size={12} />}
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#F3F0EE', letterSpacing: '-0.01em' }}>{label}</p>
        <p style={{ fontSize: 12, color: '#9A928A', marginTop: 2 }}>{desc}</p>
      </div>
    </button>
  );
}

const INITIAL_FORM = {
  name: '', tagline: '', description: '', url: '',
  category: '', developer: '', developerUrl: '',
  size: '', tags: '', isOfflineReady: false, isPWA: false,
};

export default function SubmitPage() {
  const { data: session, status } = useSession();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedId, setSubmittedId] = useState('');
  const [form, setForm] = useState(INITIAL_FORM);

  const field = (key: keyof typeof form) => ({
    value: form[key] as string,
    onChange: (v: string) => setForm(prev => ({ ...prev, [key]: v })),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Submission failed');
        setSubmitting(false);
        return;
      }
      setSubmittedId(data.id);
      setSubmitted(true);
    } catch {
      setError('Network error — please try again');
    }
    setSubmitting(false);
  };

  if (status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(243,240,238,0.1)', borderTopColor: '#F37338', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px 60px' }}>
        <div style={{ background: '#131210', borderRadius: 32, border: '1px solid rgba(243,240,238,0.06)', padding: '48px 40px', textAlign: 'center', marginTop: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #F37338, #CF4500)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#F3F0EE', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 12 }}>Submit Your App</h1>
          <p style={{ fontSize: 15, color: '#9A928A', lineHeight: 1.6, marginBottom: 32 }}>Sign in with GitHub to submit your web app. Apps are listed instantly after passing security checks.</p>
          <button
            onClick={() => signIn('github')}
            style={{ width: '100%', padding: '14px', borderRadius: 999, background: '#F3F0EE', border: 'none', color: '#0A0908', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, letterSpacing: '-0.01em' }}
          >
            <GithubIcon size={18} /> Continue with GitHub
          </button>
          <p style={{ fontSize: 12, color: '#504840', marginTop: 16 }}>We only use your GitHub profile to identify submissions.</p>
        </div>
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#9A928A', letterSpacing: '-0.02em', marginBottom: 16 }}>Submission requirements</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {requirements.map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', borderRadius: 14, background: '#131210', border: '1px solid rgba(243,240,238,0.06)' }}>
                <span style={{ color: '#22C55E', flexShrink: 0, marginTop: 1 }}><CheckIcon /></span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#F3F0EE', letterSpacing: '-0.01em' }}>{r.label}</p>
                  <p style={{ fontSize: 12, color: '#9A928A', marginTop: 2 }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px 60px' }}>
        <div style={{ background: '#131210', borderRadius: 32, border: '1px solid rgba(243,240,238,0.06)', padding: '48px 40px', textAlign: 'center', marginTop: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <span style={{ color: '#22C55E' }}><CheckIcon /></span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#F3F0EE', letterSpacing: '-0.03em', marginBottom: 12 }}>App Listed!</h1>
          <p style={{ fontSize: 15, color: '#9A928A', lineHeight: 1.6, marginBottom: 8 }}>
            Your app passed all security checks and is now live in the store.
          </p>
          {submittedId && (
            <a
              href={`/apps/${submittedId}`}
              style={{ display: 'inline-block', marginBottom: 28, fontSize: 14, color: '#F37338', textDecoration: 'none', fontWeight: 500 }}
            >
              View your listing →
            </a>
          )}
          <button
            onClick={() => { setSubmitted(false); setSubmittedId(''); setForm(INITIAL_FORM); }}
            style={{ padding: '12px 28px', borderRadius: 999, background: 'rgba(243,240,238,0.08)', border: '1px solid rgba(243,240,238,0.1)', color: '#F3F0EE', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Submit another app
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 16px 60px' }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#F37338', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#F37338' }} />
          For Developers
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#F3F0EE', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 8 }}>Submit Your App</h1>
        <p style={{ fontSize: 15, color: '#9A928A' }}>
          Signed in as <strong style={{ color: '#F3F0EE' }}>{session.user?.name}</strong>
          {' · '}Apps are listed instantly after passing checks.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── Core Info ── */}
        <div style={{ background: '#131210', borderRadius: 24, border: '1px solid rgba(243,240,238,0.06)', padding: '28px', display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#504840' }}>App Info</p>

          <InputField label="App Name" id="name" placeholder="e.g. Excalidraw" required maxLength={100} {...field('name')} />

          <InputField
            label="Tagline" id="tagline" placeholder="One-line pitch, e.g. 'Virtual whiteboard with a hand-drawn feel'"
            required maxLength={100} hint="Max 100 characters — shown in cards and search results."
            {...field('tagline')}
          />

          <InputField
            label="Description" id="description" type="textarea"
            placeholder="Describe what your app does, who it's for, and what makes it great. (20–1000 chars)"
            required maxLength={1000} hint="Shown on the app detail page."
            {...field('description')}
          />

          <InputField label="App URL" id="url" type="url" placeholder="https://yourapp.com" required {...field('url')} />

          <div>
            <label htmlFor="category" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#9A928A', marginBottom: 6 }}>
              Category <span style={{ color: '#F37338' }}>*</span>
            </label>
            <select
              id="category" required value={form.category}
              onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(243,240,238,0.04)', border: '1px solid rgba(243,240,238,0.1)', color: form.category ? '#F3F0EE' : '#504840', fontSize: 15, fontFamily: 'inherit', outline: 'none', appearance: 'none', boxSizing: 'border-box' }}
            >
              <option value="" disabled style={{ background: '#131210' }}>Select a category</option>
              <option value="ai"            style={{ background: '#131210' }}>AI</option>
              <option value="productivity"  style={{ background: '#131210' }}>Productivity</option>
              <option value="developer"     style={{ background: '#131210' }}>Developer</option>
              <option value="design"        style={{ background: '#131210' }}>Design</option>
              <option value="student"       style={{ background: '#131210' }}>Student</option>
              <option value="utilities"     style={{ background: '#131210' }}>Utilities</option>
              <option value="communication" style={{ background: '#131210' }}>Communication</option>
              <option value="media"         style={{ background: '#131210' }}>Media</option>
            </select>
          </div>
        </div>

        {/* ── Developer Info ── */}
        <div style={{ background: '#131210', borderRadius: 24, border: '1px solid rgba(243,240,238,0.06)', padding: '28px', display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#504840' }}>Developer</p>
          <InputField label="Developer / Studio Name" id="developer" placeholder="Your name or company" required maxLength={100} {...field('developer')} />
          <InputField label="Developer Website (optional)" id="developerUrl" type="url" placeholder="https://yoursite.com" {...field('developerUrl')} />
        </div>

        {/* ── App Details ── */}
        <div style={{ background: '#131210', borderRadius: 24, border: '1px solid rgba(243,240,238,0.06)', padding: '28px', display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#504840' }}>Details</p>

          <InputField
            label="Approximate Size (optional)" id="size"
            placeholder="e.g. < 2 MB" hint="Displayed on the app detail page."
            {...field('size')}
          />

          <InputField
            label="Tags (optional)" id="tags"
            placeholder="e.g. whiteboard, collaboration, offline"
            hint="Comma-separated keywords. Helps with search."
            {...field('tags')}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#9A928A', marginBottom: 2 }}>App Capabilities</p>
            <Toggle
              label="Works Offline"
              desc="App functions without an internet connection"
              checked={form.isOfflineReady}
              onChange={v => setForm(p => ({ ...p, isOfflineReady: v }))}
            />
            <Toggle
              label="Installable (PWA)"
              desc="Has a web manifest and can be installed to home screen"
              checked={form.isPWA}
              onChange={v => setForm(p => ({ ...p, isPWA: v }))}
            />
          </div>
        </div>

        {/* ── Security notice ── */}
        <div style={{ background: 'rgba(34,197,94,0.05)', borderRadius: 16, border: '1px solid rgba(34,197,94,0.15)', padding: '16px 20px', marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#22C55E', marginBottom: 8 }}>Automatic checks run on submission:</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {['HTTPS verified', 'URL reachability tested live', 'Duplicate detection', 'Spam & injection filtering', 'Rate limiting (5/day per account)'].map(s => (
              <li key={s} style={{ fontSize: 13, color: '#9A928A', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ color: '#22C55E' }}><CheckIcon size={12} /></span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
            <p style={{ fontSize: 14, color: '#F87171', fontWeight: 500 }}>{error}</p>
          </div>
        )}

        <button
          type="submit" disabled={submitting}
          style={{ width: '100%', padding: '16px', borderRadius: 999, background: submitting ? 'rgba(243,240,238,0.1)' : '#F37338', border: 'none', color: submitting ? '#9A928A' : '#0A0908', fontSize: 16, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', letterSpacing: '-0.01em', transition: 'all 0.2s ease' }}
        >
          {submitting ? 'Running security checks…' : 'Submit App'}
        </button>
      </form>
    </div>
  );
}
