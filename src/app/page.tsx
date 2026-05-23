import Link from 'next/link';

const RANKINGS = [
  {
    slug: '/ranking',
    jogos: '/jogos',
    label: 'Masculino',
    descricao: 'Ranking principal do Squadra Verde. Atletas masculinos disputam rodadas em formato round-robin, acumulando vitórias e saldo de games ao longo da temporada.',
    cor: 'var(--verde-deep)',
    glow: 'var(--verde-glow)',
    letra: 'M',
  },
  {
    slug: '/feminino',
    jogos: '/feminino-jogos',
    label: 'Feminino Bronze',
    descricao: 'Categoria de entrada do feminino. Atletas competem em formato de grupos com foco em desenvolvimento e evolução técnica dentro da temporada.',
    cor: '#4a3828',
    glow: '#c8a878',
    letra: 'B',
  },
  {
    slug: '/feminino',
    jogos: '/feminino-prata-jogos',
    label: 'Feminino Prata',
    descricao: 'Categoria avançada do feminino. Sistema de pontuação por sets e games com classificação detalhada por aproveitamento.',
    cor: '#1c2830',
    glow: '#b8c5cf',
    letra: 'P',
  },
] as const;

const COMO_FUNCIONA = [
  {
    num: '01',
    titulo: 'Inscrição individual',
    texto: 'Atletas se inscrevem individualmente e são organizados em grupos para disputar o ranking durante toda a temporada.',
  },
  {
    num: '02',
    titulo: 'Rodadas periódicas',
    texto: 'A cada rodada, os atletas se enfrentam em confrontos diretos. Os resultados são registrados no LetzPlay após cada partida.',
  },
  {
    num: '03',
    titulo: 'Classificação contínua',
    texto: 'Vitórias, saldo de games e percentual de aproveitamento determinam a posição no ranking ao longo da temporada.',
  },
  {
    num: '04',
    titulo: 'Final de temporada',
    texto: 'Os melhores colocados de cada categoria avançam para a fase final e disputam o título de campeão da temporada.',
  },
] as const;

export default function HomePage() {
  return (
    <div>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-inner">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }} className="animate-fade-up anim-delay-1">
            <div style={{ width: 24, height: 1, background: 'var(--verde-glow)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--verde-glow)' }}>
              Temporada 2026 · Beach Tênis
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(80px, 19vw, 160px)',
              lineHeight: 0.9,
              color: 'var(--paper)',
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              maxWidth: 700,
              marginBottom: 28,
            }}
            className="animate-fade-up anim-delay-2"
          >
            SQUADRA<br />
            <span style={{ color: 'var(--verde-glow)' }}>VERDE</span>
          </h1>

          <p
            style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'color-mix(in oklch, var(--paper) 65%, transparent)', maxWidth: 480, lineHeight: 1.8, marginBottom: 40 }}
            className="animate-fade-up anim-delay-3"
          >
            Ranking interno de beach tênis com 3 categorias — Masculino, Feminino Bronze e Feminino Prata. Temporada 2026 em andamento.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }} className="animate-fade-up anim-delay-4">
            <Link href="/ranking" className="btn-accent">Ver Classificação</Link>
            <Link href="/jogos" className="btn-hero">Ver Jogos</Link>
          </div>

          <div
            className="animate-fade-up anim-delay-5"
            style={{ display: 'flex', gap: 40, marginTop: 64, paddingTop: 28, borderTop: '1px solid color-mix(in oklch, var(--paper) 12%, transparent)', flexWrap: 'wrap' }}
          >
            {[
              { value: '3',    label: 'Categorias' },
              { value: '78+',  label: 'Atletas' },
              { value: '2026', label: 'Temporada' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color: 'var(--paper)', lineHeight: 1, letterSpacing: '-0.02em' }}>{stat.value}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--paper) 45%, transparent)', marginTop: 8 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OS RANKINGS ── */}
      <section className="page-body-inner" style={{ paddingBottom: 0 }}>
        <div style={{ marginBottom: 32 }}>
          <p className="section-label" style={{ marginBottom: 8 }}>Temporada 2026</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--ink)', letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
            As Categorias
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 2 }}>
          {RANKINGS.map((r) => (
            <div
              key={r.label}
              style={{ background: r.cor, padding: '36px 28px', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', right: -12, top: -20, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 140, color: 'rgba(255,255,255,0.04)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.04em' }}>
                {r.letra}
              </div>

              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: r.glow, marginBottom: 12, fontWeight: 600 }}>
                Ranking
              </p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, color: 'var(--paper)', letterSpacing: '-0.03em', textTransform: 'uppercase', marginBottom: 16, lineHeight: 1 }}>
                {r.label}
              </h3>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'color-mix(in oklch, var(--paper) 60%, transparent)', lineHeight: 1.7, marginBottom: 28 }}>
                {r.descricao}
              </p>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Link
                  href={r.slug}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
                    padding: '10px 18px', background: r.glow, color: r.cor, textDecoration: 'none', borderRadius: 2,
                  }}
                >
                  Classificação
                </Link>
                <Link
                  href={r.jogos}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
                    padding: '10px 18px', background: 'transparent', color: 'color-mix(in oklch, var(--paper) 70%, transparent)',
                    border: '1px solid color-mix(in oklch, var(--paper) 20%, transparent)', textDecoration: 'none', borderRadius: 2,
                  }}
                >
                  Jogos
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section style={{ background: 'var(--ink)', padding: '64px 0', marginTop: 64 }}>
        <div className="page-head-inner">
          <div style={{ marginBottom: 40 }}>
            <p className="section-label" style={{ marginBottom: 8, color: 'var(--verde-glow)' }}>Formato</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--paper)', letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
              Como Funciona
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 1 }}>
            {COMO_FUNCIONA.map((item) => (
              <div key={item.num} style={{ padding: '28px 24px', borderLeft: '1px solid color-mix(in oklch, var(--paper) 8%, transparent)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 42, color: 'var(--verde-glow)', lineHeight: 1, marginBottom: 16, letterSpacing: '-0.04em', opacity: 0.4 }}>
                  {item.num}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--paper)', letterSpacing: '-0.01em', marginBottom: 10, textTransform: 'uppercase' }}>
                  {item.titulo}
                </h3>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'color-mix(in oklch, var(--paper) 50%, transparent)', lineHeight: 1.7 }}>
                  {item.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ATLETAS + PATROCINADORES ── */}
      <section className="page-body-inner" style={{ paddingBottom: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 2 }}>

          <div style={{ background: 'var(--sand)', border: '1px solid var(--line)', padding: '40px 32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -16, bottom: -24, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 140, color: 'rgba(0,0,0,0.04)', lineHeight: 1, userSelect: 'none', letterSpacing: '-0.04em' }}>78</div>
            <p className="section-label" style={{ marginBottom: 10 }}>Comunidade</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--ink)', letterSpacing: '-0.03em', textTransform: 'uppercase', marginBottom: 14, lineHeight: 1 }}>
              Atletas
            </h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'color-mix(in oklch, var(--ink) 55%, transparent)', lineHeight: 1.7, marginBottom: 28 }}>
              Mais de 78 atletas competindo nas 3 categorias do Squadra Verde nesta temporada.
            </p>
            <Link href="/atletas" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink)', textDecoration: 'none', borderBottom: '2px solid var(--ink)', paddingBottom: 2 }}>
              Ver Atletas →
            </Link>
          </div>

          <div style={{ background: 'var(--verde-deep)', padding: '40px 32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -16, bottom: -24, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 140, color: 'rgba(255,255,255,0.04)', lineHeight: 1, userSelect: 'none', letterSpacing: '-0.04em' }}>10</div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--verde-glow)', marginBottom: 10, fontWeight: 600 }}>Apoio</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--paper)', letterSpacing: '-0.03em', textTransform: 'uppercase', marginBottom: 14, lineHeight: 1 }}>
              Patrocinadores
            </h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'color-mix(in oklch, var(--paper) 55%, transparent)', lineHeight: 1.7, marginBottom: 28 }}>
              10 empresas parceiras que tornam o Ranking Rei da Quadra 2026 possível.
            </p>
            <Link href="/patrocinadores" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--verde-glow)', textDecoration: 'none', borderBottom: '2px solid var(--verde-glow)', paddingBottom: 2 }}>
              Ver Patrocinadores →
            </Link>
          </div>

        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="cta-section" style={{ marginBottom: 0, paddingBottom: 48 }}>
        <div style={{ background: 'var(--ink)', padding: '48px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'var(--hero-pattern)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--verde-glow)', marginBottom: 10, opacity: 0.9 }}>Squadra Verde · Temporada 2026</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(22px, 3vw, 36px)', color: 'var(--paper)', letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
              Acompanhe a Temporada
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 10, position: 'relative', flexWrap: 'wrap' }}>
            <Link href="/ranking" className="btn-accent">Classificação</Link>
            <Link href="/jogos" className="btn-hero">Jogos</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
