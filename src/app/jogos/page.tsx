'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import jogosData from '@/data/jogos_ranking.json';
import type { Resultado } from '@/lib/types';

type FiltroStatus = 'todos' | 'realizados' | 'pendentes';

export default function JogosPage() {
  const [rodadaAtiva, setRodadaAtiva] = useState<number | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('todos');
  const [busca, setBusca] = useState('');
  const [exporting, setExporting] = useState(false);
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/resultados')
      .then(r => r.json())
      .then(data => setResultados(data.resultados));
  }, []);

  const realizadosMap = useMemo(() => {
    const map = new Map<number, Resultado>();
    resultados.forEach(r => map.set(r.jogo_id, r));
    return map;
  }, [resultados]);

  function isRealizado(jogoId: number) {
    return realizadosMap.get(jogoId)?.realizado === true;
  }

  function getPlacar(jogoId: number) {
    return realizadosMap.get(jogoId)?.partidas ?? null;
  }

  const rodadasFiltradas = useMemo(() => {
    return jogosData.rodadas.map(rodada => {
      const jogosFiltrados = rodada.jogos.filter(jogo => {
        const realizado = isRealizado(jogo.id);
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

  const totalRealizados = resultados.filter(r => r.realizado).length;
  const totalJogos = jogosData.rodadas.reduce((acc, r) => acc + r.jogos.length, 0);

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
        backgroundColor: '#f8faf5',
        logging: false,
        width: el.offsetWidth,
        height: el.scrollHeight,
        windowWidth: el.offsetWidth,
        windowHeight: el.scrollHeight,
      });
      const a = document.createElement('a');
      a.download = `sv-resultado${rodadaAtiva !== null ? `-r${rodadaAtiva}` : ''}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e7e9e4' }}>
        <div className="page-header-inner">
          <p className="section-label" style={{ marginBottom: 10 }}>Match Day Central</p>
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
            Agenda de Jogos
          </h1>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#717971' }}>
                Temporada 2026 · {jogosData.periodo}
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
                background: exporting ? '#e7e9e4' : '#1a3a2a',
                color: exporting ? '#717971' : '#e8e8d8',
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
              onMouseEnter={e => { if (!exporting) (e.currentTarget.style.background = '#2d5c3f'); }}
              onMouseLeave={e => { if (!exporting) (e.currentTarget.style.background = '#1a3a2a'); }}
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
                  {rodadaAtiva !== null ? `Baixar Resultado R${rodadaAtiva}` : 'Baixar Resultados'}
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
                  background: filtroStatus === f ? '#00361a' : '#ffffff',
                  color: filtroStatus === f ? '#9dd3aa' : '#414942',
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
            placeholder="Buscar jogador..."
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
                background: rodadaAtiva === null ? '#00361a' : '#ffffff',
                color: rodadaAtiva === null ? '#9dd3aa' : '#414942',
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
                  background: rodadaAtiva === r.rodada ? '#00361a' : '#ffffff',
                  color: rodadaAtiva === r.rodada ? '#9dd3aa' : '#414942',
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
              const jogosRealizados = rodada.jogos.filter(j => isRealizado(j.id)).length;
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
                        background: '#2e312e',
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
                          color: '#9dd3aa',
                        }}
                      >
                        {rodada.data}
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
                      const realizado = isRealizado(jogo.id);
                      const placar = getPlacar(jogo.id);
                      return (
                        <div
                          key={jogo.id}
                          style={{
                            background: '#ffffff',
                            border: `1px solid ${realizado ? '#2c694e' : '#191c19'}`,
                            boxShadow: `3px 3px 0 ${realizado ? '#2c694e' : '#191c19'}`,
                            padding: '20px 20px',
                            position: 'relative',
                          }}
                        >
                          {/* Status indicator */}
                          <div
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: 3,
                              background: realizado ? '#2c694e' : '#e7e9e4',
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
                                fontSize: 18,
                                fontWeight: 500,
                                color: '#191c19',
                                letterSpacing: '0.05em',
                              }}
                            >
                              {jogo.horario}
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
                                    fontWeight: 600,
                                    fontSize: 14,
                                    color: '#191c19',
                                    marginBottom: 4,
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {nome}
                                </p>
                              ))}
                            </div>

                            <div
                              style={{
                                width: 36,
                                height: 36,
                                background: realizado ? '#1a4d2e' : '#2e312e',
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

                            <div style={{ flex: 1, textAlign: 'right' }}>
                              {jogo.dupla2.map(nome => (
                                <p
                                  key={nome}
                                  style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: 600,
                                    fontSize: 14,
                                    color: '#191c19',
                                    marginBottom: 4,
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {nome}
                                </p>
                              ))}
                            </div>
                          </div>

                          {/* Placar */}
                          {realizado && placar && (
                            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                              {placar.map((p, i) => {
                                const p1Win = p.games1 > p.games2;
                                const p2Win = p.games2 > p.games1;
                                return (
                                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: p1Win ? 700 : 400, color: p1Win ? '#00361a' : '#717971' }}>{p.games1}</span>
                                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#c1c9bf' }}>×</span>
                                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: p2Win ? 700 : 400, color: p2Win ? '#00361a' : '#717971' }}>{p.games2}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Footer info */}
                          <div
                            style={{
                              marginTop: 14,
                              paddingTop: 12,
                              borderTop: '1px solid #e7e9e4',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 11,
                                color: '#717971',
                              }}
                            >
                              {jogo.dupla1.length + jogo.dupla2.length} jogadores · 3 partidas
                            </span>
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

      {/* ── DIV OCULTA PARA EXPORTAÇÃO ── */}
      <div
        ref={exportRef}
        style={{ position: 'fixed', left: '-9999px', top: 0, width: 800, background: '#f8faf5', fontFamily: "'Inter', sans-serif" }}
      >
        {exportRodadas.map((rodada, ri) => {
          const jogosRealizados = rodada.jogos.filter(j => isRealizado(j.id));
          if (jogosRealizados.length === 0) return null;
          const horariosOrdenados = [...new Set(jogosRealizados.map(j => j.horario))].sort();
          const isFirst = ri === 0;
          return (
            <div key={rodada.rodada}>
              {/* Header por rodada */}
              <div style={{ background: '#1a3a2a', padding: isFirst ? '28px 32px 22px' : '20px 32px 16px' }}>
                {isFirst && (
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.28em', color: 'rgba(232,232,216,0.45)', textTransform: 'uppercase', marginBottom: 8 }}>
                    SQUADRA VERDE · TEMPORADA 2026
                  </p>
                )}
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isFirst ? 42 : 28, color: '#e8e8d8', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 6 }}>
                  {rodadaAtiva !== null ? 'Resultado da Rodada' : `Rodada ${rodada.rodada}`}
                </h2>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(232,232,216,0.4)', letterSpacing: '0.1em' }}>
                  {rodadaAtiva !== null ? `Rodada ${rodada.rodada}` : 'Temporada 2026'} · {rodada.data}
                </p>
              </div>

              {/* Jogos agrupados por horário */}
              {horariosOrdenados.map((horario, hi) => {
                const jogosHorario = jogosRealizados.filter(j => j.horario === horario);
                return (
                  <div key={horario}>
                    {/* Horário label */}
                    <div style={{ background: '#2e312e', padding: '8px 32px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500, color: '#9dd3aa', letterSpacing: '0.08em' }}>{horario}</span>
                      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                    </div>

                    {/* Jogos do horário */}
                    {jogosHorario.map((jogo, idx) => {
                      const isEven = (hi + idx) % 2 === 0;
                      return (
                        <div
                          key={jogo.id}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 52px 1fr',
                            alignItems: 'center',
                            padding: '16px 32px',
                            background: isEven ? '#ffffff' : '#f8faf5',
                            borderBottom: '1px solid #e7e9e4',
                            gap: 16,
                          }}
                        >
                          {/* Dupla 1 */}
                          <div>
                            {jogo.dupla1.map(nome => (
                              <p key={nome} style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, color: '#191c19', lineHeight: 1.35, marginBottom: 2 }}>{nome}</p>
                            ))}
                          </div>

                          {/* VS badge */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, background: '#1a4d2e', margin: '0 auto' }}>
                            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 11, color: '#9dd3aa', letterSpacing: '0.04em' }}>VS</span>
                          </div>

                          {/* Dupla 2 */}
                          <div style={{ textAlign: 'right' }}>
                            {jogo.dupla2.map(nome => (
                              <p key={nome} style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, color: '#191c19', lineHeight: 1.35, marginBottom: 2 }}>{nome}</p>
                            ))}
                          </div>

                          {/* removido — todos os jogos aqui já são realizados */}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Footer */}
        <div style={{ background: '#1a3a2a', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="18" height="21" viewBox="0 0 200 230" fill="none">
              <path d="M100 10 L185 45 L185 130 Q185 185 100 220 Q15 185 15 130 L15 45 Z" fill="none" stroke="#3d7a54" strokeWidth="10"/>
              <text x="100" y="140" textAnchor="middle" fontFamily="'Barlow Condensed',sans-serif" fontWeight="900" fontSize="80" fill="#3d7a54">SV</text>
            </svg>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(232,232,216,0.6)' }}>
              Squadra Verde
            </span>
          </div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(232,232,216,0.3)', letterSpacing: '0.1em' }}>
            Temporada 2026
          </span>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Format info */}
      <div
        style={{
          background: '#f3f4ef',
          borderTop: '1px solid #e7e9e4',
          marginTop: 48,
        }}
      >
        <div className="footer-inner">
          <p className="section-label" style={{ marginBottom: 16 }}>Formato Rei da Quadra</p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Por jogo', desc: '4 jogadores · 3 partidas internas' },
              { label: 'Combinações', desc: 'AB×CD · AC×BD · AD×BC' },
              { label: 'Pontuação', desc: 'Classificação por % de vitórias' },
              { label: 'Desempate', desc: 'Saldo de games (SG)' },
            ].map(item => (
              <div key={item.label} style={{ flex: '1 1 200px' }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, color: '#191c19', marginBottom: 4 }}>
                  {item.label}
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#717971' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
