const patrocinadores = [
  'Gula Gula', 'Geolink', 'Croque Manie', 'TJ Sound',
  'Instituto Torus', 'Hi-Tech II', 'Arte Sacha', 'Oazi', 'SPW', 'Contra Dor',
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--preto)', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 80 }}>

      {/* Patrocinadores */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--verde-medio)', marginBottom: 20, opacity: 0.7 }}>
          <a href="/patrocinadores" style={{ textDecoration: 'none', color: 'inherit' }}>Patrocinadores →</a>
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 12px' }}>
          {patrocinadores.map(p => (
            <a
              key={p}
              href="/patrocinadores"
              style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500, fontSize: 11, letterSpacing: '0.1em', color: 'rgba(79,140,79,0.75)', padding: '5px 12px', border: '1px solid rgba(79,140,79,0.2)', textDecoration: 'none', transition: 'border-color 0.15s' }}
            >
              {p}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>

        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.35em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: 6 }}>Beach Tênis</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, background: 'var(--verde-campo)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 10, color: 'var(--creme)', letterSpacing: '-0.04em' }}>SV</span>
            </div>
            <div>
              <span style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 14, color: 'var(--creme)', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>SQUADRA</span>
              <span style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 14, color: 'var(--verde-campo)', textTransform: 'uppercase', letterSpacing: '-0.01em', marginLeft: 6 }}>VERDE</span>
            </div>
          </div>
        </div>

        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textAlign: 'right', lineHeight: 1.8 }}>
          © 2025 Squadra Verde<br />Temporada 2025
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer .footer-sponsors { padding: 28px 20px 24px; }
          footer .footer-bottom-inner { padding: 20px 20px; flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </footer>
  );
}
