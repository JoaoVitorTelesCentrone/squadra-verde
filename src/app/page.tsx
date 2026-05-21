import Link from 'next/link';
import jogosData from '@/data/jogos_ranking.json';
import resultadosRaw from '@/data/resultados.json';
import jogosDataBronzeF from '@/data/jogos_ranking_feminino.json';
import rankingPrataF from '@/data/ranking_prata_feminino.json';
import jogosBronzeF from '@/data/jogos_bronze_feminino.json';
import jogosPrataF from '@/data/jogos_prata_feminino.json';
import resultadosFRaw from '@/data/resultados_feminino.json';
import { calcularClassificacao } from '@/lib/calcularClassificacao';
import type { Resultado } from '@/lib/types';

const resultados = resultadosRaw as { resultados: Resultado[] };
const resultadosF = resultadosFRaw as { resultados: { jogo_id: number; realizado: boolean }[] };

function formatData(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getProximoJogoM() {
  const realizados = new Set(resultados.resultados.filter(r => r.realizado).map(r => r.jogo_id));
  for (const rodada of jogosData.rodadas) {
    for (const jogo of rodada.jogos) {
      if (!realizados.has(jogo.id)) return { ...jogo, rodada: rodada.rodada, data: rodada.data };
    }
  }
  return null;
}

function getProximoJogoBronze() {
  const realizados = new Set(resultadosF.resultados.filter(r => r.realizado).map(r => r.jogo_id));
  for (const rodada of jogosBronzeF.rodadas) {
    for (const jogo of rodada.jogos) {
      if (!realizados.has(jogo.jogo)) return { dupla1: jogo.dupla1, dupla2: jogo.dupla2, rodada: rodada.rodada, data: rodada.data };
    }
  }
  return null;
}

function getProximoJogoPrata() {
  for (const rodada of jogosPrataF.rodadas) {
    for (const jogo of rodada.jogos) {
      if (jogo.status === 'Pendente') return { dupla1: jogo.dupla1, dupla2: jogo.dupla2, rodada: rodada.rodada, data: rodada.data };
    }
  }
  return null;
}

export default function HomePage() {
  const allJogosM = jogosData.rodadas.flatMap(r => r.jogos);
  const top3M = calcularClassificacao(allJogosM, resultados.resultados as Resultado[]).slice(0, 3);
  const allJogosBronzeF = jogosDataBronzeF.rodadas.flatMap(r => r.jogos);
  const top3B = calcularClassificacao(allJogosBronzeF, resultadosF.resultados as Resultado[]).slice(0, 3);
  const top3P = rankingPrataF.atletas.slice(0, 3);
  const proximoM = getProximoJogoM();
  const proximoBronze = getProximoJogoBronze();
  const proximoPrata = getProximoJogoPrata();
  const jogosRealizados = resultados.resultados.filter(r => r.realizado).length;

  return (
    <div>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-inner">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }} className="animate-fade-up anim-delay-1">
            <div style={{ width: 24, height: 1, background: 'var(--verde-glow)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--verde-glow)' }}>
              Temporada 2026
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(56px, 11vw, 160px)',
              lineHeight: 0.9,
              color: 'var(--paper)',
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              maxWidth: 700,
              marginBottom: 20,
            }}
            className="animate-fade-up anim-delay-2"
          >
            SQUADRA<br />
            <span style={{ color: 'var(--verde-glow)' }}>VERDE</span>
          </h1>

          <p
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.3em', color: 'color-mix(in oklch, var(--paper) 50%, transparent)', textTransform: 'uppercase', marginBottom: 40, lineHeight: 2 }}
            className="animate-fade-up anim-delay-3"
          >
            Beach Tênis · Masculino · Feminino Bronze · Feminino Prata
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }} className="animate-fade-up anim-delay-4">
            <Link href="/ranking" className="btn-accent">Classificação</Link>
            <Link href="/jogos" className="btn-hero">Ver Jogos</Link>
          </div>

          {/* Stat strip */}
          <div
            className="animate-fade-up anim-delay-5 stats-bar"
            style={{ display: 'flex', gap: 40, marginTop: 64, paddingTop: 28, borderTop: '1px solid color-mix(in oklch, var(--paper) 12%, transparent)', flexWrap: 'wrap' }}
          >
            {[
              { value: '3',              label: 'Rankings' },
              { value: jogosRealizados,  label: 'Jogos Realizados' },
              { value: 78,               label: 'Atletas' },
              { value: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), label: 'Atualizado em' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color: 'var(--paper)', lineHeight: 1, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{stat.value}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--paper) 45%, transparent)', marginTop: 8 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LÍDERES MASCULINO ── */}
      <section className="page-body-inner" style={{ paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 8 }}>Ranking Masculino</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(24px, 3.5vw, 40px)', color: 'var(--ink)', letterSpacing: '-0.03em', textTransform: 'uppercase' }}>Líderes</h2>
          </div>
          <Link href="/ranking" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--line)' }}>Ver Todos →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 12 }}>
          {top3M.map((j, idx) => {
            const bgs = ['var(--ink)', 'var(--verde-deep)', 'var(--verde)'];
            const colors = ['var(--paper)', 'var(--paper)', 'oklch(0.15 0.03 158)'];
            return (
              <div key={j.posicao} style={{ background: bgs[idx] ?? 'var(--verde)', padding: '28px 24px', position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
                <div style={{ position: 'absolute', right: -8, top: -16, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 110, color: 'rgba(255,255,255,0.06)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.04em' }}>{j.posicao}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ background: 'color-mix(in oklch, currentColor 15%, transparent)', border: '1px solid color-mix(in oklch, currentColor 25%, transparent)', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: colors[idx] }}>{j.posicao}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.3em', color: 'var(--citrino)', textTransform: 'uppercase', opacity: 0.9 }}>
                    {j.posicao === 1 ? 'Líder' : `${j.posicao}º lugar`}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: colors[idx], textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 20, lineHeight: 1.1 }}>{j.nome}</h3>
                <div style={{ display: 'flex', gap: 20, paddingTop: 16, borderTop: '1px solid color-mix(in oklch, currentColor 15%, transparent)' }}>
                  {[
                    { v: `${j.percentual_vitorias}%`, l: 'Vitórias' },
                    { v: j.saldo_games > 0 ? `+${j.saldo_games}` : String(j.saldo_games), l: 'Saldo' },
                    { v: `${j.vitorias}/${j.jogos}`, l: 'V/J' },
                  ].map(s => (
                    <div key={s.l}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: colors[idx], lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{s.v}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'color-mix(in oklch, currentColor 50%, transparent)', marginTop: 6 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── LÍDERES FEMININO BRONZE ── */}
      <section className="page-body-inner" style={{ paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 8, color: 'var(--bronze)' }}>Ranking Feminino</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(24px, 3.5vw, 40px)', color: 'var(--ink)', letterSpacing: '-0.03em', textTransform: 'uppercase' }}>Bronze</h2>
          </div>
          <Link href="/feminino" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--bronze)', textDecoration: 'none', borderBottom: '1px solid var(--bronze)' }}>Ver Todas →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 12 }}>
          {top3B.map((a, idx) => {
            const bgs = ['var(--ink)', 'var(--bronze-deep)', 'var(--bronze)'];
            const textColor = idx === 2 ? 'oklch(0.15 0.02 60)' : 'var(--paper)';
            return (
              <div key={a.posicao} style={{ background: bgs[idx] ?? 'var(--bronze)', padding: '28px 24px', position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
                <div style={{ position: 'absolute', right: -8, top: -16, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 110, color: 'rgba(255,255,255,0.06)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>{a.posicao}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--bronze-light)' }}>{a.posicao}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.3em', color: 'var(--bronze-light)', textTransform: 'uppercase' }}>
                    {a.posicao === 1 ? 'Líder' : `${a.posicao}ª lugar`}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: textColor, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 20, lineHeight: 1.1 }}>{a.nome}</h3>
                <div style={{ display: 'flex', gap: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                  {[
                    { v: `${a.percentual_vitorias}%`, l: 'Vitórias' },
                    { v: a.saldo_games > 0 ? `+${a.saldo_games}` : String(a.saldo_games), l: 'Saldo' },
                    { v: `${a.vitorias}/${a.jogos}`, l: 'V/J' },
                  ].map(s => (
                    <div key={s.l}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: textColor, lineHeight: 1 }}>{s.v}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── LÍDERES FEMININO PRATA ── */}
      <section className="page-body-inner" style={{ paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 8, color: 'var(--azul)' }}>Ranking Feminino</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(24px, 3.5vw, 40px)', color: 'var(--ink)', letterSpacing: '-0.03em', textTransform: 'uppercase' }}>Prata</h2>
          </div>
          <Link href="/feminino" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--azul)', textDecoration: 'none', borderBottom: '1px solid var(--azul)' }}>Ver Todas →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 12 }}>
          {top3P.map((a, idx) => {
            const bgs = ['var(--azul-night)', 'var(--azul-deep)', 'var(--azul)'];
            return (
              <div key={a.posicao} style={{ background: bgs[idx] ?? 'var(--azul)', padding: '28px 24px', position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
                <div style={{ position: 'absolute', right: -8, top: -16, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 110, color: 'rgba(255,255,255,0.06)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>{a.posicao}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--prata-light)' }}>{a.posicao}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.3em', color: 'var(--prata-light)', textTransform: 'uppercase' }}>
                    {a.posicao === 1 ? 'Líder' : `${a.posicao}ª lugar`}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--paper)', textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 20, lineHeight: 1.1 }}>{a.nome}</h3>
                <div style={{ display: 'flex', gap: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                  {[
                    { v: `${a.pontos}`, l: 'Pontos' },
                    { v: `${a.percentual}%`, l: 'Aprov.' },
                    { v: a.saldo_games > 0 ? `+${a.saldo_games}` : String(a.saldo_games), l: 'Saldo G' },
                  ].map(s => (
                    <div key={s.l}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--paper)', lineHeight: 1 }}>{s.v}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── PRÓXIMOS JOGOS ── */}
      <section style={{ background: 'var(--ink)', padding: '48px 0', marginTop: 48 }}>
        <div className="page-head-inner">
          <p className="section-label" style={{ marginBottom: 8, color: 'var(--verde-glow)' }}>Agenda</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(20px, 3vw, 32px)', color: 'var(--paper)', marginBottom: 28, textTransform: 'uppercase', letterSpacing: '-0.03em' }}>
            Próximos Jogos
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 12, marginBottom: 24 }}>

            {/* Masculino */}
            {proximoM ? (
              <div style={{ background: 'var(--verde-deep)', padding: 24, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -8, top: -12, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 90, color: 'rgba(255,255,255,0.04)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>M</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--verde-deep)', background: 'var(--verde-glow)', padding: '5px 12px', borderRadius: 2 }}>Masculino · Rd {proximoM.rodada}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.05em' }}>{proximoM.data} · {proximoM.horario}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    {proximoM.dupla1.map(n => <p key={n} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--paper)', marginBottom: 4, textTransform: 'uppercase', lineHeight: 1.2 }}>{n}</p>)}
                  </div>
                  <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 2, flexShrink: 0 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 10, color: 'var(--verde-glow)', letterSpacing: '0.1em' }}>VS</span>
                  </div>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    {proximoM.dupla2.map(n => <p key={n} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--paper)', marginBottom: 4, textTransform: 'uppercase', lineHeight: 1.2 }}>{n}</p>)}
                  </div>
                </div>
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.70)', border: '1px solid rgba(255,255,255,0.35)', padding: '5px 12px', borderRadius: 2 }}>Aguardando</span>
                </div>
              </div>
            ) : (
              <div style={{ padding: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', borderRadius: 2 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Masculino · Encerrado</span>
              </div>
            )}

            {/* Feminino Bronze */}
            {proximoBronze ? (
              <div style={{ background: 'var(--bronze-deep)', padding: 24, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -8, top: -12, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 90, color: 'rgba(255,255,255,0.04)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>B</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--bronze-deep)', background: 'var(--bronze-light)', padding: '5px 12px', borderRadius: 2 }}>F Bronze · Rd {proximoBronze.rodada}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.05em' }}>{formatData(proximoBronze.data)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    {proximoBronze.dupla1.map(n => <p key={n} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--paper)', marginBottom: 4, textTransform: 'uppercase', lineHeight: 1.2 }}>{n}</p>)}
                  </div>
                  <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 2, flexShrink: 0 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 10, color: 'var(--bronze-light)', letterSpacing: '0.1em' }}>VS</span>
                  </div>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    {proximoBronze.dupla2.map(n => <p key={n} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--paper)', marginBottom: 4, textTransform: 'uppercase', lineHeight: 1.2 }}>{n}</p>)}
                  </div>
                </div>
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.70)', border: '1px solid rgba(255,255,255,0.35)', padding: '5px 12px', borderRadius: 2 }}>Aguardando</span>
                </div>
              </div>
            ) : (
              <div style={{ padding: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', borderRadius: 2 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>F Bronze · Encerrado</span>
              </div>
            )}

            {/* Feminino Prata */}
            {proximoPrata ? (
              <div style={{ background: 'oklch(0.26 0.014 232)', padding: 24, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -8, top: -12, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 90, color: 'rgba(255,255,255,0.04)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>P</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'oklch(0.26 0.014 232)', background: 'var(--prata-light)', padding: '5px 12px', borderRadius: 2 }}>F Prata · Rd {proximoPrata.rodada}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.05em' }}>{formatData(proximoPrata.data)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    {proximoPrata.dupla1.map(n => <p key={n} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--paper)', marginBottom: 4, textTransform: 'uppercase', lineHeight: 1.2 }}>{n}</p>)}
                  </div>
                  <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 2, flexShrink: 0 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 10, color: 'var(--prata-light)', letterSpacing: '0.1em' }}>VS</span>
                  </div>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    {proximoPrata.dupla2.map(n => <p key={n} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--paper)', marginBottom: 4, textTransform: 'uppercase', lineHeight: 1.2 }}>{n}</p>)}
                  </div>
                </div>
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.70)', border: '1px solid rgba(255,255,255,0.35)', padding: '5px 12px', borderRadius: 2 }}>Aguardando</span>
                </div>
              </div>
            ) : (
              <div style={{ padding: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', borderRadius: 2 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>F Prata · Encerrado</span>
              </div>
            )}
          </div>

          <Link href="/jogos" className="btn-hero">Ver Agenda Completa →</Link>
        </div>
      </section>

{/* ── CTA ── */}
      <section className="cta-section" style={{ marginBottom: 0, paddingBottom: 48 }}>
        <div style={{ background: 'var(--ink)', padding: '48px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'var(--hero-pattern)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--verde-glow)', marginBottom: 10, opacity: 0.9 }}>Squadra Verde · Temporada 2026</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(22px, 3vw, 36px)', color: 'var(--paper)', letterSpacing: '-0.03em', textTransform: 'uppercase' }}>Explore Todos os Rankings</h2>
          </div>
          <div style={{ display: 'flex', gap: 10, position: 'relative', flexWrap: 'wrap' }}>
            <Link href="/ranking" className="btn-accent">Masculino</Link>
            <Link href="/feminino" className="btn-hero">Feminino</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
