'use client';

import { useState } from 'react';
import IframeLoader from '@/components/IframeLoader';

type Categoria = 'masculino' | 'bronze' | 'prata';

const IFRAMES: Record<Categoria, string> = {
  masculino: 'https://embed.letzplay.me/squadraverde/rankings/52366/matches',
  bronze:    'https://embed.letzplay.me/squadraverde/rankings/51588/matches',
  prata:     'https://embed.letzplay.me/squadraverde/rankings/51976/matches',
};

const TITLES: Record<Categoria, string> = {
  masculino: 'Jogos Masculino — LetzPlay',
  bronze:    'Jogos Feminino Bronze — LetzPlay',
  prata:     'Jogos Feminino Prata — LetzPlay',
};

export default function JogosPage() {
  const [cat, setCat] = useState<Categoria>('masculino');
  const isFem = cat !== 'masculino';

  const btnStyle = (active: boolean, fem = false) => ({
    padding: '8px 20px',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    border: '1px solid',
    borderColor: active
      ? 'var(--paper)'
      : 'color-mix(in oklch, var(--paper) 28%, transparent)',
    background: active
      ? 'color-mix(in oklch, var(--paper) 16%, transparent)'
      : 'transparent',
    color: active
      ? 'var(--paper)'
      : 'color-mix(in oklch, var(--paper) 50%, transparent)',
    borderRadius: 2,
    cursor: 'pointer',
    transition: 'all 0.15s',
  });

  const subBtnStyle = (active: boolean) => ({
    padding: '10px 22px',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    border: '1px solid',
    borderColor: active ? 'var(--ink)' : 'var(--line-soft)',
    background: active ? 'var(--ink)' : 'transparent',
    color: active
      ? 'var(--paper)'
      : 'color-mix(in oklch, var(--ink) 50%, transparent)',
    borderRadius: 2,
    cursor: 'pointer',
    transition: 'all 0.15s',
  });

  const heading = cat === 'masculino' ? 'Masculino' : cat === 'bronze' ? 'Bronze' : 'Prata';

  return (
    <div className={isFem ? 'theme-fem' : undefined}>
      <div className="page-head">
        <div className="page-head-inner">
          <div style={{ display: 'flex', gap: 4, marginBottom: 28, flexWrap: 'wrap' }}>
            <button style={btnStyle(cat === 'masculino')} onClick={() => setCat('masculino')}>
              Masculino
            </button>
            <button style={btnStyle(isFem)} onClick={() => setCat(cat === 'masculino' ? 'bronze' : cat)}>
              Feminino
            </button>
          </div>

          <p className="section-label" style={{ marginBottom: 12, color: isFem ? 'var(--accent-2)' : 'var(--verde-glow)' }}>
            Temporada 2026{isFem ? ' · Feminino' : ''}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(54px, 12vw, 72px)', color: 'var(--paper)', letterSpacing: '-0.04em', textTransform: 'uppercase', marginBottom: 0, lineHeight: 0.95 }}>
            Jogos<br />{heading}
          </h1>
        </div>
      </div>

      <div className="page-body-inner">
        {isFem && (
          <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
            <button style={subBtnStyle(cat === 'bronze')} onClick={() => setCat('bronze')}>Bronze</button>
            <button style={subBtnStyle(cat === 'prata')} onClick={() => setCat('prata')}>Prata</button>
          </div>
        )}

        <div style={{ border: '1px solid var(--line-soft)', borderRadius: 2, overflow: 'hidden' }}>
          <IframeLoader key={cat} src={IFRAMES[cat]} title={TITLES[cat]} />
        </div>

        <p style={{ marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', color: 'color-mix(in oklch, var(--ink) 30%, transparent)', textAlign: 'right' }}>
          Dados fornecidos por LetzPlay
        </p>
      </div>
    </div>
  );
}
