'use client';

import { useState, useMemo } from 'react';
import jogosData from '@/data/jogos_ranking.json';
import resultadosData from '@/data/resultados.json';

type FiltroStatus = 'todos' | 'realizados' | 'pendentes';

export default function JogosPage() {
  const [rodadaAtiva, setRodadaAtiva] = useState<number | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('todos');
  const [busca, setBusca] = useState('');

  const realizadosMap = useMemo(() => {
    const map = new Map<number, boolean>();
    resultadosData.resultados.forEach(r => map.set(r.jogo_id, r.realizado));
    return map;
  }, []);

  function isRealizado(jogoId: number) {
    return realizadosMap.get(jogoId) === true;
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

  const totalRealizados = resultadosData.resultados.filter(r => r.realizado).length;
  const totalJogos = jogosData.rodadas.reduce((acc, r) => acc + r.jogos.length, 0);

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
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#717971' }}>
              Temporada 2026 · {jogosData.periodo}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="chip-green">✅ {totalRealizados} realizados</span>
              <span className="chip-pending">⏳ {totalJogos - totalRealizados} pendentes</span>
            </div>
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
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: 16,
                    }}
                  >
                    {rodada.jogos.map(jogo => {
                      const realizado = isRealizado(jogo.id);
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
