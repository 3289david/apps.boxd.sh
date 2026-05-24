'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface InstallButtonProps {
  appId: string;
  appUrl: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'pill' | 'solid';
  className?: string;
}

export function InstallButton({
  appId,
  appUrl,
  size = 'md',
  variant = 'pill',
  className,
}: InstallButtonProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const library: string[] = JSON.parse(localStorage.getItem('boxd-library') ?? '[]');
      setSaved(library.includes(appId));
    } catch {}
  }, [appId]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved) {
      // Open the app
      window.open(appUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 380)); // micro-delay for feel

    try {
      const library: string[] = JSON.parse(localStorage.getItem('boxd-library') ?? '[]');
      if (!library.includes(appId)) library.push(appId);
      localStorage.setItem('boxd-library', JSON.stringify(library));
      setSaved(true);
    } catch {}

    setLoading(false);
    // Open the app after "installing"
    window.open(appUrl, '_blank', 'noopener,noreferrer');
  };

  const sizeCfg = {
    sm: { px: '12px 16px', fontSize: 12, height: 28 },
    md: { px: '14px 22px', fontSize: 13, height: 32 },
    lg: { px: '16px 28px', fontSize: 15, height: 40 },
  }[size];

  if (!mounted) {
    // Server render — show static "Get" button
    return (
      <button
        style={{
          padding: sizeCfg.px,
          fontSize: sizeCfg.fontSize,
          height: sizeCfg.height,
          borderRadius: 999,
          background: 'rgba(243,240,238,0.12)',
          color: '#F37338',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          border: 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          lineHeight: 1,
          fontFamily: 'inherit',
        }}
        className={cn('flex items-center justify-center', className)}
      >
        Get
      </button>
    );
  }

  if (variant === 'solid') {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={cn('press flex items-center justify-center gap-2 font-semibold transition-all', className)}
        style={{
          padding: sizeCfg.px,
          fontSize: sizeCfg.fontSize,
          height: sizeCfg.height,
          borderRadius: 999,
          background: saved ? 'rgba(243,240,238,0.1)' : '#F37338',
          color: saved ? '#F3F0EE' : '#0A0908',
          border: saved ? '1px solid rgba(243,240,238,0.2)' : 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          lineHeight: 1,
          fontFamily: 'inherit',
          letterSpacing: '-0.01em',
          opacity: loading ? 0.7 : 1,
          minWidth: 100,
        }}
      >
        {loading ? (
          <LoadingDots />
        ) : saved ? (
          'Open'
        ) : (
          'Get for free'
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn('press flex items-center justify-center font-semibold', className)}
      style={{
        padding: sizeCfg.px,
        fontSize: sizeCfg.fontSize,
        height: sizeCfg.height,
        borderRadius: 999,
        background: saved ? 'rgba(243,240,238,0.06)' : 'rgba(243,240,238,0.12)',
        color: saved ? '#9A928A' : '#F37338',
        border: saved ? '1px solid rgba(243,240,238,0.1)' : 'none',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        lineHeight: 1,
        fontFamily: 'inherit',
        letterSpacing: '-0.01em',
        opacity: loading ? 0.7 : 1,
        transition: 'all 0.2s ease',
      }}
    >
      {loading ? <LoadingDots /> : saved ? 'Open' : 'Get'}
    </button>
  );
}

function LoadingDots() {
  return (
    <span className="flex items-center gap-0.5">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'currentColor',
            display: 'block',
            animation: `bounce 0.9s ${i * 0.15}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </span>
  );
}
