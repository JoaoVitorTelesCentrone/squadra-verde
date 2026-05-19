'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Tab = { label: string; href: string; sub?: string };

interface SectionTabsProps {
  tabs: Tab[];
  section: string;
}

export default function SectionTabs({ tabs, section }: SectionTabsProps) {
  const pathname = usePathname();

  return (
    <div style={{ background: 'var(--verde-escuro)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--verde-medio)', whiteSpace: 'nowrap', paddingRight: 24, borderRight: '1px solid rgba(255,255,255,0.1)', marginRight: 24 }}>
          {section}
        </span>
        {tabs.map(tab => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '18px 28px',
                textDecoration: 'none',
                borderBottom: active ? '3px solid var(--amarelo)' : '3px solid transparent',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.15s',
                flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, letterSpacing: '0.15em', textTransform: 'uppercase', color: active ? 'var(--creme)' : 'rgba(245,239,230,0.4)', fontWeight: active ? 500 : 400, transition: 'color 0.15s' }}>
                {tab.label}
              </span>
              {tab.sub && (
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: active ? 'var(--amarelo)' : 'rgba(245,239,230,0.2)', marginTop: 3 }}>
                  {tab.sub}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ── Tab configs ─────────────────────────────────────────────────────────────── */
export const RANKING_TABS: Tab[] = [
  { label: 'Masculino', href: '/ranking',  sub: 'Temporada 2026' },
  { label: 'Feminino',  href: '/feminino', sub: 'Bronze · Prata'  },
];

export const JOGOS_TABS: Tab[] = [
  { label: 'Masculino', href: '/jogos',               sub: 'Rei da Quadra' },
  { label: 'F Bronze',  href: '/feminino-jogos',       sub: 'Rei da Quadra' },
  { label: 'F Prata',   href: '/feminino-prata-jogos', sub: 'Rei da Quadra' },
];
