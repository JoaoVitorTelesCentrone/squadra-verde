'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import jogosData from '@/data/jogos_ranking.json';
import { calcularClassificacao } from '@/lib/calcularClassificacao';
import type { Jogador, Resultado } from '@/lib/types';

type SortKey = 'posicao' | 'percentual_vitorias' | 'saldo_games' | 'vitorias' | 'jogos';
type SortDir = 'asc' | 'desc';

const RANK_BG: Record<number, { bg: string; color: string }> = {
  1: { bg: '#00361a', color: '#9dd3aa' },
  2: { bg: '#1a4d2e', color: '#aeeecb' },
  3: { bg: '#2c694e', color: '#b1f0ce' },
};

const allJogos = jogosData.rodadas.flatMap(r => r.jogos);

export default function RankingPage() {
  const [busca, setBusca] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('posicao');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [exporting, setExporting] = useState(false);
  const [resultados, setResultados] = useState<Resultado[] | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/resultados')
      .then(r => r.json())
      .then(data => setResultados(data.resultados));
  }, []);

  const jogadores: Jogador[] = useMemo(() => {
    if (!resultados) return [];
    return calcularClassificacao(allJogos, resultados);
  }, [resultados]);

  const filtered = useMemo(() => {
    let list = jogadores.filter((j) =>
      j.nome.toLowerCase().includes(busca.toLowerCase())
    );
    list = [...list].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (sortDir === 'asc') return va < vb ? -1 : va > vb ? 1 : 0;
      return va > vb ? -1 : va < vb ? 1 : 0;
    });
    return list;
  }, [jogadores, busca, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span style={{ color: '#c1c9bf', marginLeft: 4 }}>↕</span>;
    return <span style={{ color: '#00361a', marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  const maxSaldo = jogadores.length > 0 ? Math.max(...jogadores.map(j => Math.abs(j.saldo_games))) : 1;
  const hoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const jogosComPlacar = resultados?.filter(r => r.realizado && r.partidas?.length).length ?? 0;

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
      a.download = `sv-classificacao-${hoje.replace('/', '-')}.png`;
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
      {/* Page Header */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e7e9e4' }}>
        <div className="page-header-inner">
          <p className="section-label" style={{ marginBottom: 10 }}>Temporada 2026</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
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
                Classificação Geral
              </h1>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  color: '#717971',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ width: 8, height: 8, background: '#2c694e', display: 'inline-block' }} />
                {resultados === null
                  ? 'Carregando...'
                  : `Atualizado em ${hoje} · ${jogadores.length} atletas · ${jogosComPlacar} jogos com placar`}
              </p>
            </div>

            <button
              onClick={handleExport}
              disabled={exporting || !resultados}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                background: (exporting || !resultados) ? '#e7e9e4' : '#1a3a2a',
                color: (exporting || !resultados) ? '#717971' : '#e8e8d8',
                border: '1px solid #191c19',
                boxShadow: (exporting || !resultados) ? 'none' : '3px 3px 0 #191c19',
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: (exporting || !resultados) ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!exporting && resultados) (e.currentTarget.style.background = '#2d5c3f'); }}
              onMouseLeave={e => { if (!exporting && resultados) (e.currentTarget.style.background = '#1a3a2a'); }}
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
                  Baixar Classificação
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="page-body-inner">
        {resultados === null ? (
          <div style={{ padding: 80, textAlign: 'center' }}>
            <span style={{ display: 'inline-block', width: 32, height: 32, border: '3px solid #e7e9e4', borderTopColor: '#2c694e', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          </div>
        ) : (
          <>
            {/* Top 3 cards */}
            <div className="top3-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
              {jogadores.slice(0, 3).map((j) => (
                <div
                  key={j.posicao}
                  style={{
                    background: RANK_BG[j.posicao]?.bg || '#1a4d2e',
                    border: '1px solid #191c19',
                    boxShadow: '4px 4px 0 #191c19',
                    padding: '20px 20px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'absolute', right: -8, top: -16, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 100, color: 'rgba(255,255,255,0.05)', lineHeight: 1, userSelect: 'none' }}>
                    {j.posicao}
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: RANK_BG[j.posicao]?.color || '#9dd3aa', marginBottom: 8, letterSpacing: '0.1em' }}>
                    #{j.posicao} {j.posicao === 1 ? '🥇' : j.posicao === 2 ? '🥈' : '🥉'}
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: '#ffffff', marginBottom: 12 }}>
                    {j.nome}
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: RANK_BG[j.posicao]?.color || '#9dd3aa', fontWeight: 500 }}>{j.percentual_vitorias}%</div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Vitórias</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: j.saldo_games >= 0 ? '#9dd3aa' : '#ffdad6', fontWeight: 500 }}>
                        {j.saldo_games > 0 ? '+' : ''}{j.saldo_games}
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Saldo</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Search */}
            <div style={{ marginBottom: 24 }}>
              <input
                type="text"
                placeholder="Buscar jogador..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: 400,
                  padding: '12px 16px',
                  border: '1px solid #191c19',
                  background: '#ffffff',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  color: '#191c19',
                  outline: 'none',
                }}
              />
            </div>

            {/* Table */}
            <div style={{ border: '1px solid #191c19', overflowX: 'auto' }}>
              <table className="rank-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#2e312e' }}>
                    {[
                      { key: 'posicao' as SortKey, label: 'POS' },
                      { key: 'posicao' as SortKey, label: 'ATLETA', noSort: true },
                      { key: 'jogos' as SortKey, label: 'J' },
                      { key: 'vitorias' as SortKey, label: 'V' },
                      { key: 'posicao' as SortKey, label: 'D', noSort: true },
                      { key: 'percentual_vitorias' as SortKey, label: '%V' },
                      { key: 'saldo_games' as SortKey, label: 'SG' },
                      { key: 'posicao' as SortKey, label: 'BARRA SG', noSort: true },
                    ].map((col, i) => (
                      <th
                        key={i}
                        onClick={() => !col.noSort && handleSort(col.key)}
                        style={{
                          padding: '14px 16px',
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#9dd3aa',
                          textAlign: i === 1 ? 'left' : 'center',
                          cursor: col.noSort ? 'default' : 'pointer',
                          whiteSpace: 'nowrap',
                          borderRight: i < 7 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                        }}
                      >
                        {col.label}
                        {!col.noSort && <SortIcon col={col.key} />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((j, idx) => {
                    const isPodio = j.posicao <= 3;
                    const isEven = idx % 2 === 0;
                    const saldoBar = maxSaldo > 0 ? Math.abs(j.saldo_games) / maxSaldo * 100 : 0;
                    return (
                      <tr
                        key={j.posicao}
                        style={{ background: isEven ? '#ffffff' : '#f8faf5', borderBottom: '1px solid #e7e9e4', transition: 'background 0.1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f0f1ec')}
                        onMouseLeave={e => (e.currentTarget.style.background = isEven ? '#ffffff' : '#f8faf5')}
                      >
                        <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid #e7e9e4', width: 60 }}>
                          {isPodio ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, background: RANK_BG[j.posicao]?.bg || '#00361a', fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                              {j.posicao}
                            </span>
                          ) : (
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 500, color: '#717971' }}>{j.posicao}</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px', borderRight: '1px solid #e7e9e4' }}>
                          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: isPodio ? 700 : 500, fontSize: 14, color: '#191c19' }}>{j.nome}</span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: '#414942' }}>{j.jogos}</span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: '#2c694e', fontWeight: 500 }}>{j.vitorias}</span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: '#717971' }}>{j.derrotas}</span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 500, color: j.percentual_vitorias >= 67 ? '#00361a' : j.percentual_vitorias >= 33 ? '#414942' : '#ba1a1a' }}>
                            {j.percentual_vitorias}%
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 500, color: j.saldo_games > 0 ? '#00361a' : j.saldo_games < 0 ? '#ba1a1a' : '#717971' }}>
                            {j.saldo_games > 0 ? '+' : ''}{j.saldo_games}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', minWidth: 120 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ height: 8, width: `${saldoBar}%`, background: j.saldo_games >= 0 ? '#1a4d2e' : '#ba1a1a', minWidth: j.saldo_games !== 0 ? 4 : 0, maxWidth: 100, transition: 'width 0.3s ease' }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div style={{ padding: 40, textAlign: 'center', color: '#717971', fontFamily: "'Inter', sans-serif" }}>
                  Nenhum jogador encontrado.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── DIV OCULTA PARA EXPORTAÇÃO ── */}
      <div
        ref={exportRef}
        style={{ position: 'fixed', left: '-9999px', top: 0, width: 800, background: '#f8faf5', fontFamily: "'Inter', sans-serif" }}
      >
        {/* Header */}
        <div style={{ background: '#1a3a2a', padding: '28px 32px 22px' }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.28em', color: 'rgba(232,232,216,0.45)', textTransform: 'uppercase', marginBottom: 8 }}>
            SQUADRA VERDE · TEMPORADA 2026
          </p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 42, color: '#e8e8d8', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 6 }}>
            Classificação Geral
          </h2>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(232,232,216,0.4)', letterSpacing: '0.1em' }}>
            Atualizado em {hoje}
          </p>
        </div>

        {/* Duas colunas */}
        {(() => {
          const mid = Math.ceil(jogadores.length / 2);
          const cols = [jogadores.slice(0, mid), jogadores.slice(mid)] as const;
          const colGrid = '34px 1fr 26px 40px 36px';
          const colHeaders = ['POS', 'ATLETA', 'J', '%V', 'SG'];

          const ColHeader = () => (
            <div style={{ display: 'grid', gridTemplateColumns: colGrid, background: '#2e312e', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {colHeaders.map((h, i) => (
                <span key={h} style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9dd3aa', textAlign: i === 1 ? 'left' : 'center' }}>{h}</span>
              ))}
            </div>
          );

          return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '2px solid #1a3a2a' }}>
              {cols.map((col, ci) => (
                <div key={ci} style={{ borderRight: ci === 0 ? '2px solid #1a3a2a' : 'none' }}>
                  <ColHeader />
                  {col.map((j, idx) => {
                    const isPodio = j.posicao <= 3;
                    const isEven = idx % 2 === 0;
                    const sgColor = j.saldo_games > 0 ? '#00361a' : j.saldo_games < 0 ? '#ba1a1a' : '#717971';
                    const pvColor = j.percentual_vitorias >= 67 ? '#00361a' : j.percentual_vitorias >= 33 ? '#414942' : '#ba1a1a';
                    return (
                      <div key={j.posicao} style={{ display: 'grid', gridTemplateColumns: colGrid, padding: '9px 14px', background: isEven ? '#ffffff' : '#f8faf5', borderBottom: '1px solid #e7e9e4', alignItems: 'center' }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: isPodio ? 700 : 500, color: isPodio ? '#00361a' : '#717971', textAlign: 'center' }}>{j.posicao}</span>
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: isPodio ? 700 : 500, fontSize: 12, color: '#191c19', lineHeight: 1.3 }}>{j.nome}</span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#414942', textAlign: 'center' }}>{j.jogos}</span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, textAlign: 'center', color: pvColor }}>{j.percentual_vitorias}%</span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, textAlign: 'center', color: sgColor }}>{j.saldo_games > 0 ? '+' : ''}{j.saldo_games}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })()}

        {/* Footer */}
        <div style={{ background: '#1a3a2a', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
