'use client';

import { useState, useMemo, useRef } from 'react';
import jogosData from '@/data/jogos_bronze_feminino.json';
import Link from 'next/link';

type FiltroStatus = 'todos' | 'realizados' | 'pendentes';

const THEME = {
  primary:     'var(--bronze)',
  dark:        'var(--bronze-deep)',
  mid:         'var(--bronze)',
  accent:      'var(--bronze-light)',
  accentLight: 'color-mix(in oklch, var(--bronze-light) 40%, var(--paper))',
};

export default function FemininoJogosPage() {
  const [rodadaAtiva, setRodadaAtiva] = useState<number | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('todos');
  const [busca, setBusca] = useState('');
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const totalJogos = jogosData.rodadas.reduce((acc, r) => acc + r.jogos.length, 0);
  const totalRealizados = jogosData.rodadas.reduce(
    (acc, r) => acc + r.jogos.filter(j => j.status === 'Concluído').length,
    0
  );

  const rodadasFiltradas = useMemo(() => {
    return jogosData.rodadas.map(rodada => {
      const jogosFiltrados = rodada.jogos.filter(jogo => {
        const realizado = jogo.status === 'Concluído';
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
        scale: 2, useCORS: true, backgroundColor: '#fdf5f8', logging: false,
        width: el.offsetWidth, height: el.scrollHeight,
        windowWidth: el.offsetWidth, windowHeight: el.scrollHeight,
        onclone: (doc: Document) => { doc.querySelectorAll('style,link[rel="stylesheet"]').forEach(s => s.remove()); },
      });
      const a = document.createElement('a');
      a.download = `sv-bronze-f${rodadaAtiva !== null ? `-r${rodadaAtiva}` : ''}.png`;
      a.href = canvas.toDataURL('image/png');
      document.body.appendChild(a);
      a.click();
      a.remove();
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
      {/* Header */}
      <div className="page-head" style={{ background: 'var(--bronze-deep)' }}>
        <div className="page-head-inner">
          {/* Jogos switcher */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 28, flexWrap: 'wrap' }}>
            {([
              { href: '/jogos',               label: 'Masculino', active: false },
              { href: '/feminino-jogos',      label: 'F. Bronze', active: true  },
              { href: '/feminino-prata-jogos',label: 'F. Prata',  active: false },
            ] as const).map(tab => (
              <Link key={tab.href} href={tab.href} style={{
                padding: '8px 20px',
                fontFamily: 'var(--font-mono)',
                fontSize: 11, fontWeight: 500,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                textDecoration: 'none', border: '1px solid',
                borderColor: tab.active ? 'var(--paper)' : 'color-mix(in oklch, var(--paper) 28%, transparent)',
                background: tab.active ? 'color-mix(in oklch, var(--paper) 16%, transparent)' : 'transparent',
                color: tab.active ? 'var(--paper)' : 'color-mix(in oklch, var(--paper) 50%, transparent)',
                borderRadius: 2, transition: 'all 0.15s',
              }}>{tab.label}</Link>
            ))}
          </div>
          <p className="section-label" style={{ marginBottom: 10, color: 'var(--bronze-light)' }}>
            Temporada 2026 · Feminino Bronze
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 'clamp(36px, 6vw, 72px)',
              color: 'var(--paper)',
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              lineHeight: 0.95,
              marginBottom: 16,
            }}
          >
            Jogos Bronze<br />Feminino
          </h1>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: 'color-mix(in oklch, var(--paper) 55%, transparent)' }}>
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
                background: exporting ? 'color-mix(in oklch, var(--paper) 10%, transparent)' : 'var(--bronze-light)',
                color: exporting ? 'color-mix(in oklch, var(--paper) 35%, transparent)' : 'var(--bronze-deep)',
                border: '1px solid color-mix(in oklch, var(--paper) 22%, transparent)',
                boxShadow: 'none',
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                cursor: exporting ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                borderRadius: 2,
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
          <div style={{ display: 'flex', gap: 0, border: '1px solid var(--ink)' }}>
            {(['todos', 'realizados', 'pendentes'] as FiltroStatus[]).map(f => (
              <button
                key={f}
                onClick={() => setFiltroStatus(f)}
                style={{
                  padding: '8px 16px',
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRight: f !== 'pendentes' ? '1px solid var(--ink)' : 'none',
                  cursor: 'pointer',
                  background: filtroStatus === f ? THEME.dark : 'var(--paper)',
                  color: filtroStatus === f ? THEME.accent : 'color-mix(in oklch, var(--ink) 65%, transparent)',
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
              background: 'var(--sand)',
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              color: 'var(--ink)',
              outline: 'none',
            }}
          />

          {/* Rodada tabs */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <button
              onClick={() => setRodadaAtiva(null)}
              style={{
                padding: '6px 12px',
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: '1px solid var(--ink)',
                cursor: 'pointer',
                background: rodadaAtiva === null ? THEME.dark : 'var(--paper)',
                color: rodadaAtiva === null ? THEME.accent : 'color-mix(in oklch, var(--ink) 65%, transparent)',
              }}
            >
              Todas
            </button>
            {[...jogosData.rodadas].sort((a, b) => a.rodada - b.rodada).map(r => (
              <button
                key={r.rodada}
                onClick={() => setRodadaAtiva(rodadaAtiva === r.rodada ? null : r.rodada)}
                style={{
                  padding: '6px 12px',
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 500,
                  border: '1px solid var(--ink)',
                  cursor: 'pointer',
                  background: rodadaAtiva === r.rodada ? THEME.dark : 'var(--paper)',
                  color: rodadaAtiva === r.rodada ? THEME.accent : 'color-mix(in oklch, var(--ink) 65%, transparent)',
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
              const jogosRealizados = rodada.jogos.filter(j => j.status === 'Concluído').length;
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
                      borderBottom: '2px solid var(--ink)',
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
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: 14,
                          color: 'var(--paper)',
                          letterSpacing: '0.05em',
                        }}
                      >
                        RODADA {rodada.rodada}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
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
                      const realizado = jogo.status === 'Concluído';
                      const placar = 'placar' in jogo ? (jogo as { placar?: string }).placar : undefined;
                      const vencedor = 'vencedor' in jogo ? (jogo as { vencedor?: string[] }).vencedor : undefined;

                      return (
                        <div
                          key={jogo.jogo}
                          style={{
                            background: 'var(--paper)',
                            border: `1px solid ${realizado ? THEME.mid : 'var(--ink)'}`,
                            boxShadow: `3px 3px 0 ${realizado ? THEME.mid : 'var(--ink)'}`,
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
                              background: realizado ? THEME.mid : 'var(--line)',
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
                              borderBottom: '1px solid var(--line)',
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 13,
                                fontWeight: 500,
                                color: 'color-mix(in oklch, var(--ink) 45%, transparent)',
                              }}
                            >
                              #{jogo.jogo}
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
                                    fontFamily: "var(--font-display)",
                                    fontWeight: vencedor?.includes(nome) ? 700 : 600,
                                    fontSize: 13,
                                    color: vencedor?.includes(nome) ? THEME.dark : 'var(--ink)',
                                    marginBottom: 4,
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {vencedor?.includes(nome) && <span style={{ marginRight: 4 }}>★</span>}
                                  {nome}
                                </p>
                              ))}
                            </div>

                            <div
                              style={{
                                width: 36,
                                height: 36,
                                background: realizado ? THEME.primary : 'color-mix(in oklch, var(--ink) 60%, transparent)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "var(--font-display)",
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
                                    fontFamily: "var(--font-display)",
                                    fontWeight: vencedor?.includes(nome) ? 700 : 600,
                                    fontSize: 13,
                                    color: vencedor?.includes(nome) ? THEME.dark : 'var(--ink)',
                                    marginBottom: 4,
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {nome}
                                  {vencedor?.includes(nome) && <span style={{ marginLeft: 4 }}>★</span>}
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
                                  fontFamily: "var(--font-mono)",
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
                              borderTop: '1px solid var(--line)',
                              display: 'flex',
                              justifyContent: 'flex-end',
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 11,
                                color: 'color-mix(in oklch, var(--ink) 45%, transparent)',
                              }}
                            >
                              #R{rodada.rodada}.{jogo.jogo}
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
                border: '1px solid var(--line)',
                background: 'var(--paper)',
              }}
            >
              <p style={{ fontFamily: "var(--font-display)", fontSize: 18, color: 'color-mix(in oklch, var(--ink) 45%, transparent)' }}>
                Nenhum jogo encontrado
              </p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: '#c1c9bf', marginTop: 8 }}>
                Tente ajustar os filtros
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Div oculta para exportação */}
      <div
        ref={exportRef}
        style={{ position: 'fixed', left: '-9999px', top: 0, width: 800, background: '#fdf5f8', fontFamily: "var(--font-mono)" }}
      >
        {exportRodadas.map((rodada, ri) => {
          const jogosRealizados = rodada.jogos.filter(j => j.status === 'Concluído');
          if (jogosRealizados.length === 0) return null;
          const isFirst = ri === 0;
          return (
            <div key={rodada.rodada}>
              <div style={{ background: THEME.dark, padding: isFirst ? '28px 32px 22px' : '20px 32px 16px' }}>
                {isFirst && (
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: '0.28em', color: 'rgba(242,184,208,0.45)', textTransform: 'uppercase', marginBottom: 8 }}>
                    SQUADRA VERDE · TEMPORADA 2026 · FEMININO BRONZE
                  </p>
                )}
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: isFirst ? 42 : 28, color: '#fcd6e5', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 6 }}>
                  {rodadaAtiva !== null ? 'Resultado da Rodada' : `Rodada ${rodada.rodada}`}
                </h2>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: 'rgba(242,184,208,0.4)', letterSpacing: '0.1em' }}>
                  {rodadaAtiva !== null ? `Rodada ${rodada.rodada}` : 'Temporada 2026'} · {formatData(rodada.data)}
                </p>
              </div>

              {jogosRealizados.map((jogo, idx) => {
                const placar = 'placar' in jogo ? (jogo as { placar?: string }).placar : undefined;
                const vencedor = 'vencedor' in jogo ? (jogo as { vencedor?: string[] }).vencedor : undefined;
                const isEven = idx % 2 === 0;
                return (
                  <div
                    key={jogo.jogo}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 80px 1fr',
                      alignItems: 'center',
                      padding: '14px 32px',
                      background: isEven ? 'var(--paper)' : '#fdf5f8',
                      borderBottom: '1px solid #f0e0ea',
                      gap: 16,
                    }}
                  >
                    <div>
                      {jogo.dupla1.map(nome => (
                        <p key={nome} style={{ fontFamily: "var(--font-display)", fontWeight: vencedor?.includes(nome) ? 700 : 600, fontSize: 13, color: vencedor?.includes(nome) ? THEME.dark : 'var(--ink)', lineHeight: 1.35, marginBottom: 2 }}>
                          {vencedor?.includes(nome) ? `★ ${nome}` : nome}
                        </p>
                      ))}
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      {placar ? (
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13, color: THEME.dark }}>{placar}</span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, background: THEME.primary, margin: '0 auto' }}>
                          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, color: THEME.accent }}>VS</span>
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      {jogo.dupla2.map(nome => (
                        <p key={nome} style={{ fontFamily: "var(--font-display)", fontWeight: vencedor?.includes(nome) ? 700 : 600, fontSize: 13, color: vencedor?.includes(nome) ? THEME.dark : 'var(--ink)', lineHeight: 1.35, marginBottom: 2 }}>
                          {vencedor?.includes(nome) ? `${nome} ★` : nome}
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
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--accent-2) 60%, transparent)' }}>
            Squadra Verde · Feminino Bronze
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'rgba(242,184,208,0.3)', letterSpacing: '0.1em' }}>
            Temporada 2026
          </span>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Formato info */}
      <div style={{ background: '#f3f4ef', borderTop: '1px solid var(--line)', marginTop: 48 }}>
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
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>{item.label}</p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: 'color-mix(in oklch, var(--ink) 45%, transparent)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
