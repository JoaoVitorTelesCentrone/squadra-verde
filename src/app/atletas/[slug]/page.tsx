import { notFound } from 'next/navigation';
import Link from 'next/link';
import classificacao from '@/data/classificacao_ranking.json';
import jogosData from '@/data/jogos_ranking.json';
import resultadosData from '@/data/resultados.json';

function slugify(nome: string) {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

const INITIALS = (nome: string) =>
  nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

export function generateStaticParams() {
  return classificacao.ranking.map(j => ({ slug: slugify(j.nome) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const atleta = classificacao.ranking.find(j => slugify(j.nome) === slug);
  if (!atleta) return {};
  return { title: `${atleta.nome} · Squadra Verde` };
}

export default async function AtletaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const atleta = classificacao.ranking.find(j => slugify(j.nome) === slug);
  if (!atleta) notFound();

  const realizadosIds = new Set(
    resultadosData.resultados.filter(r => r.realizado).map(r => r.jogo_id)
  );

  const jogos = jogosData.rodadas.flatMap(rodada =>
    rodada.jogos
      .filter(jogo =>
        jogo.dupla1.includes(atleta.nome) || jogo.dupla2.includes(atleta.nome)
      )
      .map(jogo => {
        const emDupla1 = jogo.dupla1.includes(atleta.nome);
        const parceiro = emDupla1
          ? jogo.dupla1.find(n => n !== atleta.nome)!
          : jogo.dupla2.find(n => n !== atleta.nome)!;
        const adversarios = emDupla1 ? jogo.dupla2 : jogo.dupla1;
        return {
          id: jogo.id,
          horario: jogo.horario,
          rodada: rodada.rodada,
          data: rodada.data,
          parceiro,
          adversarios,
          realizado: realizadosIds.has(jogo.id),
        };
      })
  );

  const ativo = atleta.jogos > 0;

  const stats = [
    { label: 'Jogos', value: atleta.jogos },
    { label: 'Vitórias', value: atleta.vitorias },
    { label: 'Derrotas', value: atleta.derrotas },
    { label: '% Vitórias', value: `${atleta.percentual_vitorias}%` },
    { label: 'Games Vencidos', value: atleta.games_vencidos },
    { label: 'Games Perdidos', value: atleta.games_perdidos },
    { label: 'Saldo de Games', value: (atleta.saldo_games > 0 ? '+' : '') + atleta.saldo_games, highlight: atleta.saldo_games > 0 ? 'pos' : atleta.saldo_games < 0 ? 'neg' : '' },
  ];

  return (
    <div>
      {/* ── HERO DO ATLETA ── */}
      <section
        style={{
          background: ativo ? '#00361a' : '#2e312e',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(157,211,170,0.10) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px 40px', position: 'relative' }}>
          {/* Back link */}
          <Link
            href="/atletas"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(157,211,170,0.7)',
              textDecoration: 'none',
              marginBottom: 32,
            }}
          >
            ← Atletas
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div
              style={{
                width: 88,
                height: 88,
                background: 'rgba(255,255,255,0.10)',
                border: '2px solid rgba(157,211,170,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 32,
                color: '#9dd3aa',
                flexShrink: 0,
              }}
            >
              {INITIALS(atleta.nome)}
            </div>

            {/* Info */}
            <div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'rgba(157,211,170,0.6)',
                  letterSpacing: '0.1em',
                  marginBottom: 6,
                }}
              >
                #{atleta.posicao} · Ranking Masculino 2026
              </div>
              <h1
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(28px, 4vw, 48px)',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  marginBottom: 10,
                }}
              >
                {atleta.nome}
              </h1>
              {ativo ? (
                <span
                  style={{
                    display: 'inline-block',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#9dd3aa',
                    background: 'rgba(157,211,170,0.12)',
                    border: '1px solid rgba(157,211,170,0.25)',
                    padding: '4px 10px',
                  }}
                >
                  Ativo · {atleta.jogos} jogo{atleta.jogos !== 1 ? 's' : ''} disputado{atleta.jogos !== 1 ? 's' : ''}
                </span>
              ) : (
                <span
                  style={{
                    display: 'inline-block',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(240,241,236,0.4)',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '4px 10px',
                  }}
                >
                  Aguardando início
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>

        {/* ── STATS ── */}
        {ativo && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 3, height: 24, background: '#00361a' }} />
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#191c19',
                  letterSpacing: '-0.01em',
                }}
              >
                Estatísticas
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: 8,
              }}
            >
              {stats.map(s => (
                <div
                  key={s.label}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e7e9e4',
                    padding: '16px 14px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontWeight: 500,
                      fontSize: 22,
                      lineHeight: 1,
                      marginBottom: 6,
                      color:
                        s.highlight === 'pos' ? '#00361a' :
                        s.highlight === 'neg' ? '#ba1a1a' :
                        '#191c19',
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#717971',
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── JOGOS ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 3, height: 24, background: '#00361a' }} />
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: '#191c19',
                letterSpacing: '-0.01em',
              }}
            >
              Agenda de Jogos
            </h2>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#717971' }}>
              {jogos.length} partidas
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {jogos.map(jogo => (
              <div
                key={jogo.id}
                style={{
                  background: '#ffffff',
                  border: `1px solid ${jogo.realizado ? '#c8e6c9' : '#e7e9e4'}`,
                  borderLeft: `3px solid ${jogo.realizado ? '#2c694e' : '#c1c9bf'}`,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  flexWrap: 'wrap',
                }}
              >
                {/* Rodada + data */}
                <div style={{ flexShrink: 0, minWidth: 60 }}>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontWeight: 500,
                      fontSize: 13,
                      color: '#191c19',
                      lineHeight: 1,
                    }}
                  >
                    R{jogo.rodada}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#717971', marginTop: 3 }}>
                    {jogo.data}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#717971' }}>
                    {jogo.horario}
                  </div>
                </div>

                {/* Divisor */}
                <div style={{ width: 1, height: 44, background: '#e7e9e4', flexShrink: 0 }} />

                {/* Atleta */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: 14,
                      color: '#00361a',
                      lineHeight: 1.2,
                    }}
                  >
                    {atleta.nome}
                  </p>
                </div>

                {/* VS */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: jogo.realizado ? '#1a4d2e' : '#2e312e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: 11,
                      color: '#9dd3aa',
                      letterSpacing: '0.05em',
                    }}
                  >
                    VS
                  </span>
                </div>

                {/* Outros 3 */}
                <div style={{ flex: 2, minWidth: 0, textAlign: 'right' }}>
                  {[jogo.parceiro, ...jogo.adversarios].map(nome => (
                    <p
                      key={nome}
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 600,
                        fontSize: 13,
                        color: '#191c19',
                        marginBottom: 3,
                        lineHeight: 1.2,
                      }}
                    >
                      {nome}
                    </p>
                  ))}
                </div>

                {/* Status */}
                <div style={{ flexShrink: 0 }}>
                  {jogo.realizado ? (
                    <span className="chip-green" style={{ fontSize: 10 }}>Realizado</span>
                  ) : (
                    <span className="chip-pending" style={{ fontSize: 10 }}>Pendente</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
