'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import jogosData from '@/data/jogos_ranking.json';
import { calcularClassificacao } from '@/lib/calcularClassificacao';
import type { Jogador, Resultado } from '@/lib/types';

type SortKey = 'posicao' | 'percentual_vitorias' | 'saldo_games' | 'vitorias' | 'jogos';
type SortDir = 'asc' | 'desc';

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
    if (sortKey !== col) return <span style={{ color: 'color-mix(in oklch, var(--ink) 30%, transparent)', marginLeft: 4, fontSize: 10 }}>↕</span>;
    return <span style={{ color: 'var(--verde-glow)', marginLeft: 4, fontSize: 10 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
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
        scale: 2, useCORS: true, backgroundColor: '#f4f0ea', logging: false,
        width: el.offsetWidth, height: el.scrollHeight,
        windowWidth: el.offsetWidth, windowHeight: el.scrollHeight,
        onclone: (doc: Document) => { doc.querySelectorAll('style,link[rel="stylesheet"]').forEach(s => s.remove()); },
      });
      const a = document.createElement('a');
      a.download = `sv-classificacao-${hoje.replace('/', '-')}.png`;
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

  const podiumBgs = [
    'var(--ink)',
    'var(--verde-deep)',
    'var(--verde)',
  ];
  const podiumColors = ['var(--paper)', 'var(--paper)', 'oklch(0.15 0.03 158)'];

  return (
    <div>
      {/* Page Header */}
      <div className="page-head">
        <div className="page-head-inner">
          {/* Masculino / Feminino switcher */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 28, flexWrap: 'wrap' }}>
            {([
              { href: '/ranking',  label: 'Masculino', active: true  },
              { href: '/feminino', label: 'Feminino',  active: false },
            ] as const).map(tab => (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  padding: '8px 20px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  border: '1px solid',
                  borderColor: tab.active ? 'var(--paper)' : 'color-mix(in oklch, var(--paper) 28%, transparent)',
                  background: tab.active ? 'color-mix(in oklch, var(--paper) 16%, transparent)' : 'transparent',
                  color: tab.active ? 'var(--paper)' : 'color-mix(in oklch, var(--paper) 50%, transparent)',
                  borderRadius: 2,
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </Link>
            ))}
          </div>
          <p className="section-label" style={{ marginBottom: 12, color: 'var(--verde-glow)' }}>Temporada 2026</p>
          <div className="header-actions" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(36px, 6vw, 72px)', color: 'var(--paper)', letterSpacing: '-0.04em', textTransform: 'uppercase', marginBottom: 12, lineHeight: 0.95 }}>
                Classificação<br />Geral
              </h1>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'color-mix(in oklch, var(--paper) 50%, transparent)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 6, height: 6, background: 'var(--verde-glow)', display: 'inline-block', borderRadius: '50%', animation: 'pulse 1.6s ease infinite' }} />
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
                padding: '12px 20px',
                background: (exporting || !resultados) ? 'color-mix(in oklch, var(--paper) 8%, transparent)' : 'var(--citrino)',
                color: (exporting || !resultados) ? 'color-mix(in oklch, var(--paper) 25%, transparent)' : 'var(--ink)',
                border: '1px solid color-mix(in oklch, var(--paper) 15%, transparent)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                cursor: (exporting || !resultados) ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                borderRadius: 2,
              }}
            >
              {exporting ? (
                <>
                  <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid color-mix(in oklch, var(--ink) 30%, transparent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
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
            <span style={{ display: 'inline-block', width: 32, height: 32, border: '2px solid var(--line)', borderTopColor: 'var(--verde)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          </div>
        ) : (
          <>
            {/* Top 3 cards */}
            <div className="top3-grid" style={{ display: 'grid', gap: 12, marginBottom: 40 }}>
              {jogadores.slice(0, 3).map((j, idx) => (
                <div
                  key={j.posicao}
                  style={{
                    background: podiumBgs[idx] ?? 'var(--verde)',
                    border: '1px solid var(--ink)',
                    padding: '24px 22px',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 2,
                  }}
                >
                  <div style={{ position: 'absolute', right: -8, top: -16, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 100, color: 'rgba(255,255,255,0.06)', lineHeight: 1, userSelect: 'none', letterSpacing: '-0.04em' }}>
                    {j.posicao}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--citrino)', marginBottom: 10, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                    #{j.posicao} {j.posicao === 1 ? '· Líder' : j.posicao === 2 ? '· 2º lugar' : '· 3º lugar'}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: podiumColors[idx], marginBottom: 14, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                    {j.nome}
                  </div>
                  <div style={{ display: 'flex', gap: 20, paddingTop: 14, borderTop: '1px solid color-mix(in oklch, currentColor 14%, transparent)' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: podiumColors[idx], fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{j.percentual_vitorias}%</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'color-mix(in oklch, currentColor 50%, transparent)', marginTop: 6 }}>Vitórias</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: j.saldo_games >= 0 ? 'var(--verde-glow)' : 'var(--coral)', lineHeight: 1 }}>
                        {j.saldo_games > 0 ? '+' : ''}{j.saldo_games}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'color-mix(in oklch, currentColor 50%, transparent)', marginTop: 6 }}>Saldo</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Search */}
            <div style={{ marginBottom: 20 }}>
              <input
                type="text"
                placeholder="Buscar jogador..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="search-box"
                style={{
                  display: 'block',
                  width: 'min(100%, 380px)',
                  padding: '12px 16px',
                  border: '1px solid var(--line)',
                  background: 'var(--paper)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  color: 'var(--ink)',
                  outline: 'none',
                  borderRadius: 2,
                }}
              />
            </div>

            {/* Table */}
            <div className="rank-table-wrap">
              <table className="rank-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--ink)' }}>
                    {[
                      { key: 'posicao' as SortKey, label: 'POS' },
                      { key: 'posicao' as SortKey, label: 'ATLETA', noSort: true },
                      { key: 'jogos' as SortKey, label: 'J' },
                      { key: 'vitorias' as SortKey, label: 'V' },
                      { key: 'posicao' as SortKey, label: 'D', noSort: true, hideOnMobile: true },
                      { key: 'percentual_vitorias' as SortKey, label: '%V' },
                      { key: 'saldo_games' as SortKey, label: 'SG' },
                      { key: 'posicao' as SortKey, label: 'BARRA SG', noSort: true, hideOnMobile: true },
                    ].map((col, i) => (
                      <th
                        key={i}
                        className={col.hideOnMobile ? 'col-hide-mobile' : ''}
                        onClick={() => !col.noSort && handleSort(col.key)}
                        style={{
                          padding: '14px 16px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 10,
                          fontWeight: 500,
                          letterSpacing: '0.28em',
                          textTransform: 'uppercase',
                          color: 'color-mix(in oklch, var(--verde-glow) 80%, transparent)',
                          textAlign: i === 1 ? 'left' : 'center',
                          cursor: col.noSort ? 'default' : 'pointer',
                          whiteSpace: 'nowrap',
                          borderRight: i < 7 ? '1px solid color-mix(in oklch, var(--paper) 6%, transparent)' : 'none',
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
                        style={{ background: isEven ? 'var(--paper)' : 'var(--sand)', borderBottom: '1px solid var(--line-soft)', transition: 'background 0.1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'color-mix(in oklch, var(--verde) 5%, var(--paper))')}
                        onMouseLeave={e => (e.currentTarget.style.background = isEven ? 'var(--paper)' : 'var(--sand)')}
                      >
                        <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid var(--line-soft)', width: 60 }}>
                          {isPodio ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, background: podiumBgs[j.posicao - 1] ?? 'var(--ink)', fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--paper)', borderRadius: 4 }}>
                              {j.posicao}
                            </span>
                          ) : (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, color: 'color-mix(in oklch, var(--ink) 45%, transparent)' }}>{j.posicao}</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px', borderRight: '1px solid var(--line-soft)' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontWeight: isPodio ? 700 : 600, fontSize: 14, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{j.nome}</span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid var(--line-soft)' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'color-mix(in oklch, var(--ink) 65%, transparent)' }}>{j.jogos}</span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid var(--line-soft)' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--verde)', fontWeight: 500 }}>{j.vitorias}</span>
                        </td>
                        <td className="col-hide-mobile" style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid var(--line-soft)' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'color-mix(in oklch, var(--ink) 45%, transparent)' }}>{j.derrotas}</span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid var(--line-soft)' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, color: j.percentual_vitorias >= 67 ? 'var(--verde)' : j.percentual_vitorias >= 33 ? 'color-mix(in oklch, var(--ink) 70%, transparent)' : 'var(--coral)' }}>
                            {j.percentual_vitorias}%
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid var(--line-soft)' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, color: j.saldo_games > 0 ? 'var(--verde)' : j.saldo_games < 0 ? 'var(--coral)' : 'color-mix(in oklch, var(--ink) 45%, transparent)' }}>
                            {j.saldo_games > 0 ? '+' : ''}{j.saldo_games}
                          </span>
                        </td>
                        <td className="col-hide-mobile" style={{ padding: '14px 16px', minWidth: 120 }}>
                          <div style={{ height: 6, width: `${saldoBar}%`, background: j.saldo_games >= 0 ? 'var(--verde)' : 'var(--coral)', minWidth: j.saldo_games !== 0 ? 4 : 0, maxWidth: 100, transition: 'width 0.3s ease', borderRadius: 3 }} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div style={{ padding: 40, textAlign: 'center', color: 'color-mix(in oklch, var(--ink) 40%, transparent)', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em' }}>
                  Nenhum jogador encontrado.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* DIV OCULTA PARA EXPORTAÇÃO */}
      <div
        ref={exportRef}
        style={{ position: 'fixed', left: '-9999px', top: 0, width: 800, background: '#f4f0ea', fontFamily: "'JetBrains Mono', monospace" }}
      >
        <div style={{ background: '#1e3330', padding: '28px 32px 22px' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.28em', color: 'rgba(232,232,216,0.45)', textTransform: 'uppercase', marginBottom: 8 }}>
            SQUADRA VERDE · TEMPORADA 2026
          </p>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 42, color: '#e8e8d8', letterSpacing: '-0.035em', lineHeight: 1.1, marginBottom: 6, textTransform: 'uppercase' }}>
            Classificação Geral
          </h2>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(232,232,216,0.4)', letterSpacing: '0.1em' }}>
            Atualizado em {hoje}
          </p>
        </div>

        {(() => {
          const mid = Math.ceil(jogadores.length / 2);
          const cols = [jogadores.slice(0, mid), jogadores.slice(mid)] as const;
          const colGrid = '34px 1fr 26px 40px 36px';
          const colHeaders = ['POS', 'ATLETA', 'J', '%V', 'SG'];

          const ColHeader = () => (
            <div style={{ display: 'grid', gridTemplateColumns: colGrid, background: '#2a3830', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {colHeaders.map((h, i) => (
                <span key={h} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(180,220,180,0.8)', textAlign: i === 1 ? 'left' : 'center' }}>{h}</span>
              ))}
            </div>
          );

          return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '2px solid #1e3330' }}>
              {cols.map((col, ci) => (
                <div key={ci} style={{ borderRight: ci === 0 ? '2px solid #1e3330' : 'none' }}>
                  <ColHeader />
                  {col.map((j, idx) => {
                    const isPodio = j.posicao <= 3;
                    const isEven = idx % 2 === 0;
                    const sgColor = j.saldo_games > 0 ? '#2a6e40' : j.saldo_games < 0 ? '#8b3a3a' : '#888';
                    const pvColor = j.percentual_vitorias >= 67 ? '#2a6e40' : j.percentual_vitorias >= 33 ? '#555' : '#8b3a3a';
                    return (
                      <div key={j.posicao} style={{ display: 'grid', gridTemplateColumns: colGrid, padding: '9px 14px', background: isEven ? '#fafaf8' : '#f4f0ea', borderBottom: '1px solid #e8e4de', alignItems: 'center' }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: isPodio ? 600 : 400, color: isPodio ? '#2a5c38' : '#999', textAlign: 'center' }}>{j.posicao}</span>
                        <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: isPodio ? 700 : 600, fontSize: 12, color: '#1e2820', lineHeight: 1.3 }}>{j.nome}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#888', textAlign: 'center' }}>{j.jogos}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500, textAlign: 'center', color: pvColor }}>{j.percentual_vitorias}%</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500, textAlign: 'center', color: sgColor }}>{j.saldo_games > 0 ? '+' : ''}{j.saldo_games}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })()}

        <div style={{ background: '#1e3330', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(232,232,216,0.6)' }}>
            Squadra Verde
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(232,232,216,0.3)', letterSpacing: '0.1em' }}>
            Temporada 2026
          </span>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .top3-grid { grid-template-columns: repeat(3, 1fr); }
        .rank-table .col-hide-mobile { display: table-cell; }
        @media (max-width: 640px) {
          .top3-grid { grid-template-columns: 1fr; }
          .rank-table .col-hide-mobile { display: none; }
          .rank-table th, .rank-table td { padding: 10px 8px; font-size: 12px; }
        }
      `}</style>
    </div>
  );
}
