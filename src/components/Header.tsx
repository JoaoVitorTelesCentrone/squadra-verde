'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/ranking', label: 'Classificação' },
  { href: '/jogos', label: 'Jogos' },
  { href: '/lances', label: 'Lances' },
  { href: '/atletas', label: 'Atletas' },
  { href: '/patrocinadores', label: 'Patrocinadores' },
  { href: '/sobre', label: 'Sobre' },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        borderBottom: '1px solid #191c19',
        background: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: '1px solid #191c19',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8faf5',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-squadra.png" alt="Logo Squadra Verde" style={{ width: 40, height: 40, objectFit: 'cover' }} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '0.05em',
                color: '#00361a',
                lineHeight: 1.1,
                textTransform: 'uppercase',
              }}
            >
              Squadra Verde
            </div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: 10,
                letterSpacing: '0.12em',
                color: '#717971',
                textTransform: 'uppercase',
              }}
            >
              Beach Tennis · Masculino
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="nav-desktop">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span
            style={{
              display: 'block',
              width: 24,
              height: 2,
              background: '#191c19',
              transition: 'all 0.2s',
              transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
            }}
          />
          <span
            style={{
              display: 'block',
              width: 24,
              height: 2,
              background: '#191c19',
              transition: 'all 0.2s',
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: 'block',
              width: menuOpen ? 24 : 18,
              height: 2,
              background: '#191c19',
              transition: 'all 0.2s',
              transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        style={{
          background: '#ffffff',
          borderTop: menuOpen ? '1px solid #e7e9e4' : 'none',
          maxHeight: menuOpen ? 600 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.28s ease, border-top 0.1s',
        }}
      >
        <div style={{ padding: '8px 0 16px' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 24px',
                borderBottom: '1px solid #f3f4ef',
                fontSize: 13,
              }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ padding: '12px 24px 0' }}>
            <span className="chip">Temporada 2026</span>
          </div>
        </div>
      </div>
    </header>
  );
}
