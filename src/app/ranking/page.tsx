'use client';

import Link from 'next/link';
import IframeLoader from '@/components/IframeLoader';

export default function RankingPage() {
  return (
    <div>
      <div className="page-head">
        <div className="page-head-inner">
          <div style={{ display: 'flex', gap: 4, marginBottom: 28, flexWrap: 'wrap' }}>
            {([
              { href: '/ranking',  label: 'Masculino', active: true  },
              { href: '/feminino', label: 'Feminino',  active: false },
            ] as const).map(tab => (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  padding: '8px 20px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  border: '1px solid',
                  borderColor: tab.active ? 'var(--paper)' : 'color-mix(in oklch, var(--paper) 28%, transparent)',
                  background: tab.active ? 'color-mix(in oklch, var(--paper) 16%, transparent)' : 'transparent',
                  color: tab.active ? 'var(--paper)' : 'color-mix(in oklch, var(--paper) 50%, transparent)',
                  borderRadius: 2,
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <p className="section-label" style={{ marginBottom: 12, color: 'var(--verde-glow)' }}>Temporada 2026</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(54px, 12vw, 72px)', color: 'var(--paper)', letterSpacing: '-0.04em', textTransform: 'uppercase', marginBottom: 0, lineHeight: 0.95 }}>
            Classificação<br />Geral
          </h1>
        </div>
      </div>

      <div className="page-body-inner">
        <div style={{ border: '1px solid var(--line-soft)', borderRadius: 2, overflow: 'hidden' }}>
          <IframeLoader
            src="https://embed.letzplay.me/squadraverde/rankings/52366/table"
            title="Ranking Squadra Verde — LetzPlay"
          />
        </div>

        <p style={{ marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', color: 'color-mix(in oklch, var(--ink) 30%, transparent)', textAlign: 'right' }}>
          Dados fornecidos por LetzPlay
        </p>
      </div>
    </div>
  );
}
