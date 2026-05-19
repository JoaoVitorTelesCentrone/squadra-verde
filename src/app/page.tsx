import Link from 'next/link';
import classificacao from '@/data/classificacao_ranking.json';
import jogosData from '@/data/jogos_ranking.json';
import resultadosRaw from '@/data/resultados.json';
import rankingBronzeF from '@/data/ranking_feminino.json';
import rankingPrataF from '@/data/ranking_prata_feminino.json';
import jogosBronzeF from '@/data/jogos_bronze_feminino.json';
import jogosPrataF from '@/data/jogos_prata_feminino.json';
import resultadosFRaw from '@/data/resultados_feminino.json';
import lancesData from '@/data/lances.json';
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

const RANK_BG: Record<number, string> = {
  1: 'var(--verde-escuro)',
  2: 'var(--verde-campo)',
  3: '#3a5c3a',
};

const BRONZE_BG: Record<number, string> = {
  1: '#2a1f14',
  2: '#4a3828',
  3: '#7a6a5a',
};

const PRATA_BG: Record<number, string> = {
  1: '#1a3055',
  2: '#1f4a6e',
  3: '#3d7a9a',
};

export default function HomePage() {
  const top3M = classificacao.ranking.slice(0, 3);
  const top3B = rankingBronzeF.atletas.slice(0, 3);
  const top3P = rankingPrataF.atletas.slice(0, 3);
  const proximoM = getProximoJogoM();
  const proximoBronze = getProximoJogoBronze();
  const proximoPrata = getProximoJogoPrata();
  const ultimosLances = lancesData.lances.slice(0, 4);
  const jogosRealizados = resultados.resultados.filter(r => r.realizado).length;

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--verde-escuro)', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div className="hero-decorative" style={{ position: 'absolute', right: '6%', top: '50%', transform: 'translateY(-50%)', width: 280, height: 280, border: '1px solid rgba(79,140,79,0.2)', pointerEvents: 'none' }} />
        <div className="hero-decorative" style={{ position: 'absolute', right: '8%', top: '50%', transform: 'translateY(-50%)', width: 200, height: 200, border: '1px solid rgba(79,140,79,0.12)', pointerEvents: 'none' }} />

        <div className="hero-inner" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28 }} className="animate-fade-up anim-delay-1">
            <div style={{ width: 20, height: 1, background: 'var(--verde-medio)' }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--verde-medio)' }}>Temporada 2026</span>
          </div>

          <h1
            style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 'clamp(36px, 7vw, 80px)', lineHeight: 0.88, color: 'var(--creme)', letterSpacing: '-0.03em', textTransform: 'uppercase', maxWidth: 600, marginBottom: 24 }}
            className="animate-fade-up anim-delay-2"
          >
            SQUADRA<br />
            <span style={{ color: 'var(--verde-medio)' }}>VERDE</span>
          </h1>

          <p
            style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: '0.25em', color: 'rgba(245,239,230,0.45)', textTransform: 'uppercase', marginBottom: 40, lineHeight: 1.8 }}
            className="animate-fade-up anim-delay-3"
          >
            Beach Tênis · Masculino · Feminino Bronze · Feminino Prata
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }} className="animate-fade-up anim-delay-4">
            <Link href="/ranking" className="btn-primary">Classificação</Link>
            <Link href="/jogos" className="btn-ghost" style={{ color: 'var(--creme)', borderColor: 'rgba(245,239,230,0.25)' }}>Ver Jogos</Link>
          </div>

          <div style={{ display: 'flex', gap: 40, marginTop: 60, paddingTop: 28, borderTop: '1px solid rgba(79,140,79,0.2)', flexWrap: 'wrap' }} className="animate-fade-up anim-delay-5 stats-bar">
            {[
              { value: '3', label: 'Rankings' },
              { value: jogosRealizados, label: 'Jogos Realizados' },
              { value: 78, label: 'Atletas' },
              { value: classificacao.atualizado_em, label: 'Atualizado em' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 26, color: 'var(--creme)', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--verde-medio)', marginTop: 6, opacity: 0.8 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LÍDERES MASCULINO ────────────────────────────────────────────────── */}
      <section className="page-body-inner" style={{ paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 8 }}>Ranking Masculino</p>
            <h2 style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 'clamp(20px, 3vw, 28px)', color: 'var(--preto)', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>Líderes</h2>
          </div>
          <Link href="/ranking" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--verde-campo)', textDecoration: 'none' }}>Ver Todos →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 2 }}>
          {top3M.map(j => (
            <div key={j.posicao} style={{ background: RANK_BG[j.posicao], padding: '32px 28px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -8, top: -16, fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 110, color: 'rgba(255,255,255,0.05)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>{j.posicao}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--creme)' }}>{j.posicao}</span>
                </div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.3em', color: 'var(--amarelo)', textTransform: 'uppercase', opacity: 0.8 }}>
                  {j.posicao === 1 ? 'Líder' : `${j.posicao}º lugar`}
                </span>
              </div>
              <h3 style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--creme)', textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 20, lineHeight: 1.2 }}>{j.nome}</h3>
              <div style={{ display: 'flex', gap: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {[
                  { v: `${j.percentual_vitorias}%`, l: 'Vitórias' },
                  { v: j.saldo_games > 0 ? `+${j.saldo_games}` : String(j.saldo_games), l: 'Saldo' },
                  { v: `${j.vitorias}/${j.jogos}`, l: 'V/J' },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--creme)', lineHeight: 1 }}>{s.v}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--verde-medio)', marginTop: 4, opacity: 0.7 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LÍDERES FEMININO BRONZE ──────────────────────────────────────────── */}
      <section className="page-body-inner" style={{ paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 8, color: '#7a6a5a' }}>Ranking Feminino</p>
            <h2 style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 'clamp(20px, 3vw, 28px)', color: 'var(--preto)', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>Bronze</h2>
          </div>
          <Link href="/feminino" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a6a5a', textDecoration: 'none' }}>Ver Todas →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 2 }}>
          {top3B.map(a => (
            <div key={a.posicao} style={{ background: BRONZE_BG[a.posicao as 1|2|3] ?? '#7a6a5a', padding: '32px 28px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -8, top: -16, fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 110, color: 'rgba(255,255,255,0.05)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>{a.posicao}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 14, color: '#e8ddd0' }}>{a.posicao}</span>
                </div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.3em', color: '#e8ddd0', textTransform: 'uppercase', opacity: 0.8 }}>
                  {a.posicao === 1 ? 'Líder' : `${a.posicao}º lugar`}
                </span>
              </div>
              <h3 style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 16, color: '#f4f0eb', textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 20, lineHeight: 1.2 }}>{a.nome}</h3>
              <div style={{ display: 'flex', gap: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {[
                  { v: `${a.pontos}`, l: 'Pontos' },
                  { v: `${a.percentual}%`, l: 'Aprov.' },
                  { v: a.saldo_games > 0 ? `+${a.saldo_games}` : String(a.saldo_games), l: 'Saldo G' },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 18, color: '#f4f0eb', lineHeight: 1 }}>{s.v}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e8ddd0', marginTop: 4, opacity: 0.6 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LÍDERES FEMININO PRATA ───────────────────────────────────────────── */}
      <section className="page-body-inner" style={{ paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 8, color: '#3d7a9a' }}>Ranking Feminino</p>
            <h2 style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 'clamp(20px, 3vw, 28px)', color: 'var(--preto)', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>Prata</h2>
          </div>
          <Link href="/feminino" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3d7a9a', textDecoration: 'none' }}>Ver Todas →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 2 }}>
          {top3P.map(a => (
            <div key={a.posicao} style={{ background: PRATA_BG[a.posicao as 1|2|3] ?? '#3d7a9a', padding: '32px 28px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -8, top: -16, fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 110, color: 'rgba(255,255,255,0.05)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>{a.posicao}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 14, color: '#a8c8d8' }}>{a.posicao}</span>
                </div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.3em', color: '#a8c8d8', textTransform: 'uppercase', opacity: 0.8 }}>
                  {a.posicao === 1 ? 'Líder' : `${a.posicao}º lugar`}
                </span>
              </div>
              <h3 style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 16, color: '#d8eaf2', textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 20, lineHeight: 1.2 }}>{a.nome}</h3>
              <div style={{ display: 'flex', gap: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {[
                  { v: `${a.pontos}`, l: 'Pontos' },
                  { v: `${a.percentual}%`, l: 'Aprov.' },
                  { v: a.saldo_games > 0 ? `+${a.saldo_games}` : String(a.saldo_games), l: 'Saldo G' },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 18, color: '#d8eaf2', lineHeight: 1 }}>{s.v}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a8c8d8', marginTop: 4, opacity: 0.6 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRÓXIMOS JOGOS ───────────────────────────────────────────────────── */}
      <section className="page-body-inner" style={{ paddingBottom: 0 }}>
        <p className="section-label" style={{ marginBottom: 8 }}>Agenda</p>
        <h2 style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 'clamp(18px, 2.5vw, 24px)', color: 'var(--preto)', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
          Próximos Jogos
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 16, marginBottom: 14 }}>

          {/* Masculino */}
          {proximoM ? (
            <div style={{ border: '1px solid var(--preto)', background: 'var(--branco)', padding: '24px', boxShadow: '3px 3px 0 var(--preto)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid var(--creme-escuro)' }}>
                <span className="chip">Masculino · Rd {proximoM.rodada}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(15,26,15,0.45)', letterSpacing: '0.05em' }}>{proximoM.data} · {proximoM.horario}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  {proximoM.dupla1.map(n => <p key={n} style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 11, color: 'var(--preto)', marginBottom: 3, textTransform: 'uppercase', lineHeight: 1.2 }}>{n}</p>)}
                </div>
                <div style={{ padding: '7px 11px', background: 'var(--verde-escuro)' }}>
                  <span style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 9, color: 'var(--creme)', letterSpacing: '0.08em' }}>VS</span>
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  {proximoM.dupla2.map(n => <p key={n} style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 11, color: 'var(--preto)', marginBottom: 3, textTransform: 'uppercase', lineHeight: 1.2 }}>{n}</p>)}
                </div>
              </div>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--creme-escuro)', display: 'flex', justifyContent: 'flex-end' }}>
                <span className="chip-pending">Aguardando</span>
              </div>
            </div>
          ) : (
            <div style={{ border: '1px solid var(--creme-escuro)', padding: 24, background: 'var(--creme-escuro)', textAlign: 'center' }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(15,26,15,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Masculino · Encerrado</span>
            </div>
          )}

          {/* Feminino Bronze */}
          {proximoBronze ? (
            <div style={{ border: '1px solid #2a1f14', background: '#faf7f2', padding: '24px', boxShadow: '3px 3px 0 #2a1f14' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid #e8ddd0' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a6a5a', background: '#e8ddd0', padding: '4px 10px' }}>F Bronze · Rd {proximoBronze.rodada}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(42,31,20,0.4)', letterSpacing: '0.05em' }}>{formatData(proximoBronze.data)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  {proximoBronze.dupla1.map(n => <p key={n} style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 11, color: '#2a1f14', marginBottom: 3, textTransform: 'uppercase', lineHeight: 1.2 }}>{n}</p>)}
                </div>
                <div style={{ padding: '7px 11px', background: '#2a1f14' }}>
                  <span style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 9, color: '#e8ddd0', letterSpacing: '0.08em' }}>VS</span>
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  {proximoBronze.dupla2.map(n => <p key={n} style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 11, color: '#2a1f14', marginBottom: 3, textTransform: 'uppercase', lineHeight: 1.2 }}>{n}</p>)}
                </div>
              </div>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #e8ddd0', display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a6a5a', border: '1px solid #e8ddd0', padding: '4px 10px' }}>Aguardando</span>
              </div>
            </div>
          ) : (
            <div style={{ border: '1px solid #e8ddd0', padding: 24, background: '#f4f0eb', textAlign: 'center' }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(42,31,20,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>F Bronze · Encerrado</span>
            </div>
          )}

          {/* Feminino Prata */}
          {proximoPrata ? (
            <div style={{ border: '1px solid #1a3055', background: '#f0f6f9', padding: '24px', boxShadow: '3px 3px 0 #1a3055' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid #a8c8d8' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#3d7a9a', background: '#d8eaf2', padding: '4px 10px' }}>F Prata · Rd {proximoPrata.rodada}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(26,48,85,0.4)', letterSpacing: '0.05em' }}>{formatData(proximoPrata.data)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  {proximoPrata.dupla1.map(n => <p key={n} style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 11, color: '#1a3055', marginBottom: 3, textTransform: 'uppercase', lineHeight: 1.2 }}>{n}</p>)}
                </div>
                <div style={{ padding: '7px 11px', background: '#1a3055' }}>
                  <span style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 9, color: '#a8c8d8', letterSpacing: '0.08em' }}>VS</span>
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  {proximoPrata.dupla2.map(n => <p key={n} style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 11, color: '#1a3055', marginBottom: 3, textTransform: 'uppercase', lineHeight: 1.2 }}>{n}</p>)}
                </div>
              </div>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #a8c8d8', display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#3d7a9a', border: '1px solid #a8c8d8', padding: '4px 10px' }}>Aguardando</span>
              </div>
            </div>
          ) : (
            <div style={{ border: '1px solid #a8c8d8', padding: 24, background: '#d8eaf2', textAlign: 'center' }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(26,48,85,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>F Prata · Encerrado</span>
            </div>
          )}
        </div>

        <Link href="/jogos" className="btn-ghost" style={{ display: 'flex', justifyContent: 'center' }}>Ver Agenda Completa</Link>
      </section>

      {/* ── LANCES ───────────────────────────────────────────────────────────── */}
      <section className="page-body-inner" style={{ paddingBottom: 0 }}>
        <p className="section-label" style={{ marginBottom: 8 }}>Highlights</p>
        <h2 style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 'clamp(18px, 2.5vw, 24px)', color: 'var(--preto)', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Últimos Lances</h2>
        <div className="lances-mini-grid">
          {ultimosLances.map(lance => (
            <Link
              key={lance.id}
              href="/lances"
              style={{ textDecoration: 'none', display: 'block', position: 'relative', border: '1px solid var(--preto)', overflow: 'hidden', aspectRatio: '4/3', background: 'var(--verde-escuro)', boxShadow: '2px 2px 0 var(--preto)' }}
            >
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(79,140,79,0.2), transparent 60%)' }} />
              <div style={{ position: 'absolute', top: 8, left: 8 }}>
                <span className="chip-green" style={{ fontSize: 8 }}>{lance.tipo}</span>
              </div>
              {lance.midia_tipo === 'video' && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 32, height: 32, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="10" height="12" viewBox="0 0 12 14" fill="none"><path d="M1 1l10 6-10 6V1z" fill="white"/></svg>
                </div>
              )}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 10px', background: 'rgba(15,26,15,0.75)' }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500, fontSize: 10, color: 'var(--creme)', lineHeight: 1.2, marginBottom: 2 }}>{lance.titulo}</p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(245,239,230,0.45)', letterSpacing: '0.05em' }}>{lance.jogador}</p>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <Link href="/lances" className="btn-primary" style={{ display: 'flex', justifyContent: 'center' }}>Todos os Lances</Link>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div style={{ background: 'var(--verde-escuro)', border: '1px solid rgba(255,255,255,0.06)', padding: '48px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--verde-medio)', marginBottom: 10, opacity: 0.8 }}>Squadra Verde · Temporada 2026</p>
            <h2 style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 'clamp(20px, 3vw, 28px)', color: 'var(--creme)', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>Explore Todos os Rankings</h2>
          </div>
          <div style={{ display: 'flex', gap: 10, position: 'relative', flexWrap: 'wrap' }}>
            <Link href="/ranking" className="btn-primary" style={{ background: 'var(--amarelo)', color: 'var(--preto)', borderColor: 'var(--amarelo)' }}>Masculino</Link>
            <Link href="/feminino" className="btn-ghost" style={{ color: 'var(--creme)', borderColor: 'rgba(245,239,230,0.25)' }}>Feminino</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
