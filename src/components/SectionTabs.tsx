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
    <div className="section-tabs-bar">
      <div className="section-tabs-inner">
        <span className="section-tabs-label">{section}</span>
        {tabs.map(tab => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`section-tab-link${active ? ' active' : ''}`}
            >
              <span className="tab-label">{tab.label}</span>
              {tab.sub && <span className="tab-sub">{tab.sub}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ── Tab configs ── */
export const RANKING_TABS: Tab[] = [
  { label: 'Masculino', href: '/ranking',  sub: 'Temporada 2026' },
  { label: 'Feminino',  href: '/feminino', sub: 'Bronze · Prata'  },
];

export const JOGOS_TABS: Tab[] = [
  { label: 'Masculino',  href: '/jogos',               sub: 'Rei da Quadra' },
  { label: 'F Bronze',   href: '/feminino-jogos',       sub: 'Rei da Quadra' },
  { label: 'F Prata',    href: '/feminino-prata-jogos', sub: 'Rei da Quadra' },
];
