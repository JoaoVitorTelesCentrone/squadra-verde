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
      <div style={{ background: '#00361a', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(157,211,170,0.10) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="page-header-inner" style={{ position: 'relative' }}>
          <p className="section-label" style={{ marginBottom: 12, color: 'rgba(157,211,170,0.6)' }}>
            Beach Tennis · Temporada 2026
          </p>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(36px, 5vw, 64px)',
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              marginBottom: 20,
            }}
          >
            Squadra Verde<br />
            <span style={{ color: '#9dd3aa' }}>Temporada 2026</span>
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              color: 'rgba(240,241,236,0.65)',
              maxWidth: 560,
              lineHeight: 1.7,
            }}
          >
            Um ranking interno de beach tennis que reúne amigos, incentiva a evolução técnica
            e premia os melhores da temporada — nas categorias Masculino, Feminino Bronze e Feminino Prata.
          </p>

          {/* Numbers bar */}
          <div
            className="stats-bar"
            style={{
              display: 'flex',
              gap: 0,
              marginTop: 40,
              flexWrap: 'wrap',
              borderTop: '1px solid rgba(157,211,170,0.2)',
              paddingTop: 32,
            }}
          >
            {[
              { val: totalAtletas, label: 'Atletas' },
              { val: 3,            label: 'Rankings' },
              { val: totalRodasM,  label: 'Rodadas M' },
              { val: totalJogosM + totalJogosF, label: 'Partidas' },
              { val: periodo,      label: 'Período' },
            ].map((s, i, arr) => (
              <div
                key={s.label}
                style={{
                  paddingRight: 40,
                  marginRight: 40,
                  borderRight: i < arr.length - 1 ? '1px solid rgba(157,211,170,0.15)' : 'none',
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontWeight: 500,
                    fontSize: 28,
                    color: '#ffffff',
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(157,211,170,0.5)',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="page-body-inner">

        {/* ── FOTO DO GRUPO ── */}
        <div
          style={{
            border: '1px solid #191c19',
            boxShadow: '6px 6px 0 #191c19',
            overflow: 'hidden',
            marginBottom: 64,
            position: 'relative',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/foto-grupo.png"
            alt="Squadra Verde · Temporada 2026"
            className="foto-grupo-img"
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,54,26,0.92) 0%, transparent 100%)',
              padding: '48px 28px 24px',
            }}
          >
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: '#ffffff',
                marginBottom: 4,
              }}
            >
              Squadra Verde · Temporada 2026
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#9dd3aa' }}>
              {totalAtletas} atletas · 3 rankings · Masculino, Feminino Bronze e Feminino Prata
            </p>
          </div>
        </div>

        {/* ── CARDS POR CATEGORIA ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
            gap: 16,
            marginBottom: 48,
          }}
        >
          {[
            {
              titulo: 'Masculino',
              badge: `${totalM} atletas`,
              cor: '#00361a',
              accent: '#9dd3aa',
              texto: `${totalM} atletas competindo no formato Rei da Quadra. Confrontos rotacionados a cada rodada garantem que todos enfrentem todos ao longo das ${totalRodasM} rodadas da temporada.`,
            },
            {
              titulo: 'Feminino Bronze',
              badge: `${totalBF} atletas`,
              cor: '#3d1a2c',
              accent: '#e8b4c8',
              texto: `${totalBF} atletas na categoria Feminino Bronze. A classificação usa pontuação baseada em sets, games e tiebreaks disputados em cada rodada do torneio.`,
            },
            {
              titulo: 'Feminino Prata',
              badge: `${totalPF} atletas`,
              cor: '#0f1e35',
              accent: '#b8cff2',
              texto: `${totalPF} atletas na categoria Feminino Prata. Assim como no Bronze, a classificação leva em conta pontos, sets, games e tiebreaks para determinar a ordem de cada atleta.`,
            },
          ].map(cat => (
            <div
              key={cat.titulo}
              style={{
                background: cat.cor,
                border: '1px solid #191c19',
                padding: '24px 20px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                }}
              />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h2
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: 16,
                      color: '#ffffff',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {cat.titulo}
                  </h2>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontWeight: 500,
                      fontSize: 12,
                      color: cat.accent,
                    }}
                  >
                    {cat.badge}
                  </span>
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(240,241,236,0.6)', lineHeight: 1.6 }}>
                  {cat.texto}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── BLOCOS DE TEXTO ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
            gap: 24,
            marginBottom: 56,
          }}
        >
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
            <div
              key={bloco.titulo}
              style={{ background: '#ffffff', border: '1px solid #e7e9e4', padding: '28px 24px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 3, height: 20, background: '#00361a', flexShrink: 0 }} />
                <h2
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                    color: '#191c19',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {bloco.titulo}
                </h2>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#414942', lineHeight: 1.7 }}>
                {bloco.texto}
              </p>
            </div>
          ))}
        </div>

        {/* ── LEGENDA ── */}
        <div
          style={{
            background: '#2e312e',
            border: '1px solid #191c19',
            boxShadow: '4px 4px 0 #191c19',
            padding: '32px 28px',
          }}
        >
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              color: '#ffffff',
              letterSpacing: '-0.01em',
              marginBottom: 8,
            }}
          >
            Legenda dos Rankings
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(240,241,236,0.45)', marginBottom: 24 }}>
            Masculino (M) · Feminino Bronze e Prata (F)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(160px, 100%), 1fr))', gap: 12 }}>
            {[
              { sigla: 'J',   desc: 'Jogos disputados',          cat: 'M + F' },
              { sigla: 'V',   desc: 'Vitórias',                  cat: 'M' },
              { sigla: 'D',   desc: 'Derrotas',                  cat: 'M' },
              { sigla: '%V',  desc: 'Percentual de vitórias',    cat: 'M + F' },
              { sigla: 'GV',  desc: 'Games vencidos',            cat: 'M + F' },
              { sigla: 'GP',  desc: 'Games perdidos',            cat: 'M + F' },
              { sigla: 'SG',  desc: 'Saldo de games',            cat: 'M + F' },
              { sigla: 'PTS', desc: 'Pontos acumulados',         cat: 'F' },
              { sigla: 'SV',  desc: 'Sets vencidos',             cat: 'F' },
              { sigla: 'SS',  desc: 'Saldo de sets',             cat: 'F' },
              { sigla: 'TV',  desc: 'Tiebreaks vencidos',        cat: 'F' },
            ].map(item => (
              <div
                key={item.sigla}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '12px 14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontWeight: 500,
                      fontSize: 18,
                      color: '#9dd3aa',
                      lineHeight: 1,
                    }}
                  >
                    {item.sigla}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'rgba(157,211,170,0.4)',
                    }}
                  >
                    {item.cat}
                  </span>
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'rgba(240,241,236,0.5)', lineHeight: 1.4 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
