'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/ranking', label: 'Ranking' },
  { href: '/jogos', label: 'Jogos' },
  { href: '/lances', label: 'Lances' },
  { href: '/atletas', label: 'Atletas' },
  { href: '/patrocinadores', label: 'Patrocinadores' },
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
          padding: '0 32px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
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
        <nav style={{ display: 'flex', gap: 20, alignItems: 'center' }} className="hidden md:flex">
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
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
          }}
          aria-label="Menu"
        >
          <span style={{ display: 'block', width: 24, height: 2, background: '#191c19', transition: 'all 0.2s' }} />
          <span style={{ display: 'block', width: 24, height: 2, background: '#191c19', transition: 'all 0.2s' }} />
          <span style={{ display: 'block', width: 18, height: 2, background: '#191c19', transition: 'all 0.2s' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: '#ffffff',
            borderTop: '1px solid #e7e9e4',
            padding: '16px 32px 24px',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid #e7e9e4' }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: 16 }}>
            <span className="chip">Temporada 2026</span>
          </div>
        </div>
      )}
    </header>
  );
}
