'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV = [
  { href: '/',           label: 'Home' },
  { href: '/ranking',    label: 'Classificação' },
  { href: '/jogos',      label: 'Jogos' },
  { href: '/lances',     label: 'Lances' },
  { href: '/atletas',    label: 'Atletas' },
  { href: '/sobre',      label: 'Sobre' },
];

const RANKING_PATHS = ['/ranking', '/feminino', '/feminino-prata'];
const JOGOS_PATHS   = ['/jogos', '/feminino-jogos', '/feminino-prata-jogos'];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    if (href === '/ranking') return RANKING_PATHS.some(p => pathname.startsWith(p));
    if (href === '/jogos')   return JOGOS_PATHS.some(p => pathname.startsWith(p));
    return pathname.startsWith(href);
  }

  return (
    <header style={{ background: 'var(--verde-escuro)', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }} onClick={() => setOpen(false)}>
          <div style={{ width: 36, height: 36, background: 'var(--verde-campo)', border: '1.5px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 13, color: 'var(--creme)', letterSpacing: '-0.04em' }}>SV</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <span style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 11, letterSpacing: '0.1em', color: 'var(--creme)', textTransform: 'uppercase', lineHeight: 1.1 }}>SQUADRA</span>
            <span style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 11, letterSpacing: '0.1em', color: 'var(--verde-medio)', textTransform: 'uppercase', lineHeight: 1.1 }}>VERDE</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-desktop">
          {NAV.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link${isActive(link.href) ? ' active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-btn"
          onClick={() => setOpen(v => !v)}
          aria-label="Menu"
          style={{ flexShrink: 0 }}
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                display: 'block',
                height: 2,
                background: 'var(--creme)',
                transition: 'all 0.2s',
                width: i === 0 ? (open ? 24 : 24) : i === 1 ? (open ? 0 : 20) : (open ? 24 : 16),
                opacity: i === 1 && open ? 0 : 1,
                transform: i === 0 && open ? 'rotate(45deg) translate(5px, 5px)' : i === 2 && open ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <div style={{ background: 'var(--preto)', borderTop: open ? '1px solid rgba(255,255,255,0.06)' : 'none', maxHeight: open ? 500 : 0, overflow: 'hidden', transition: 'max-height 0.28s ease' }}>
        <div style={{ padding: '8px 0 20px' }}>
          {NAV.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '14px 24px',
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: isActive(link.href) ? 'var(--creme)' : 'rgba(245,239,230,0.45)',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                borderLeft: isActive(link.href) ? '2px solid var(--amarelo)' : '2px solid transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ padding: '14px 24px 0' }}>
            <span className="chip">Temporada 2025</span>
          </div>
        </div>
      </div>
    </header>
  );
}
