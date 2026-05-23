'use client';

import { useState } from 'react';
import Link from 'next/link';
import IframeLoader from '@/components/IframeLoader';

type Tab = 'bronze' | 'prata';

const IFRAMES: Record<Tab, string> = {
  bronze: 'https://embed.letzplay.me/squadraverde/rankings/51588/table',
  prata:  'https://embed.letzplay.me/squadraverde/rankings/51976/table',
};

export default function FemininoPage() {
  const [tab, setTab] = useState<Tab>('bronze');

  return (
    <div className="theme-fem">
      <div className="page-head">
        <div className="page-head-inner">
          {/* Masculino / Feminino switcher */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 28 }}>
            {([
              { href: '/ranking',  label: 'Masculino', active: false },
              { href: '/feminino', label: 'Feminino',  active: true  },
            ] as const).map(t => (
              <Link
                key={t.href}
                href={t.href}
                style={{
                  padding: '8px 20px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  border: '1px solid',
                  borderColor: t.active ? 'var(--paper)' : 'color-mix(in oklch, var(--paper) 28%, transparent)',
                  background: t.active ? 'color-mix(in oklch, var(--paper) 16%, transparent)' : 'transparent',
                  color: t.active ? 'var(--paper)' : 'color-mix(in oklch, var(--paper) 50%, transparent)',
                  borderRadius: 2,
                  transition: 'all 0.15s',
                }}
              >
                {t.label}
              </Link>
            ))}
          </div>

          <p className="section-label" style={{ marginBottom: 12, color: 'var(--accent-2)' }}>Temporada 2026 · Feminino</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(54px, 12vw, 72px)', color: 'var(--paper)', letterSpacing: '-0.04em', textTransform: 'uppercase', marginBottom: 0, lineHeight: 0.95 }}>
            Classificação<br />Feminino
          </h1>
        </div>
      </div>

      <div className="page-body-inner">
        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
          {(['bronze', 'prata'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '10px 22px',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                border: '1px solid',
                borderColor: tab === t ? 'var(--ink)' : 'var(--line-soft)',
                background: tab === t ? 'var(--ink)' : 'transparent',
                color: tab === t ? 'var(--paper)' : 'color-mix(in oklch, var(--ink) 50%, transparent)',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {t === 'bronze' ? 'Bronze' : 'Prata'}
            </button>
          ))}
        </div>

        {/* Iframe */}
        <div style={{ border: '1px solid var(--line-soft)', borderRadius: 2, overflow: 'hidden' }}>
          <IframeLoader
            key={tab}
            src={IFRAMES[tab]}
            title={`Ranking Feminino ${tab === 'bronze' ? 'Bronze' : 'Prata'} — LetzPlay`}
          />
        </div>

        <p style={{ marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', color: 'color-mix(in oklch, var(--ink) 30%, transparent)', textAlign: 'right' }}>
          Dados fornecidos por LetzPlay
        </p>
      </div>
    </div>
  );
}
