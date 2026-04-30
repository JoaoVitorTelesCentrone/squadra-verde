import classificacao from '@/data/classificacao_ranking.json';
import jogosData from '@/data/jogos_ranking.json';

export default function SobrePage() {
  const totalAtletas = classificacao.ranking.length;
  const totalRodadas = jogosData.rodadas.length;
  const totalJogos = jogosData.rodadas.reduce((acc, r) => acc + r.jogos.length, 0);
  const periodo = jogosData.periodo;

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
            Masculino<br />Squadra Verde
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              color: 'rgba(240,241,236,0.65)',
              maxWidth: 520,
              lineHeight: 1.7,
            }}
          >
            Um ranking interno de beach tennis que reúne amigos, incentiva a evolução técnica
            e premia os melhores da temporada no formato Rei da Quadra.
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
              { val: totalRodadas, label: 'Rodadas' },
              { val: totalJogos, label: 'Partidas' },
              { val: periodo, label: 'Período' },
            ].map((s, i) => (
              <div
                key={s.label}
                style={{
                  paddingRight: 40,
                  marginRight: 40,
                  borderRight: i < 3 ? '1px solid rgba(157,211,170,0.15)' : 'none',
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
            alt="Atletas Masculino Squadra Verde"
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
              Turma Masculino Squadra Verde · 2026
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#9dd3aa' }}>
              {totalAtletas} atletas · Ranking Rei da Quadra
            </p>
          </div>
        </div>

        {/* ── CONTEÚDO ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 24,
            marginBottom: 56,
          }}
        >
          {[
            {
              titulo: 'Como funciona o ranking?',
              texto:
                'A classificação é calculada com base no número de vitórias, percentual de aproveitamento e saldo de games de cada atleta. A cada rodada os confrontos são rotacionados para garantir que todos joguem contra todos ao longo da temporada.',
            },
            {
              titulo: 'Quando acontece?',
              texto: `As partidas acontecem aos finais de semana, sempre no mesmo local. A temporada 2026 vai de ${periodo}, com 8 rodadas disputadas e ${totalJogos} partidas no total. O campeão é coroado ao final da última rodada.`,
            },
            {
              titulo: 'Quem pode participar?',
              texto:
                `O torneio é restrito ao grupo Masculino Squadra Verde. Os ${totalAtletas} atletas inscritos disputam a temporada completa. Novos participantes podem ser incluídos a cada temporada mediante convite do grupo.`,
            },
          ].map(bloco => (
            <div
              key={bloco.titulo}
              style={{
                background: '#ffffff',
                border: '1px solid #e7e9e4',
                padding: '28px 24px',
              }}
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
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  color: '#414942',
                  lineHeight: 1.7,
                }}
              >
                {bloco.texto}
              </p>
            </div>
          ))}
        </div>

        {/* ── LEGENDA DO RANKING ── */}
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
              marginBottom: 24,
            }}
          >
            Legenda do Ranking
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 12,
            }}
          >
            {[
              { sigla: 'J', desc: 'Jogos disputados' },
              { sigla: 'V', desc: 'Vitórias' },
              { sigla: 'D', desc: 'Derrotas' },
              { sigla: '%V', desc: 'Percentual de vitórias' },
              { sigla: 'GV', desc: 'Games vencidos' },
              { sigla: 'GP', desc: 'Games perdidos' },
              { sigla: 'SG', desc: 'Saldo de games (GV − GP)' },
            ].map(item => (
              <div
                key={item.sigla}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '12px 14px',
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontWeight: 500,
                    fontSize: 18,
                    color: '#9dd3aa',
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {item.sigla}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    color: 'rgba(240,241,236,0.5)',
                    lineHeight: 1.4,
                  }}
                >
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
