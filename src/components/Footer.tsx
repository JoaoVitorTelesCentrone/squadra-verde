import Link from 'next/link';
import LogoSVG from './LogoSVG';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Classificação', href: '/ranking' },
  { label: 'Jogos', href: '/jogos' },
  { label: 'Lances', href: '/lances' },
  { label: 'Atletas', href: '/atletas' },
  { label: 'Sobre', href: '/sobre' },
];

const RANKINGS = [
  { label: 'Masculino', href: '/ranking' },
  { label: 'Feminino Bronze', href: '/feminino' },
  { label: 'Feminino Prata', href: '/feminino-prata' },
  { label: 'Patrocinadores', href: '/patrocinadores' },
];

const patrocinadores = [
  'Gula Gula', 'Geolink', 'Croque Manie', 'TJ Sound',
  'Instituto Torus', 'Hi-Tech II', 'Arte Sacha', 'Oazi', 'SPW', 'Contra Dor',
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Patrocinadores strip */}
        <div style={{
          paddingBottom: 32,
          marginBottom: 32,
          borderBottom: '1px solid color-mix(in oklch, var(--paper) 10%, transparent)',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'color-mix(in oklch, var(--paper) 40%, transparent)',
            marginBottom: 16,
          }}>
            <Link href="/patrocinadores" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}>
              Patrocinadores →
            </Link>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 10px' }}>
            {patrocinadores.map(p => (
              <Link
                key={p}
                href="/patrocinadores"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 500,
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  color: 'color-mix(in oklch, var(--verde-glow) 80%, transparent)',
                  padding: '4px 10px',
                  border: '1px solid color-mix(in oklch, var(--verde-glow) 18%, transparent)',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s, color 0.15s',
                  borderRadius: 1,
                }}
              >
                {p}
              </Link>
            ))}
          </div>
        </div>

        {/* Main footer */}
        <div className="footer-top">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <LogoSVG color="var(--verde-glow)" width={24} height={38} />
              <div className="mark-big">
                Squadra <em>Verde</em>
              </div>
            </div>
            <p>
              Um ranking interno de beach tênis que reúne amigos e incentiva a evolução técnica — Masculino, Feminino Bronze e Feminino Prata.
            </p>
          </div>

          <div className="footer-col">
            <h4>Seções</h4>
            <ul>
              {NAV_LINKS.map(l => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Rankings</h4>
            <ul>
              {RANKINGS.map(l => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Squadra Verde · Temporada 2026</span>
          <span>Beach Tênis</span>
        </div>
      </div>
    </footer>
  );
}
