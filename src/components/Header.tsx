'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import LogoSVG from './LogoSVG';

const NAV = [
  { href: '/',           label: 'Home' },
  { href: '/ranking',    label: 'Classificação' },
  { href: '/jogos',      label: 'Jogos' },
  { href: '/lances',     label: 'Lances' },
  { href: '/atletas',        label: 'Atletas' },
  { href: '/patrocinadores', label: 'Patrocinadores' },
  { href: '/sobre',          label: 'Sobre' },
];

const RANKING_PATHS = ['/ranking', '/feminino', '/feminino-prata'];
const JOGOS_PATHS   = ['/jogos', '/feminino-jogos', '/feminino-prata-jogos'];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    if (href === '/ranking') return RANKING_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));
    if (href === '/jogos')   return JOGOS_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <header className="nav">
      <div className="nav-inner">

        {/* Brand */}
        <Link href="/" className="brand-mark" onClick={() => setOpen(false)}>
          <LogoSVG color="var(--verde-deep)" width={26} height={42} />
          <div className="brand-mark-text">
            <strong>Squadra Verde</strong>
            <span>Beach Tênis · T2026</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav>
          <ul className="nav-links">
            {NAV.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={isActive(link.href) ? 'active' : ''}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-right">
          {/* Mobile hamburger */}
          <button
            className="nav-mobile-btn"
            onClick={() => setOpen(v => !v)}
            aria-label="Menu"
          >
            {[0, 1, 2].map(i => (
              <span
                key={i}
                style={{
                  display: 'block',
                  height: 2,
                  background: 'var(--ink)',
                  transition: 'all 0.2s',
                  width: i === 0 ? 24 : i === 1 ? (open ? 0 : 20) : (open ? 24 : 16),
                  opacity: i === 1 && open ? 0 : 1,
                  transform: i === 0 && open ? 'rotate(45deg) translate(5px, 5px)' : i === 2 && open ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
                  borderRadius: 1,
                }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div style={{
        background: 'var(--paper)',
        borderTop: open ? '1px solid var(--line)' : 'none',
        maxHeight: open ? 500 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.28s ease',
      }}>
        <div style={{ padding: '8px 0 20px' }}>
          {NAV.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '13px 24px',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: isActive(link.href) ? 'var(--ink)' : 'color-mix(in oklch, var(--ink) 45%, transparent)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--line-soft)',
                borderLeft: isActive(link.href) ? '2px solid var(--citrino-deep)' : '2px solid transparent',
                background: isActive(link.href) ? 'color-mix(in oklch, var(--ink) 4%, transparent)' : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ padding: '14px 24px 0' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'color-mix(in oklch, var(--ink) 40%, transparent)',
            }}>
              Temporada 2026
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
