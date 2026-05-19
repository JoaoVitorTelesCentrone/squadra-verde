'use client';

import { useState, useMemo, useRef } from 'react';
import jogosData from '@/data/jogos_prata_feminino.json';
import SectionTabs, { JOGOS_TABS } from '@/components/SectionTabs';

type FiltroStatus = 'todos' | 'realizados' | 'pendentes';

const THEME = {
  primary: '#4a5c6b',
  dark: '#1e3a4a',
  mid: '#5a7a8e',
  accent: '#b8d4e8',
  accentLight: '#d6eaf5',
};

export default function FeminoPrataJogosPage() {
  const [rodadaAtiva, setRodadaAtiva] = useState<number | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('todos');
  const [busca, setBusca] = useState('');
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const totalJogos = jogosData.rodadas.reduce((acc, r) => acc + r.jogos.length, 0);
  const totalRealizados = jogosData.rodadas.reduce(
    (acc, r) => acc + r.jogos.filter(j => j.status === 'Finalizado').length,
    0
  );

  const rodadasFiltradas = useMemo(() => {
    return jogosData.rodadas.map(rodada => {
      const jogosFiltrados = rodada.jogos.filter(jogo => {
        const realizado = jogo.status === 'Finalizado';
        if (filtroStatus === 'realizados' && !realizado) return false;
        if (filtroStatus === 'pendentes' && realizado) return false;
        if (busca) {
          const todos = [...jogo.dupla1, ...jogo.dupla2].join(' ').toLowerCase();
          if (!todos.includes(busca.toLowerCase())) return false;
        }
        return true;
      });
      return { ...rodada, jogos: jogosFiltrados };
    }).filter(r => r.jogos.length > 0);
  }, [filtroStatus, busca]);

  const exportRodadas = rodadaAtiva !== null
    ? jogosData.rodadas.filter(r => r.rodada === rodadaAtiva)
    : jogosData.rodadas;

  async function handleExport() {
    if (!exportRef.current || exporting) return;
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const el = exportRef.current;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f0f6fb',
        logging: false,
        width: el.offsetWidth,
        height: el.scrollHeight,
        windowWidth: el.offsetWidth,
        windowHeight: el.scrollHeight,
      });
      const a = document.createElement('a');
      a.download = `sv-prata-f${rodadaAtiva !== null ? `-r${rodadaAtiva}` : ''}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  }

  function formatData(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }

  return (
    <div>
      <SectionTabs tabs={JOGOS_TABS} section="Jogos" />
      {/* Header */}
      <div style={{ background: 'var(--branco)', borderBottom: '1px solid rgba(26,58,26,0.12)' }}>
        <div className="page-header-inner">
          <p className="section-label" style={{ marginBottom: 10, color: THEME.primary }}>
            Temporada 2026 · Feminino Prata
          </p>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(32px, 5vw, 56px)',
              color: '#191c19',
              letterSpacing: '-0.02em',
              marginBottom: 8,
            }}
          >
            Jogos Prata Feminino
          </h1>
          <div className="header-actions" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#717971' }}>
                {jogosData.torneio} · {jogosData.rodadas.length} rodadas
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <span className="chip-green">✅ {totalRealizados} realizados</span>
                <span className="chip-pending">⏳ {totalJogos - totalRealizados} pendentes</span>
              </div>
            </div>
            <button
              onClick={handleExport}
              disabled={exporting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                background: exporting ? '#e7e9e4' : THEME.dark,
                color: exporting ? '#717971' : THEME.accentLight,
                border: '1px solid #191c19',
                boxShadow: exporting ? 'none' : '3px 3px 0 #191c19',
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: exporting ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {exporting ? (
                <>
                  <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #717971', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Gerando...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  {rodadaAtiva !== null ? `Baixar R${rodadaAtiva}` : 'Baixar Resultados'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="page-body-inner">
        {/* Filtros */}
        <div className="filter-bar">
          {/* Status */}
          <div style={{ display: 'flex', gap: 0, border: '1px solid #191c19' }}>
            {(['todos', 'realizados', 'pendentes'] as FiltroStatus[]).map(f => (
              <button
                key={f}
                onClick={() => setFiltroStatus(f)}
                style={{
                  padding: '8px 16px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRight: f !== 'pendentes' ? '1px solid #191c19' : 'none',
                  cursor: 'pointer',
                  background: filtroStatus === f ? THEME.dark : '#ffffff',
                  color: filtroStatus === f ? THEME.accent : '#414942',
                  transition: 'all 0.15s',
                }}
              >
                {f === 'todos' ? 'Todos' : f === 'realizados' ? 'Realizados' : 'Pendentes'}
              </button>
            ))}
          </div>

          {/* Busca */}
          <input
            type="text"
            placeholder="Buscar jogadora..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{
              flex: 1,
              minWidth: 200,
              padding: '8px 14px',
              border: '1px solid #c1c9bf',
              background: '#f8faf5',
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: '#191c19',
              outline: 'none',
            }}
          />

          {/* Rodada tabs */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <button
              onClick={() => setRodadaAtiva(null)}
              style={{
                padding: '6px 12px',
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: '1px solid #191c19',
                cursor: 'pointer',
                background: rodadaAtiva === null ? THEME.dark : '#ffffff',
                color: rodadaAtiva === null ? THEME.accent : '#414942',
              }}
            >
              Todas
            </button>
            {jogosData.rodadas.map(r => (
              <button
                key={r.rodada}
                onClick={() => setRodadaAtiva(rodadaAtiva === r.rodada ? null : r.rodada)}
                style={{
                  padding: '6px 12px',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  fontWeight: 500,
                  border: '1px solid #191c19',
                  cursor: 'pointer',
                  background: rodadaAtiva === r.rodada ? THEME.dark : '#ffffff',
                  color: rodadaAtiva === r.rodada ? THEME.accent : '#414942',
                }}
              >
                R{r.rodada}
              </button>
            ))}
          </div>
        </div>

        {/* Rodadas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {rodadasFiltradas
            .filter(r => rodadaAtiva === null || r.rodada === rodadaAtiva)
            .map(rodada => {
              const jogosRealizados = rodada.jogos.filter(j => j.status === 'Finalizado').length;
              const completo = jogosRealizados === rodada.jogos.length;

              return (
                <div key={rodada.rodada}>
                  {/* Rodada header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      marginBottom: 16,
                      paddingBottom: 12,
                      borderBottom: '2px solid #191c19',
                    }}
                  >
                    <div
                      style={{
                        background: THEME.dark,
                        padding: '6px 14px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 700,
                          fontSize: 14,
                          color: '#ffffff',
                          letterSpacing: '0.05em',
                        }}
                      >
                        RODADA {rodada.rodada}
                      </span>
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 12,
                          color: THEME.accent,
                        }}
                      >
                        {formatData(rodada.data)}
                      </span>
                    </div>
                    {completo ? (
                      <span className="chip-green">✅ Concluída</span>
                    ) : (
                      <span className="chip-pending">{jogosRealizados}/{rodada.jogos.length} realizados</span>
                    )}
                  </div>

                  {/* Jogos grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
                      gap: 16,
                    }}
                  >
                    {rodada.jogos.map(jogo => {
                      const realizado = jogo.status === 'Finalizado';
                      const placar = 'placar' in jogo ? (jogo as { placar?: string }).placar : undefined;
                      const vencedoras = 'vencedoras' in jogo ? (jogo as { vencedoras?: string[] }).vencedoras : undefined;

                      return (
                        <div
                          key={jogo.id}
                          style={{
                            background: '#ffffff',
                            border: `1px solid ${realizado ? THEME.mid : '#191c19'}`,
                            boxShadow: `3px 3px 0 ${realizado ? THEME.mid : '#191c19'}`,
                            padding: '20px',
                            position: 'relative',
                          }}
                        >
                          {/* Status bar */}
                          <div
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: 3,
                              background: realizado ? THEME.mid : '#e7e9e4',
                            }}
                          />

                          {/* Header */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: 16,
                              paddingBottom: 12,
                              borderBottom: '1px solid #e7e9e4',
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: 13,
                                fontWeight: 500,
                                color: '#717971',
                              }}
                            >
                              #{jogo.id}
                            </span>
                            {realizado ? (
                              <span className="chip-green">✅ Realizado</span>
                            ) : (
                              <span className="chip-pending">⏳ Pendente</span>
                            )}
                          </div>

                          {/* Duplas */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ flex: 1 }}>
                              {jogo.dupla1.map(nome => (
                                <p
                                  key={nome}
                                  style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: vencedoras?.includes(nome) ? 700 : 600,
                                    fontSize: 13,
                                    color: vencedoras?.includes(nome) ? THEME.dark : '#191c19',
                                    marginBottom: 4,
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {vencedoras?.includes(nome) && <span style={{ marginRight: 4 }}>★</span>}
                                  {nome}
                                </p>
                              ))}
                            </div>

                            <div
                              style={{
                                width: 36,
                                height: 36,
                                background: realizado ? THEME.primary : '#2e312e',
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
                                  color: THEME.accent,
                                  letterSpacing: '0.05em',
                                }}
                              >
                                VS
                              </span>
                            </div>

                            <div style={{ flex: 1, textAlign: 'right' }}>
                              {jogo.dupla2.map(nome => (
                                <p
                                  key={nome}
                                  style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: vencedoras?.includes(nome) ? 700 : 600,
                                    fontSize: 13,
                                    color: vencedoras?.includes(nome) ? THEME.dark : '#191c19',
                                    marginBottom: 4,
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {nome}
                                  {vencedoras?.includes(nome) && <span style={{ marginLeft: 4 }}>★</span>}
                                </p>
                              ))}
                            </div>
                          </div>

                          {/* Placar */}
                          {realizado && placar && (
                            <div
                              style={{
                                marginTop: 12,
                                padding: '8px 12px',
                                background: THEME.accentLight,
                                border: `1px solid ${THEME.accent}`,
                                textAlign: 'center',
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "'DM Mono', monospace",
                                  fontSize: 14,
                                  fontWeight: 700,
                                  color: THEME.dark,
                                  letterSpacing: '0.08em',
                                }}
                              >
                                {placar}
                              </span>
                            </div>
                          )}

                          {/* Footer */}
                          <div
                            style={{
                              marginTop: 14,
                              paddingTop: 12,
                              borderTop: '1px solid #e7e9e4',
                              display: 'flex',
                              justifyContent: 'flex-end',
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: 11,
                                color: '#717971',
                              }}
                            >
                              #R{rodada.rodada}.{jogo.id}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          {rodadasFiltradas.filter(r => rodadaAtiva === null || r.rodada === rodadaAtiva).length === 0 && (
            <div
              style={{
                padding: 60,
                textAlign: 'center',
                border: '1px solid #e7e9e4',
                background: '#ffffff',
              }}
            >
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, color: '#717971' }}>
                Nenhum jogo encontrado
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#c1c9bf', marginTop: 8 }}>
                Tente ajustar os filtros
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Div oculta para exportação */}
      <div
        ref={exportRef}
        style={{ position: 'fixed', left: '-9999px', top: 0, width: 800, background: '#f0f6fb', fontFamily: "'Inter', sans-serif" }}
      >
        {exportRodadas.map((rodada, ri) => {
          const jogosRealizados = rodada.jogos.filter(j => j.status === 'Finalizado');
          if (jogosRealizados.length === 0) return null;
          const isFirst = ri === 0;
          return (
            <div key={rodada.rodada}>
              <div style={{ background: THEME.dark, padding: isFirst ? '28px 32px 22px' : '20px 32px 16px' }}>
                {isFirst && (
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.28em', color: 'rgba(184,212,232,0.45)', textTransform: 'uppercase', marginBottom: 8 }}>
                    SQUADRA VERDE · TEMPORADA 2025 · FEMININO PRATA
                  </p>
                )}
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isFirst ? 42 : 28, color: '#d6eaf5', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 6 }}>
                  {rodadaAtiva !== null ? 'Resultado da Rodada' : `Rodada ${rodada.rodada}`}
                </h2>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(184,212,232,0.4)', letterSpacing: '0.1em' }}>
                  {rodadaAtiva !== null ? `Rodada ${rodada.rodada}` : 'Temporada 2026'} · {formatData(rodada.data)}
                </p>
              </div>

              {jogosRealizados.map((jogo, idx) => {
                const placar = 'placar' in jogo ? (jogo as { placar?: string }).placar : undefined;
                const vencedoras = 'vencedoras' in jogo ? (jogo as { vencedoras?: string[] }).vencedoras : undefined;
                const isEven = idx % 2 === 0;
                return (
                  <div
                    key={jogo.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 80px 1fr',
                      alignItems: 'center',
                      padding: '14px 32px',
                      background: isEven ? '#ffffff' : '#f0f6fb',
                      borderBottom: '1px solid #d6eaf5',
                      gap: 16,
                    }}
                  >
                    <div>
                      {jogo.dupla1.map(nome => (
                        <p key={nome} style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: vencedoras?.includes(nome) ? 700 : 600, fontSize: 13, color: vencedoras?.includes(nome) ? THEME.dark : '#191c19', lineHeight: 1.35, marginBottom: 2 }}>
                          {vencedoras?.includes(nome) ? `★ ${nome}` : nome}
                        </p>
                      ))}
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      {placar ? (
                        <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 13, color: THEME.dark }}>{placar}</span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, background: THEME.primary, margin: '0 auto' }}>
                          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 11, color: THEME.accent }}>VS</span>
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      {jogo.dupla2.map(nome => (
                        <p key={nome} style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: vencedoras?.includes(nome) ? 700 : 600, fontSize: 13, color: vencedoras?.includes(nome) ? THEME.dark : '#191c19', lineHeight: 1.35, marginBottom: 2 }}>
                          {vencedoras?.includes(nome) ? `${nome} ★` : nome}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        <div style={{ background: THEME.dark, padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(184,212,232,0.6)' }}>
            Squadra Verde · Feminino Prata
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(184,212,232,0.3)', letterSpacing: '0.1em' }}>
            Temporada 2026
          </span>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Formato info */}
      <div style={{ background: '#f3f4ef', borderTop: '1px solid #e7e9e4', marginTop: 48 }}>
        <div className="footer-inner">
          <p className="section-label" style={{ marginBottom: 16 }}>Formato Rei da Quadra</p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Por jogo', desc: '4 jogadoras · 3 partidas internas' },
              { label: 'Combinações', desc: 'AB×CD · AC×BD · AD×BC' },
              { label: 'Pontuação', desc: 'Classificação por % de vitórias' },
              { label: 'Desempate', desc: 'Saldo de games (SG)' },
            ].map(item => (
              <div key={item.label} style={{ flex: '1 1 200px' }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, color: '#191c19', marginBottom: 4 }}>{item.label}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#717971' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
