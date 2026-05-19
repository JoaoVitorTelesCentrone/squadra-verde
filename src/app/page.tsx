import Link from 'next/link';
import classificacao from '@/data/classificacao_ranking.json';
import jogosData from '@/data/jogos_ranking.json';
import resultadosRaw from '@/data/resultados.json';
import type { Resultado } from '@/lib/types';
const resultados = resultadosRaw as { resultados: Resultado[] };
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

const RANK_BG: Record<number, string> = {
  1: 'var(--verde-escuro)',
  2: 'var(--verde-campo)',
  3: '#3a5c3a',
};

export default function HomePage() {
  const top3 = classificacao.ranking.slice(0, 3);
  const proximoJogo = getProximoJogo();
  const ultimosLances = lancesData.lances.slice(0, 4);
  const jogosRealizados = resultados.resultados.filter(r => r.realizado).length;

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--verde-escuro)', display: 'flex', alignItems: 'center' }}>
        {/* Dot pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        {/* Accent square */}
        <div style={{ position: 'absolute', right: '6%', top: '50%', transform: 'translateY(-50%)', width: 280, height: 280, border: '1px solid rgba(79,140,79,0.2)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: '8%', top: '50%', transform: 'translateY(-50%)', width: 200, height: 200, border: '1px solid rgba(79,140,79,0.12)', pointerEvents: 'none' }} />

        <div className="hero-inner" style={{ position: 'relative', zIndex: 1, width: '100%' }}>

          {/* Eyebrow */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28 }} className="animate-fade-up anim-delay-1">
            <div style={{ width: 20, height: 1, background: 'var(--verde-medio)' }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--verde-medio)' }}>
              Temporada 2025
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 'clamp(36px, 7vw, 80px)', lineHeight: 0.88, color: 'var(--creme)', letterSpacing: '-0.03em', textTransform: 'uppercase', maxWidth: 600, marginBottom: 24 }}
            className="animate-fade-up anim-delay-2"
          >
            SQUADRA<br />
            <span style={{ color: 'var(--verde-medio)' }}>VERDE</span>
          </h1>

          {/* Sub */}
          <p
            style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: '0.25em', color: 'rgba(245,239,230,0.45)', textTransform: 'uppercase', marginBottom: 40, lineHeight: 1.8 }}
            className="animate-fade-up anim-delay-3"
          >
            Beach Tênis · Masculino · Feminino Bronze · Feminino Prata
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }} className="animate-fade-up anim-delay-4">
            <Link href="/ranking" className="btn-primary">
              Classificação
            </Link>
            <Link href="/jogos" className="btn-ghost" style={{ color: 'var(--creme)', borderColor: 'rgba(245,239,230,0.25)' }}>
              Ver Jogos
            </Link>
          </div>

          {/* Stats bar */}
          <div
            style={{ display: 'flex', gap: 40, marginTop: 60, paddingTop: 28, borderTop: '1px solid rgba(79,140,79,0.2)', flexWrap: 'wrap' }}
            className="animate-fade-up anim-delay-5 stats-bar"
          >
            {[
              { value: '3',               label: 'Rankings' },
              { value: jogosRealizados,   label: 'Jogos Realizados' },
              { value: 78,                label: 'Atletas' },
              { value: classificacao.atualizado_em, label: 'Atualizado em' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 26, color: 'var(--creme)', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--verde-medio)', marginTop: 6, opacity: 0.8 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP 3 ────────────────────────────────────────────────────────────── */}
      <section className="page-body-inner" style={{ paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 8 }}>Ranking Masculino</p>
            <h2 style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 'clamp(20px, 3vw, 28px)', color: 'var(--preto)', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
              Líderes
            </h2>
          </div>
          <Link href="/ranking" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--verde-campo)', textDecoration: 'none' }}>
            Ver Todos →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 2 }}>
          {top3.map(jogador => (
            <div
              key={jogador.posicao}
              style={{ background: RANK_BG[jogador.posicao], padding: '32px 28px', position: 'relative', overflow: 'hidden' }}
            >
              {/* Ghost number */}
              <div style={{ position: 'absolute', right: -8, top: -16, fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 110, color: 'rgba(255,255,255,0.05)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>
                {jogador.posicao}
              </div>

              {/* Position badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--creme)' }}>{jogador.posicao}</span>
                </div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.3em', color: 'var(--amarelo)', textTransform: 'uppercase', opacity: 0.8 }}>
                  {jogador.posicao === 1 ? 'Líder' : jogador.posicao === 2 ? '2º lugar' : '3º lugar'}
                </span>
              </div>

              <h3 style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--creme)', textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 20, lineHeight: 1.2 }}>
                {jogador.nome}
              </h3>

              <div style={{ display: 'flex', gap: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {[
                  { v: `${jogador.percentual_vitorias}%`, l: 'Vitórias' },
                  { v: jogador.saldo_games > 0 ? `+${jogador.saldo_games}` : String(jogador.saldo_games), l: 'Saldo' },
                  { v: `${jogador.vitorias}/${jogador.jogos}`, l: 'V/J' },
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

      {/* ── PRÓXIMO JOGO + LANCES ────────────────────────────────────────────── */}
      <section className="page-body-inner" style={{ paddingBottom: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }} className="grid-cols-responsive">

          {/* Próximo Jogo */}
          <div>
            <p className="section-label" style={{ marginBottom: 8 }}>Agenda</p>
            <h2 style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 'clamp(18px, 2.5vw, 24px)', color: 'var(--preto)', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              Próximo Jogo
            </h2>

            {proximoJogo ? (
              <div style={{ border: '1px solid var(--preto)', background: 'var(--branco)', padding: '24px', boxShadow: '3px 3px 0 var(--preto)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid var(--creme-escuro)' }}>
                  <span className="chip">Rodada {proximoJogo.rodada}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(15,26,15,0.45)', letterSpacing: '0.05em' }}>
                    {proximoJogo.data} · {proximoJogo.horario}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    {proximoJogo.dupla1.map(nome => (
                      <p key={nome} style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 12, color: 'var(--preto)', marginBottom: 4, letterSpacing: '-0.01em', textTransform: 'uppercase', lineHeight: 1.2 }}>{nome}</p>
                    ))}
                  </div>
                  <div style={{ padding: '8px 12px', background: 'var(--verde-escuro)' }}>
                    <span style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 10, color: 'var(--creme)', letterSpacing: '0.08em' }}>VS</span>
                  </div>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    {proximoJogo.dupla2.map(nome => (
                      <p key={nome} style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 12, color: 'var(--preto)', marginBottom: 4, letterSpacing: '-0.01em', textTransform: 'uppercase', lineHeight: 1.2 }}>{nome}</p>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--creme-escuro)', display: 'flex', justifyContent: 'flex-end' }}>
                  <span className="chip-pending">Aguardando</span>
                </div>
              </div>
            ) : (
              <div style={{ border: '1px solid var(--creme-escuro)', padding: 24, background: 'var(--creme-escuro)', textAlign: 'center' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(15,26,15,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Temporada Encerrada</span>
              </div>
            )}

            <div style={{ marginTop: 14 }}>
              <Link href="/jogos" className="btn-ghost" style={{ display: 'flex', justifyContent: 'center' }}>
                Ver Agenda Completa
              </Link>
            </div>
          </div>

          {/* Lances */}
          <div>
            <p className="section-label" style={{ marginBottom: 8 }}>Highlights</p>
            <h2 style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 'clamp(18px, 2.5vw, 24px)', color: 'var(--preto)', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              Últimos Lances
            </h2>

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
              <Link href="/lances" className="btn-primary" style={{ display: 'flex', justifyContent: 'center' }}>
                Todos os Lances
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div style={{ background: 'var(--verde-escuro)', border: '1px solid rgba(255,255,255,0.06)', padding: '48px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--verde-medio)', marginBottom: 10, opacity: 0.8 }}>
              Squadra Verde · Temporada 2025
            </p>
            <h2 style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 'clamp(20px, 3vw, 28px)', color: 'var(--creme)', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
              Explore Todos os Rankings
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 10, position: 'relative', flexWrap: 'wrap' }}>
            <Link href="/ranking" className="btn-primary" style={{ background: 'var(--amarelo)', color: 'var(--preto)', borderColor: 'var(--amarelo)' }}>
              Masculino
            </Link>
            <Link href="/feminino" className="btn-ghost" style={{ color: 'var(--creme)', borderColor: 'rgba(245,239,230,0.25)' }}>
              Feminino
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
