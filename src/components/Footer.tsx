const patrocinadores = [
  'Gula Gula',
  'Geolink',
  'Croque Manie',
  'TJ Sound',
  'Instituto Torus',
  'Hi-Tech II',
  'Arte Sacha',
  'Oazi',
  'SPW',
  'Contra Dor',
];

export default function Footer() {
  return (
    <footer
      style={{
        background: '#2e312e',
        borderTop: '1px solid #191c19',
        marginTop: 80,
      }}
    >
      {/* Patrocinadores */}
      <div
        className="footer-inner"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#717971',
            marginBottom: 16,
          }}
        >
          <a href="/patrocinadores" style={{ textDecoration: 'none', fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#717971' }}>
            Patrocinadores →
          </a>
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px 16px',
          }}
        >
          {patrocinadores.map((p) => (
            <a
              key={p}
              href="/patrocinadores"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: '0.05em',
                color: '#9dd3aa',
                padding: '4px 10px',
                border: '1px solid rgba(157, 211, 170, 0.25)',
                textDecoration: 'none',
                transition: 'border-color 0.15s',
              }}
            >
              {p}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: '#00361a',
              border: '1px solid #9dd3aa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 2c1.19 0 2.32.27 3.33.74L5.74 15.33A6.97 6.97 0 0 1 5 12c0-3.87 3.13-7 7-7zm0 14c-1.19 0-2.32-.27-3.33-.74l9.59-9.59A6.97 6.97 0 0 1 19 12c0 3.87-3.13 7-7 7z" fill="white"/>
            </svg>
          </div>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: '#f0f1ec',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Squadra Verde
          </span>
        </div>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            color: '#717971',
          }}
        >
          © 2026 Masculino Squadra Verde · Ranking Rei da Quadra
        </p>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            color: '#414942',
            letterSpacing: '0.08em',
          }}
        >
          Temporada 03/05 — 21/06
        </p>
      </div>
    </footer>
  );
}
