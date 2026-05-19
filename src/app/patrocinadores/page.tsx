'use client';

const patrocinadores = [
  { nome: 'Instituto Torus' },
  { nome: 'Gula Gula' },
  { nome: 'Geolink' },
  { nome: 'Croque Manie' },
  { nome: 'TJ Sound' },
  { nome: 'Hi-Tech II' },
  { nome: 'Arte Sacha Renovação' },
  { nome: 'Oazi' },
  { nome: 'SPW' },
  { nome: 'Contra Dor' },
];

const INITIALS = (nome: string) =>
  nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

export default function PatrocinadoresPage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section
        style={{
          background: '#00361a',
          position: 'relative',
          overflow: 'hidden',
          padding: 'clamp(32px, 6vw, 72px) clamp(16px, 4vw, 32px)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(157,211,170,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '40%',
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(157,211,170,0.04) 8px, rgba(157,211,170,0.04) 9px)',
          }}
        />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
            <div
              style={{
                width: 120,
                height: 120,
                background: '#f8faf5',
                border: '2px solid #9dd3aa',
                boxShadow: '6px 6px 0 #191c19',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-squadra.png"
                alt="Logo Masculino Squadra Verde"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div>
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#9dd3aa',
                  marginBottom: 10,
                }}
              >
                Temporada 2026 · Beach Tennis
              </p>
              <h1
                style={{
                  fontFamily: "'Unbounded', sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(32px, 5vw, 56px)',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.05,
                  marginBottom: 12,
                }}
              >
                Nossos<br />Patrocinadores
              </h1>
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 15,
                  color: 'rgba(240,241,236,0.65)',
                  maxWidth: 480,
                  lineHeight: 1.6,
                }}
              >
                O Masculino Squadra Verde agradece o apoio dos parceiros que tornam possível o Ranking Rei da Quadra 2026.
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: 48,
              paddingTop: 32,
              borderTop: '1px solid rgba(157,211,170,0.2)',
              display: 'flex',
              gap: 8,
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontWeight: 500,
                fontSize: 26,
                color: '#ffffff',
                lineHeight: 1,
                marginRight: 8,
              }}
            >
              {patrocinadores.length}
            </div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(157,211,170,0.6)',
                alignSelf: 'flex-end',
                paddingBottom: 2,
              }}
            >
              Parceiros Oficiais · Temporada 2026
            </div>
          </div>
        </div>
      </section>

      <div className="page-body-inner">

        {/* ── TÍTULO DA SEÇÃO ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 32,
            paddingBottom: 20,
            borderBottom: '2px solid #191c19',
          }}
        >
          <div style={{ width: 4, height: 32, background: '#00361a' }} />
          <h2
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 700,
              fontSize: 28,
              color: '#191c19',
              letterSpacing: '-0.01em',
            }}
          >
            Parceiros Oficiais
          </h2>
          <div style={{ flex: 1, height: 1, background: '#e7e9e4' }} />
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              color: '#717971',
            }}
          >
            {patrocinadores.length} empresas
          </span>
        </div>

        {/* ── GRID DE PATROCINADORES ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 16,
            marginBottom: 64,
          }}
        >
          {patrocinadores.map((p, i) => (
            <div
              key={p.nome}
              style={{
                background: '#ffffff',
                border: '1px solid #191c19',
                boxShadow: '4px 4px 0 #191c19',
                padding: '28px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.15s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translate(-2px,-2px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '6px 6px 0 #191c19';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'none';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '4px 4px 0 #191c19';
              }}
            >
              {/* Accent line esquerda */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 4,
                  bottom: 0,
                  background: '#00361a',
                }}
              />

              {/* Número bg */}
              <div
                style={{
                  position: 'absolute',
                  right: -8,
                  bottom: -16,
                  fontFamily: "'Unbounded', sans-serif",
                  fontWeight: 700,
                  fontSize: 80,
                  color: 'rgba(0,54,26,0.04)',
                  lineHeight: 1,
                  userSelect: 'none',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Iniciais */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: '#1a4d2e',
                  border: '1px solid #191c19',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Unbounded', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#9dd3aa',
                  flexShrink: 0,
                  marginLeft: 8,
                }}
              >
                {INITIALS(p.nome)}
              </div>

              {/* Nome */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    fontFamily: "'Unbounded', sans-serif",
                    fontWeight: 700,
                    fontSize: 17,
                    color: '#191c19',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.2,
                  }}
                >
                  {p.nome}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#717971',
                    marginTop: 4,
                  }}
                >
                  Parceiro Oficial
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── FOTO DO GRUPO ── */}
        <div
          style={{
            border: '1px solid #191c19',
            boxShadow: '6px 6px 0 #191c19',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: 32,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/foto-grupo.png"
            alt="Grupo Masculino Squadra Verde"
            style={{
              width: '100%',
              height: 360,
              objectFit: 'cover',
              display: 'block',
              filter: 'saturate(0.7) brightness(0.55)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: 32,
            }}
          >
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#9dd3aa',
                marginBottom: 12,
              }}
            >
              Juntos no esporte
            </p>
            <h2
              style={{
                fontFamily: "'Unbounded', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(24px, 4vw, 40px)',
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                maxWidth: 600,
              }}
            >
              Obrigado a todos que fazem o Squadra Verde possível
            </h2>
          </div>
        </div>

        {/* ── CTA ── */}
        <div
          style={{
            background: '#f3f4ef',
            border: '1px solid #c1c9bf',
            padding: '32px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Unbounded', sans-serif",
                fontWeight: 700,
                fontSize: 20,
                color: '#191c19',
                marginBottom: 6,
              }}
            >
              Quer ser patrocinador?
            </p>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: '#717971' }}>
              Entre em contato para apoiar o Masculino Squadra Verde na próxima temporada.
            </p>
          </div>
          <a href="mailto:contato@squadraverde.com.br" className="btn-primary">
            Entrar em Contato
          </a>
        </div>
      </div>
    </div>
  );
}
