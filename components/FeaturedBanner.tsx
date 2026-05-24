'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AppIcon } from './AppIcon';
import { InstallButton } from './InstallButton';
import { Badge } from './Badge';
import type { App } from '@/lib/data';

interface FeaturedBannerProps {
  apps: App[];
}

export function FeaturedBanner({ apps }: FeaturedBannerProps) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (idx === current || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 200);
  }, [current, animating]);

  // Auto-advance every 6s
  useEffect(() => {
    const timer = setInterval(() => {
      const next = (current + 1) % apps.length;
      goTo(next);
    }, 6000);
    return () => clearInterval(timer);
  }, [current, apps.length, goTo]);

  const app = apps[current];

  return (
    <div style={{ padding: '0 16px', marginBottom: 40 }}>
      {/* Container */}
      <div
        style={{
          borderRadius: 40,
          overflow: 'hidden',
          position: 'relative',
          background: '#131210',
          border: '1px solid rgba(243,240,238,0.08)',
          boxShadow: '0 24px 64px 0 rgba(0,0,0,0.6)',
          minHeight: 340,
        }}
      >
        {/* Gradient accent — from app accent color */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 80% 60% at 80% 20%, ${app.accentColor}20, transparent 70%)`,
            transition: 'background 0.6s ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 60% 50% at 10% 90%, ${app.accentColor}10, transparent 60%)`,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '40px 40px 36px',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: 340,
            transition: 'opacity 0.2s ease',
            opacity: animating ? 0 : 1,
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#F37338',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#F37338',
              }}
            />
            Featured App
          </p>

          {/* Icon + Name row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
            <AppIcon gradient={app.iconGradient} name={app.name} size="xl" />
            <div>
              <h2
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: '#F3F0EE',
                  lineHeight: 1.1,
                  marginBottom: 8,
                }}
              >
                {app.name}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {app.isOfflineReady && <Badge variant="offline" />}
                {app.isPWA && <Badge variant="pwa" />}
                {app.isTrending && <Badge variant="trending" />}
              </div>
            </div>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontSize: 16,
              color: '#9A928A',
              lineHeight: 1.55,
              flex: 1,
              maxWidth: 500,
              marginBottom: 28,
            }}
          >
            {app.tagline}
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <InstallButton appId={app.id} appUrl={app.url} size="lg" variant="solid" />
            <Link
              href={`/apps/${app.id}`}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#9A928A',
                textDecoration: 'none',
                padding: '0 4px',
              }}
            >
              Learn more
            </Link>
          </div>

          {/* Developer info */}
          <p style={{ fontSize: 12, color: '#504840', marginTop: 16 }}>
            By {app.developer} &nbsp;·&nbsp; {app.size}
          </p>
        </div>

        {/* Pagination dots */}
        {apps.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              right: 28,
              display: 'flex',
              gap: 6,
              zIndex: 2,
            }}
          >
            {apps.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === current ? 20 : 6,
                  height: 6,
                  borderRadius: 999,
                  background: i === current ? '#F37338' : 'rgba(243,240,238,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'width 0.3s ease, background 0.3s ease',
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
