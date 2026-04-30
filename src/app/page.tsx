import Link from 'next/link';
import classificacao from '@/data/classificacao_ranking.json';
import jogosData from '@/data/jogos_ranking.json';
import resultados from '@/data/resultados.json';
import lancesData from '@/data/lances.json';

function getProximoJogo() {
  const realizadosIds = new Set(resultados.resultados.filter(r => r.realizado).map(r => r.jogo_id));
  for (const rodada of jogosData.rodadas) {
    for (const jogo of rodada.jogos) {
      if (!realizadosIds.has(jogo.id)) {
        return { ...jogo, rodada: rodada.rodada, data: rodada.data };
      }
    }
  }
  return null;
}

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
const RANK_BG: Record<number, string> = {
  1: '#00361a',
  2: '#1a4d2e',
  3: '#2c694e',
};

export default function HomePage() {
  const top3 = classificacao.ranking.slice(0, 3);
  const proximoJogo = getProximoJogo();
  const ultimosLances = lancesData.lances.slice(0, 4);

  return (
    <div>
      {/* ── HERO ── */}
      <section
        style={{
          position: 'relative',
          minHeight: 380,
          overflow: 'hidden',
          background: '#00361a',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(157,211,170,0.12) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Diagonal accent */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '45%',
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(157,211,170,0.06) 8px, rgba(157,211,170,0.06) 9px)',
          }}
        />
        {/* Court lines accent */}
        <div
          style={{
            position: 'absolute',
            right: '8%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 280,
            height: 280,
            border: '1px solid rgba(157,211,170,0.2)',
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '10%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 200,
            height: 200,
            border: '1px solid rgba(157,211,170,0.15)',
          }}
        />

        <div
          className="hero-inner"
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
          }}
        >
          {/* Label */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 24,
            }}
            className="animate-fade-up anim-delay-1"
          >
            <div style={{ width: 24, height: 1, background: '#9dd3aa' }} />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#9dd3aa',
              }}
            >
              Temporada 2026
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(40px, 6vw, 72px)',
              lineHeight: 1.05,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              maxWidth: 640,
              marginBottom: 16,
            }}
            className="animate-fade-up anim-delay-2"
          >
            Ranking<br />
            <span style={{ color: '#9dd3aa' }}>Masculino</span><br />
            Geral
          </h1>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              color: 'rgba(240,241,236,0.7)',
              maxWidth: 480,
              lineHeight: 1.6,
              marginBottom: 40,
            }}
            className="animate-fade-up anim-delay-3"
          >
            Formato Rei da Quadra · {jogosData.periodo} · 8 Rodadas · {classificacao.ranking.length} Atletas
          </p>

          <div
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
            className="animate-fade-up anim-delay-4"
          >
            <Link href="/ranking" className="btn-primary" style={{ background: '#9dd3aa', color: '#00361a', borderColor: '#9dd3aa' }}>
              Ver Ranking Completo
            </Link>
            <Link href="/jogos" className="btn-ghost" style={{ color: '#9dd3aa', borderColor: 'rgba(157,211,170,0.5)' }}>
              Agenda de Jogos
            </Link>
          </div>

          {/* Stats bar */}
          <div
            style={{
              display: 'flex',
              gap: 32,
              marginTop: 64,
              paddingTop: 32,
              borderTop: '1px solid rgba(157,211,170,0.2)',
              flexWrap: 'wrap',
            }}
            className="animate-fade-up anim-delay-5"
          >
            {[
              { value: jogosData.rodadas.length, label: 'Rodadas' },
              { value: resultados.resultados.filter(r => r.realizado).length, label: 'Jogos Realizados' },
              { value: classificacao.ranking.length, label: 'Atletas' },
              { value: classificacao.atualizado_em, label: 'Atualizado em' },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontWeight: 500,
                    fontSize: 28,
                    color: '#ffffff',
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(157,211,170,0.7)',
                    marginTop: 4,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP 3 ── */}
      <section className="page-body-inner" style={{ paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 8 }}>Classificação</p>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 32,
                color: '#191c19',
                letterSpacing: '-0.01em',
              }}
            >
              Líderes do Ranking
            </h2>
          </div>
          <Link
            href="/ranking"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#00361a',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Ver Todos →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {top3.map((jogador) => (
            <div
              key={jogador.posicao}
              className="card-hard-shadow"
              style={{
                background: RANK_BG[jogador.posicao],
                padding: '28px 24px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Background number */}
              <div
                style={{
                  position: 'absolute',
                  right: -12,
                  top: -20,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 120,
                  color: 'rgba(255,255,255,0.06)',
                  lineHeight: 1,
                  userSelect: 'none',
                }}
              >
                {jogador.posicao}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'DM Mono', monospace",
                    fontWeight: 500,
                    fontSize: 18,
                    color: '#ffffff',
                  }}
                >
                  {jogador.posicao}
                </div>
                <span style={{ fontSize: 22 }}>{MEDAL[jogador.posicao]}</span>
              </div>

              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  color: '#ffffff',
                  letterSpacing: '-0.01em',
                  marginBottom: 16,
                }}
              >
                {jogador.nome}
              </h3>

              <div style={{ display: 'flex', gap: 20 }}>
                <div>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontWeight: 500,
                      fontSize: 24,
                      color: '#9dd3aa',
                      lineHeight: 1,
                    }}
                  >
                    {jogador.percentual_vitorias}%
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.5)',
                      marginTop: 4,
                    }}
                  >
                    Vitórias
                  </div>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
                <div>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontWeight: 500,
                      fontSize: 24,
                      color: jogador.saldo_games >= 0 ? '#9dd3aa' : '#ffdad6',
                      lineHeight: 1,
                    }}
                  >
                    {jogador.saldo_games > 0 ? '+' : ''}{jogador.saldo_games}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.5)',
                      marginTop: 4,
                    }}
                  >
                    Saldo
                  </div>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
                <div>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontWeight: 500,
                      fontSize: 24,
                      color: '#ffffff',
                      lineHeight: 1,
                    }}
                  >
                    {jogador.vitorias}/{jogador.jogos}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.5)',
                      marginTop: 4,
                    }}
                  >
                    V/J
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRÓXIMO JOGO + ÚLTIMOS LANCES ── */}
      <section className="page-body-inner" style={{ paddingBottom: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }} className="grid-cols-responsive">

          {/* Próximo Jogo */}
          <div>
            <p className="section-label" style={{ marginBottom: 8 }}>Próximo Jogo</p>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 28,
                color: '#191c19',
                marginBottom: 24,
              }}
            >
              Na Quadra Em Breve
            </h2>

            {proximoJogo ? (
              <div
                style={{
                  border: '1px solid #191c19',
                  background: '#ffffff',
                  padding: '28px 24px',
                  position: 'relative',
                }}
              >
                {/* Header da rodada */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                    paddingBottom: 16,
                    borderBottom: '1px solid #e7e9e4',
                  }}
                >
                  <span className="chip">Rodada {proximoJogo.rodada}</span>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#717971',
                    }}
                  >
                    {proximoJogo.data} · {proximoJogo.horario}
                  </span>
                </div>

                {/* Duplas */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    {proximoJogo.dupla1.map((nome) => (
                      <p
                        key={nome}
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 600,
                          fontSize: 15,
                          color: '#191c19',
                          marginBottom: 4,
                        }}
                      >
                        {nome}
                      </p>
                    ))}
                  </div>

                  <div
                    style={{
                      padding: '8px 12px',
                      background: '#00361a',
                      border: '1px solid #191c19',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: 13,
                        color: '#9dd3aa',
                        letterSpacing: '0.08em',
                      }}
                    >
                      VS
                    </span>
                  </div>

                  <div style={{ flex: 1, textAlign: 'right' }}>
                    {proximoJogo.dupla2.map((nome) => (
                      <p
                        key={nome}
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 600,
                          fontSize: 15,
                          color: '#191c19',
                          marginBottom: 4,
                        }}
                      >
                        {nome}
                      </p>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 20,
                    paddingTop: 16,
                    borderTop: '1px solid #e7e9e4',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <span className="chip-pending">⏳ Aguardando</span>
                </div>
              </div>
            ) : (
              <div
                style={{
                  border: '1px solid #c1c9bf',
                  padding: 24,
                  background: '#f3f4ef',
                  textAlign: 'center',
                  color: '#717971',
                }}
              >
                Temporada encerrada
              </div>
            )}

            <div style={{ marginTop: 16 }}>
              <Link href="/jogos" className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                Ver Agenda Completa
              </Link>
            </div>
          </div>

          {/* Últimos Lances */}
          <div>
            <p className="section-label" style={{ marginBottom: 8 }}>Highlights</p>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 28,
                color: '#191c19',
                marginBottom: 24,
              }}
            >
              Últimos Lances
            </h2>

            <div className="lances-mini-grid">
              {ultimosLances.map((lance) => (
                <Link
                  key={lance.id}
                  href="/lances"
                  style={{
                    textDecoration: 'none',
                    display: 'block',
                    position: 'relative',
                    border: '1px solid #191c19',
                    overflow: 'hidden',
                    aspectRatio: '4/3',
                    background: '#1a4d2e',
                  }}
                  className="card-hard-shadow"
                >
                  {/* Thumbnail placeholder */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(135deg, #1a4d2e, #00361a)`,
                      backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(157,211,170,0.15), transparent 60%)',
                    }}
                  />

                  {/* Type badge */}
                  <div style={{ position: 'absolute', top: 8, left: 8 }}>
                    <span className="chip-green" style={{ fontSize: 9 }}>{lance.tipo}</span>
                  </div>

                  {/* Play button for video */}
                  {lance.midia_tipo === 'video' && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 36,
                        height: 36,
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                        <path d="M1 1l10 6-10 6V1z" fill="white"/>
                      </svg>
                    </div>
                  )}

                  {/* Info overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '8px 10px',
                      background: 'rgba(0,0,0,0.7)',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 600,
                        fontSize: 11,
                        color: '#ffffff',
                        lineHeight: 1.2,
                        marginBottom: 2,
                      }}
                    >
                      {lance.titulo}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 10,
                        color: 'rgba(255,255,255,0.6)',
                      }}
                    >
                      {lance.jogador}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              <Link href="/lances" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Todos os Lances
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-section">
        <div
          style={{
            background: '#2e312e',
            border: '1px solid #191c19',
            padding: '48px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 24,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, rgba(157,211,170,0.05) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div style={{ position: 'relative' }}>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#9dd3aa',
                marginBottom: 8,
              }}
            >
              Ranking Rei da Quadra
            </p>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 28,
                color: '#ffffff',
                letterSpacing: '-0.01em',
              }}
            >
              Acompanhe cada rodada
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 12, position: 'relative', flexWrap: 'wrap' }}>
            <Link href="/ranking" className="btn-primary" style={{ background: '#9dd3aa', color: '#00361a', borderColor: '#9dd3aa' }}>
              Ver Ranking
            </Link>
            <Link href="/jogos" className="btn-ghost" style={{ color: '#9dd3aa', borderColor: 'rgba(157,211,170,0.4)' }}>
              Ver Jogos
            </Link>
            <Link href="/lances" className="btn-ghost" style={{ color: '#9dd3aa', borderColor: 'rgba(157,211,170,0.4)' }}>
              Ver Lances
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
