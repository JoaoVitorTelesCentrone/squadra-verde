'use client';

import { useState, useEffect } from 'react';

interface Props {
  src: string;
  title: string;
}

export default function IframeLoader({ src, title }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: 600, height: 'clamp(600px, 75vh, 900px)' }}>
      {!visible && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            background: 'var(--sand)',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '3px solid color-mix(in oklch, var(--ink) 12%, transparent)',
              borderTopColor: 'var(--verde-glow)',
              animation: 'spin 0.7s linear infinite',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'color-mix(in oklch, var(--ink) 35%, transparent)',
            }}
          >
            Carregando
          </span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      <iframe
        src={src}
        title={title}
        width="100%"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          border: 'none',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}
