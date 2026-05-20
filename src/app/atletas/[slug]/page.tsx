import { notFound } from 'next/navigation';
import Link from 'next/link';
import classificacaoM from '@/data/classificacao_ranking.json';
import jogosDataM from '@/data/jogos_ranking.json';
import resultadosMRaw from '@/data/resultados.json';
import rankingBronzeF from '@/data/ranking_feminino.json';
import jogosDataBronzeF from '@/data/jogos_bronze_feminino.json';
import rankingPrataF from '@/data/ranking_prata_feminino.json';
import jogosDataPrataF from '@/data/jogos_prata_feminino.json';
import type { Resultado } from '@/lib/types';

const resultadosM = resultadosMRaw as { resultados: Resultado[] };

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
  const seen = new Set<string>();
  const add = (nome: string) => { seen.add(slugify(nome)); };
  classificacaoM.ranking.forEach(j => add(j.nome));
  rankingBronzeF.atletas.forEach(j => add(j.nome));
  rankingPrataF.atletas.forEach(j => add(j.nome));
  return Array.from(seen).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const nome =
    classificacaoM.ranking.find(j => slugify(j.nome) === slug)?.nome ??
    rankingBronzeF.atletas.find(j => slugify(j.nome) === slug)?.nome ??
    rankingPrataF.atletas.find(j => slugify(j.nome) === slug)?.nome;
  if (!nome) return {};
  return { title: `${nome} · Squadra Verde` };
}

// ── Masculine athlete ──────────────────────────────────────────────────────────

function AtletaMasculino({ atleta }: { atleta: (typeof classificacaoM.ranking)[0] }) {
  const realizadosIds = new Set(
    resultadosM.resultados.filter(r => r.realizado).map(r => r.jogo_id)
  );

  const resultadoMap = new Map(resultadosM.resultados.map(r => [r.jogo_id, r]));

  const jogos = jogosDataM.rodadas.flatMap(rodada =>
    rodada.jogos
      .filter(jogo => jogo.dupla1.includes(atleta.nome) || jogo.dupla2.includes(atleta.nome))
      .map(jogo => {
        const emDupla1 = jogo.dupla1.includes(atleta.nome);
        const parceiro = emDupla1
          ? jogo.dupla1.find(n => n !== atleta.nome)!
          : jogo.dupla2.find(n => n !== atleta.nome)!;
        const adversarios = emDupla1 ? jogo.dupla2 : jogo.dupla1;
        const resultado = resultadoMap.get(jogo.id);
        const realizado = !!resultado?.realizado;
        let placar: string | undefined;
        let vencedores: string[] | undefined;
        if (realizado && resultado?.partidas?.length) {
          const g1 = resultado.partidas.reduce((s, p) => s + p.games1, 0);
          const g2 = resultado.partidas.reduce((s, p) => s + p.games2, 0);
          placar = emDupla1 ? `${g1}/${g2}` : `${g2}/${g1}`;
          vencedores = g1 > g2 ? jogo.dupla1 : jogo.dupla2;
        }
        return { id: jogo.id, horario: jogo.horario, rodada: rodada.rodada, data: rodada.data, parceiro, adversarios, realizado, placar, vencedores };
      })
  );

  const ativo = atleta.jogos > 0;
  const heroBg = ativo ? 'var(--verde-deep)' : 'color-mix(in oklch, var(--ink) 60%, transparent)';
  const accent = 'var(--verde-glow)';

  const stats = [
    { label: 'Jogos',          value: atleta.jogos },
    { label: 'Vitórias',       value: atleta.vitorias },
    { label: 'Derrotas',       value: atleta.derrotas },
    { label: '% Vitórias',     value: `${atleta.percentual_vitorias}%` },
    { label: 'Games Vencidos', value: atleta.games_vencidos },
    { label: 'Games Perdidos', value: atleta.games_perdidos },
    { label: 'Saldo de Games', value: (atleta.saldo_games > 0 ? '+' : '') + atleta.saldo_games, highlight: atleta.saldo_games > 0 ? 'pos' : atleta.saldo_games < 0 ? 'neg' : '' },
  ];

  return <AtletaLayout
    heroBg={heroBg}
    accent={accent}
    accentDim="rgba(157,211,170,0.6)"
    nome={atleta.nome}
    posicao={atleta.posicao}
    categoriaLabel="Ranking Masculino 2026"
    ativo={ativo}
    jogosCount={atleta.jogos}
    stats={stats}
    agenda={jogos}
    accentBar="#00361a"
  />;
}

// ── Feminine athlete (Bronze or Prata) ────────────────────────────────────────

type AtletaFemininoData = (typeof rankingBronzeF.atletas)[0];

function AtletaFeminino({ atleta, categoriaLabel, heroBg, accent, accentDim, accentBar, agenda }: {
  atleta: AtletaFemininoData;
  categoriaLabel: string;
  heroBg: string;
  accent: string;
  accentDim: string;
  accentBar: string;
  agenda: { id: number; horario: string; rodada: number; data: string; parceiro: string; adversarios: string[]; realizado: boolean; placar?: string; vencedores?: string[] }[];
}) {
  const ativo = atleta.jogos > 0;

  const stats = [
    { label: 'Pontos',      value: atleta.pontos },
    { label: 'Jogos',       value: atleta.jogos },
    { label: 'Sets V',      value: atleta.sets_vencidos },
    { label: 'Sets D',      value: atleta.sets_perdidos },
    { label: 'Saldo Sets',  value: (atleta.saldo_sets > 0 ? '+' : '') + atleta.saldo_sets, highlight: atleta.saldo_sets > 0 ? 'pos' : atleta.saldo_sets < 0 ? 'neg' : '' },
    { label: 'Games V',     value: atleta.games_vencidos },
    { label: 'Games D',     value: atleta.games_perdidos },
    { label: 'Saldo Games', value: (atleta.saldo_games > 0 ? '+' : '') + atleta.saldo_games, highlight: atleta.saldo_games > 0 ? 'pos' : atleta.saldo_games < 0 ? 'neg' : '' },
    { label: 'TBs V',       value: atleta.tiebreaks_vencidos },
    { label: 'TBs D',       value: atleta.tiebreaks_perdidos },
    { label: '% Vitórias',  value: `${atleta.percentual}%` },
  ];

  return <AtletaLayout
    heroBg={heroBg}
    accent={accent}
    accentDim={accentDim}
    nome={atleta.nome}
    posicao={atleta.posicao}
    categoriaLabel={categoriaLabel}
    ativo={ativo}
    jogosCount={atleta.jogos}
    stats={stats}
    agenda={agenda}
    accentBar={accentBar}
  />;
}

// ── Shared layout ──────────────────────────────────────────────────────────────

function AtletaLayout({ heroBg, accent, accentDim, nome, posicao, categoriaLabel, ativo, jogosCount, stats, agenda, accentBar }: {
  heroBg: string;
  accent: string;
  accentDim: string;
  nome: string;
  posicao: number;
  categoriaLabel: string;
  ativo: boolean;
  jogosCount: number;
  stats: { label: string; value: string | number; highlight?: string }[];
  agenda: { id: number; horario: string; rodada: number; data: string; parceiro: string; adversarios: string[]; realizado: boolean; placar?: string; vencedores?: string[] }[];
  accentBar: string;
}) {
  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ background: heroBg, position: 'relative', overflow: 'hidden', padding: '72px 0 52px' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="page-head-inner" style={{ position: 'relative' }}>
          <Link
            href="/atletas"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: accentDim,
              textDecoration: 'none',
              marginBottom: 32,
            }}
          >
            ← Atletas
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div
              style={{
                width: 88,
                height: 88,
                background: 'rgba(255,255,255,0.10)',
                border: `2px solid ${accent}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 32,
                color: accent,
                flexShrink: 0,
              }}
            >
              {INITIALS(nome)}
            </div>

            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: accentDim,
                  letterSpacing: '0.1em',
                  marginBottom: 6,
                }}
              >
                #{posicao} · {categoriaLabel}
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 'clamp(28px, 4vw, 48px)',
                  color: 'var(--paper)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  marginBottom: 10,
                }}
              >
                {nome}
              </h1>
              {ativo ? (
                <span
                  style={{
                    display: 'inline-block',
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: accent,
                    background: `${accent}18`,
                    border: `1px solid ${accent}33`,
                    padding: '4px 10px',
                  }}
                >
                  Ativo · {jogosCount} jogo{jogosCount !== 1 ? 's' : ''} disputado{jogosCount !== 1 ? 's' : ''}
                </span>
              ) : (
                <span
                  style={{
                    display: 'inline-block',
                    fontFamily: "var(--font-mono)",
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

      <div className="page-body-inner">

        {/* ── STATS ── */}
        {ativo && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 3, height: 24, background: accentBar }} />
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                Estatísticas
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
              {stats.map(s => (
                <div
                  key={s.label}
                  style={{ background: 'var(--paper)', border: '1px solid var(--line)', padding: '16px 14px', textAlign: 'center' }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 500,
                      fontSize: 22,
                      lineHeight: 1,
                      marginBottom: 6,
                      color: s.highlight === 'pos' ? accentBar : s.highlight === 'neg' ? '#ba1a1a' : 'var(--ink)',
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#717971' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── AGENDA ── */}
        {agenda.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 3, height: 24, background: accentBar }} />
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                Agenda de Jogos
              </h2>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: '#717971' }}>
                {agenda.length} partida{agenda.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {agenda.map(jogo => (
                <div
                  key={jogo.id}
                  style={{
                    background: 'var(--paper)',
                    border: `1px solid ${jogo.realizado ? '#c8e6c9' : 'var(--line)'}`,
                    borderLeft: `3px solid ${jogo.realizado ? accentBar : '#c1c9bf'}`,
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flexShrink: 0, minWidth: 60 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: 13, color: 'var(--ink)', lineHeight: 1 }}>
                      R{jogo.rodada}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: '#717971', marginTop: 3 }}>{jogo.data}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: '#717971' }}>{jogo.horario}</div>
                  </div>

                  <div style={{ width: 1, height: 44, background: 'var(--line)', flexShrink: 0 }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {[nome, jogo.parceiro].map(n => (
                      <p key={n} style={{ fontFamily: "var(--font-display)", fontWeight: n === nome ? 700 : 600, fontSize: n === nome ? 14 : 13, color: jogo.vencedores?.includes(n) ? accentBar : 'color-mix(in oklch, var(--ink) 60%, transparent)', lineHeight: 1.3, marginBottom: 2 }}>
                        {n}
                      </p>
                    ))}
                  </div>

                  <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 48 }}>
                    {jogo.placar ? (
                      <div>
                        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 18, color: accentBar, lineHeight: 1 }}>
                          {jogo.placar}
                        </div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#717971', marginTop: 4 }}>
                          placar
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          width: 36, height: 36, margin: '0 auto',
                          background: jogo.realizado ? heroBg : 'color-mix(in oklch, var(--ink) 60%, transparent)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, color: accent, letterSpacing: '0.05em' }}>
                          VS
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 2, minWidth: 0, textAlign: 'right' }}>
                    {jogo.adversarios.map(n => (
                      <p key={n} style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, color: jogo.vencedores?.includes(n) ? accentBar : 'color-mix(in oklch, var(--ink) 60%, transparent)', marginBottom: 3, lineHeight: 1.2 }}>
                        {n}
                      </p>
                    ))}
                  </div>

                  <div style={{ flexShrink: 0 }}>
                    {jogo.realizado
                      ? <span className="chip-green" style={{ fontSize: 10 }}>✓</span>
                      : <span className="chip-pending" style={{ fontSize: 10 }}>Pendente</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {agenda.length === 0 && !ativo && (
          <div style={{ padding: 40, textAlign: 'center', border: '1px solid var(--line)', background: 'var(--paper)' }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 16, color: '#717971' }}>
              Nenhum jogo registrado ainda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page entry ─────────────────────────────────────────────────────────────────

export default async function AtletaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Masculine
  const atletaM = classificacaoM.ranking.find(j => slugify(j.nome) === slug);
  if (atletaM) return <AtletaMasculino atleta={atletaM} />;

  // Feminine Bronze
  const atletaBF = rankingBronzeF.atletas.find(j => slugify(j.nome) === slug);
  if (atletaBF) {
    const agenda = jogosDataBronzeF.rodadas.flatMap(rodada =>
      rodada.jogos
        .filter(jogo => jogo.dupla1.includes(atletaBF.nome) || jogo.dupla2.includes(atletaBF.nome))
        .map(jogo => {
          const emDupla1 = jogo.dupla1.includes(atletaBF.nome);
          const parceiro = emDupla1
            ? jogo.dupla1.find(n => n !== atletaBF.nome)!
            : jogo.dupla2.find(n => n !== atletaBF.nome)!;
          return {
            id: jogo.jogo,
            horario: '',
            rodada: rodada.rodada,
            data: rodada.data,
            parceiro,
            adversarios: emDupla1 ? jogo.dupla2 : jogo.dupla1,
            realizado: jogo.status === 'Finalizado',
          };
        })
    );
    return (
      <div className="theme-fem">
        <AtletaFeminino
          atleta={atletaBF}
          categoriaLabel="Ranking Feminino Bronze 2026"
          heroBg="var(--bronze-deep)"
          accent="var(--bronze-light)"
          accentDim="color-mix(in oklch, var(--bronze-light) 55%, transparent)"
          accentBar="var(--bronze)"
          agenda={agenda}
        />
      </div>
    );
  }

  // Feminine Prata
  const atletaPF = rankingPrataF.atletas.find(j => slugify(j.nome) === slug);
  if (atletaPF) {
    const agendaPrata = jogosDataPrataF.rodadas.flatMap(rodada =>
      rodada.jogos
        .filter(jogo => jogo.dupla1.includes(atletaPF.nome) || jogo.dupla2.includes(atletaPF.nome))
        .map(jogo => {
          const emDupla1 = jogo.dupla1.includes(atletaPF.nome);
          const parceiro = emDupla1
            ? jogo.dupla1.find(n => n !== atletaPF.nome)!
            : jogo.dupla2.find(n => n !== atletaPF.nome)!;
          const realizado = jogo.status === 'Finalizado';
          const placar = realizado && 'placar' in jogo ? (jogo as { placar?: string }).placar : undefined;
          const vencedores = realizado && 'vencedoras' in jogo ? (jogo as { vencedoras?: string[] }).vencedoras : undefined;
          return {
            id: jogo.id,
            horario: '',
            rodada: rodada.rodada,
            data: rodada.data,
            parceiro,
            adversarios: emDupla1 ? jogo.dupla2 : jogo.dupla1,
            realizado,
            placar,
            vencedores,
          };
        })
    );
    return (
      <div className="theme-fem">
        <AtletaFeminino
          atleta={atletaPF}
          categoriaLabel="Ranking Feminino Prata 2026"
          heroBg="oklch(0.26 0.014 232)"
          accent="var(--prata-light)"
          accentDim="color-mix(in oklch, var(--prata-light) 55%, transparent)"
          accentBar="var(--prata-deep)"
          agenda={agendaPrata}
        />
      </div>
    );
  }

  notFound();
}
