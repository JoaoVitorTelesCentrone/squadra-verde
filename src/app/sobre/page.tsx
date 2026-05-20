import classificacaoM from '@/data/classificacao_ranking.json';
import jogosDataM from '@/data/jogos_ranking.json';
import rankingBronzeF from '@/data/ranking_feminino.json';
import rankingPrataF from '@/data/ranking_prata_feminino.json';
import jogosDataF from '@/data/jogos_ranking_feminino.json';

export default function SobrePage() {
  const totalM = classificacaoM.ranking.length;
  const totalBF = rankingBronzeF.atletas.length;
  const totalPF = rankingPrataF.atletas.length;
  const totalAtletas = totalM + totalBF + totalPF;

  const totalRodasM = jogosDataM.rodadas.length;
  const totalJogosM = jogosDataM.rodadas.reduce((acc, r) => acc + r.jogos.length, 0);
  const totalJogosF = jogosDataF.rodadas.reduce((acc, r) => acc + r.jogos.length, 0);
  const periodo = jogosDataM.periodo;

  return (
    <div>
      {/* ── HERO ── */}
      <div className="page-head">
        <div className="page-head-inner">
          <p className="section-label" style={{ marginBottom: 12, color: 'var(--verde-glow)' }}>
            Beach Tennis · Temporada 2026
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(40px, 7vw, 88px)', color: 'var(--paper)', letterSpacing: '-0.04em', lineHeight: 0.92, marginBottom: 24, textTransform: 'uppercase' }}>
            Squadra<br />
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, textTransform: 'none', color: 'var(--coral)', letterSpacing: '-0.01em' }}>Verde</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'color-mix(in oklch, var(--paper) 55%, transparent)', maxWidth: 560, lineHeight: 1.75 }}>
            Um ranking interno de beach tennis que reúne amigos, incentiva a evolução técnica
            e premia os melhores da temporada — nas categorias Masculino, Feminino Bronze e Feminino Prata.
          </p>

          {/* Stat strip */}
          <div className="stats-bar" style={{ display: 'flex', gap: 0, marginTop: 48, flexWrap: 'wrap', borderTop: '1px solid color-mix(in oklch, var(--paper) 10%, transparent)', paddingTop: 36 }}>
            {[
              { val: totalAtletas, label: 'Atletas' },
              { val: 3,            label: 'Rankings' },
              { val: totalRodasM,  label: 'Rodadas M' },
              { val: totalJogosM + totalJogosF, label: 'Partidas' },
              { val: periodo,      label: 'Período' },
            ].map((s, i, arr) => (
              <div
                key={s.label}
                className="sobre-stat"
                style={{ paddingRight: 36, marginRight: 36, borderRight: i < arr.length - 1 ? '1px solid color-mix(in oklch, var(--paper) 8%, transparent)' : 'none' }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 36, color: 'var(--paper)', lineHeight: 1, marginBottom: 8, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
                  {s.val}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--paper) 38%, transparent)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="page-body-inner">

        {/* ── FOTO DO GRUPO ── */}
        <div style={{ border: '1px solid var(--line)', overflow: 'hidden', marginBottom: 64, position: 'relative', borderRadius: 2 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/foto-grupo.png" alt="Squadra Verde · Temporada 2026" className="foto-grupo-img" />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, color-mix(in oklch, var(--ink) 88%, transparent) 0%, transparent 100%)', padding: '56px 28px 24px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--paper)', marginBottom: 6, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
              Squadra Verde · Temporada 2026
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--verde-glow)', letterSpacing: '0.08em' }}>
              {totalAtletas} atletas · 3 rankings · Masculino, Feminino Bronze e Feminino Prata
            </p>
          </div>
        </div>

        {/* ── CARDS POR CATEGORIA ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: 12, marginBottom: 56 }}>
          {[
            {
              titulo: 'Masculino',
              badge: `${totalM} atletas`,
              bg: 'var(--ink)',
              accent: 'var(--verde-glow)',
              texto: `${totalM} atletas competindo no formato Rei da Quadra. Confrontos rotacionados a cada rodada garantem que todos enfrentem todos ao longo das ${totalRodasM} rodadas da temporada.`,
            },
            {
              titulo: 'Feminino Bronze',
              badge: `${totalBF} atletas`,
              bg: 'var(--bronze-deep)',
              accent: 'var(--bronze-light)',
              texto: `${totalBF} atletas na categoria Feminino Bronze. A classificação usa pontuação baseada em sets, games e tiebreaks disputados em cada rodada do torneio.`,
            },
            {
              titulo: 'Feminino Prata',
              badge: `${totalPF} atletas`,
              bg: 'var(--azul-night)',
              accent: 'var(--prata-light)',
              texto: `${totalPF} atletas na categoria Feminino Prata. Assim como no Bronze, a classificação leva em conta pontos, sets, games e tiebreaks para determinar a ordem de cada atleta.`,
            },
          ].map(cat => (
            <div key={cat.titulo} style={{ background: cat.bg, border: '1px solid var(--ink)', padding: '24px 20px', position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 49px, rgba(255,255,255,0.03) 49px 50px)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--paper)', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>{cat.titulo}</h2>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 10, color: cat.accent, letterSpacing: '0.1em' }}>{cat.badge}</span>
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'color-mix(in oklch, var(--paper) 55%, transparent)', lineHeight: 1.7 }}>
                  {cat.texto}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── BLOCOS DE TEXTO ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: 16, marginBottom: 56 }}>
          {[
            {
              titulo: 'Como funciona o ranking?',
              texto: 'No Masculino, a classificação usa vitórias, percentual de aproveitamento e saldo de games. No Feminino Bronze e Prata, o sistema de pontuação inclui sets, games e tiebreaks disputados — seguindo o padrão Letzplay de ranking.',
            },
            {
              titulo: 'Quando acontece?',
              texto: `As partidas acontecem aos finais de semana, sempre no mesmo local. A temporada 2026 vai de ${periodo}, com ${totalRodasM} rodadas e ${totalJogosM + totalJogosF} partidas no total entre todas as categorias.`,
            },
            {
              titulo: 'Quem pode participar?',
              texto: `O torneio é restrito ao grupo Squadra Verde. Os ${totalAtletas} atletas inscritos nas três categorias disputam a temporada completa. Novos participantes podem ser incluídos a cada temporada mediante convite do grupo.`,
            },
          ].map(bloco => (
            <div key={bloco.titulo} style={{ background: 'var(--paper)', border: '1px solid var(--line)', padding: '28px 24px', borderRadius: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 2, height: 22, background: 'var(--verde)', flexShrink: 0 }} />
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--ink)', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>{bloco.titulo}</h2>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'color-mix(in oklch, var(--ink) 65%, transparent)', lineHeight: 1.75 }}>{bloco.texto}</p>
            </div>
          ))}
        </div>

        {/* ── LEGENDA ── */}
        <div style={{ background: 'var(--ink)', border: '1px solid var(--ink)', padding: '32px 28px', borderRadius: 2 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'var(--paper)', letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 6 }}>
            Legenda dos Rankings
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'color-mix(in oklch, var(--paper) 38%, transparent)', marginBottom: 28, letterSpacing: '0.1em' }}>
            Masculino (M) · Feminino Bronze e Prata (F)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(150px, 100%), 1fr))', gap: 8 }}>
            {[
              { sigla: 'J',   desc: 'Jogos disputados',       cat: 'M + F' },
              { sigla: 'V',   desc: 'Vitórias',               cat: 'M' },
              { sigla: 'D',   desc: 'Derrotas',               cat: 'M' },
              { sigla: '%V',  desc: 'Percentual de vitórias', cat: 'M + F' },
              { sigla: 'GV',  desc: 'Games vencidos',         cat: 'M + F' },
              { sigla: 'GP',  desc: 'Games perdidos',         cat: 'M + F' },
              { sigla: 'SG',  desc: 'Saldo de games',         cat: 'M + F' },
              { sigla: 'PTS', desc: 'Pontos acumulados',      cat: 'F' },
              { sigla: 'SV',  desc: 'Sets vencidos',          cat: 'F' },
              { sigla: 'SS',  desc: 'Saldo de sets',          cat: 'F' },
              { sigla: 'TV',  desc: 'Tiebreaks vencidos',     cat: 'F' },
            ].map(item => (
              <div key={item.sigla} style={{ background: 'color-mix(in oklch, var(--paper) 5%, transparent)', border: '1px solid color-mix(in oklch, var(--paper) 8%, transparent)', padding: '12px 14px', borderRadius: 2 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--citrino)', lineHeight: 1, letterSpacing: '-0.02em' }}>{item.sigla}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--paper) 25%, transparent)' }}>{item.cat}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'color-mix(in oklch, var(--paper) 48%, transparent)', lineHeight: 1.4 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
