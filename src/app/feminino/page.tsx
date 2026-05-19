'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import jogosDataF from '@/data/jogos_ranking_feminino.json';
import rankingPrata from '@/data/ranking_prata_feminino.json';
import { calcularClassificacao } from '@/lib/calcularClassificacao';
import type { Jogador, Resultado } from '@/lib/types';
import SectionTabs, { RANKING_TABS } from '@/components/SectionTabs';

// ── Types ──────────────────────────────────────────────────────────────────────

type Tab = 'bronze' | 'prata';
type SortKeyBronze = 'posicao' | 'percentual_vitorias' | 'saldo_games' | 'vitorias' | 'jogos';
type SortKeyPrata  = 'posicao' | 'pontos' | 'percentual' | 'saldo_sets' | 'saldo_games' | 'jogos';
type SortDir = 'asc' | 'desc';
type AtletaPrata = (typeof rankingPrata.atletas)[number];

// ── Theme ──────────────────────────────────────────────────────────────────────

const BRONZE = {
  primary: '#6b2c4a', dark: '#3d1a2c', mid: '#8b3a5e', accent: '#f2b8d0',
  accentLight: '#fcd6e5', rowOdd: '#fdf5f8', rowHover: '#f9ecf2',
  top3: { 1: { bg: '#6b2c4a', color: '#f2b8d0' }, 2: { bg: '#8b3a5e', color: '#f7c8db' }, 3: { bg: '#a34d72', color: '#fcd6e5' } },
  exportBg: '#fdf5f8',
};

const PRATA = {
  primary: '#1a3050', dark: '#0f1e35', mid: '#2a4570', accent: '#b8cff2',
  accentLight: '#d6e4fc', rowOdd: '#f5f7fd', rowHover: '#eceff8',
  top3: { 1: { bg: '#1a3050', color: '#b8cff2' }, 2: { bg: '#2a4570', color: '#c8d8f7' }, 3: { bg: '#3a5a90', color: '#d6e4fc' } },
  exportBg: '#f5f7fd',
};

const allJogos = jogosDataF.rodadas.flatMap(r => r.jogos);

// ── Component ──────────────────────────────────────────────────────────────────

export default function FemininoPage() {
  const [tab, setTab] = useState<Tab>('bronze');

  // Bronze state
  const [resultados, setResultados] = useState<Resultado[] | null>(null);
  const [buscaBronze, setBuscaBronze] = useState('');
  const [sortBronze, setSortBronze] = useState<SortKeyBronze>('posicao');
  const [sortDirBronze, setSortDirBronze] = useState<SortDir>('asc');
  const exportRefBronze = useRef<HTMLDivElement>(null);

  // Prata state
  const [buscaPrata, setBuscaPrata] = useState('');
  const [sortPrata, setSortPrata] = useState<SortKeyPrata>('posicao');
  const [sortDirPrata, setSortDirPrata] = useState<SortDir>('asc');
  const exportRefPrata = useRef<HTMLDivElement>(null);

  const [exporting, setExporting] = useState(false);
  const hoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  useEffect(() => {
    fetch('/api/resultados-feminino')
      .then(r => r.json())
      .then(data => setResultados(data.resultados));
  }, []);

  // Bronze computed
  const jogadoresBronze: Jogador[] = useMemo(() => {
    if (!resultados) return [];
    return calcularClassificacao(allJogos, resultados);
  }, [resultados]);

  const filteredBronze = useMemo(() => {
    let list = jogadoresBronze.filter(j => j.nome.toLowerCase().includes(buscaBronze.toLowerCase()));
    list = [...list].sort((a, b) => {
      const va = a[sortBronze], vb = b[sortBronze];
      if (sortDirBronze === 'asc') return va < vb ? -1 : va > vb ? 1 : 0;
      return va > vb ? -1 : va < vb ? 1 : 0;
    });
    return list;
  }, [jogadoresBronze, buscaBronze, sortBronze, sortDirBronze]);

  // Prata computed
  const atletasPrata = rankingPrata.atletas as AtletaPrata[];
  const filteredPrata = useMemo(() => {
    let list = atletasPrata.filter(a => a.nome.toLowerCase().includes(buscaPrata.toLowerCase()));
    list = [...list].sort((a, b) => {
      const va = a[sortPrata] as number, vb = b[sortPrata] as number;
      if (sortDirPrata === 'asc') return va < vb ? -1 : va > vb ? 1 : 0;
      return va > vb ? -1 : va < vb ? 1 : 0;
    });
    return list;
  }, [atletasPrata, buscaPrata, sortPrata, sortDirPrata]);

  function handleSortBronze(key: SortKeyBronze) {
    if (sortBronze === key) setSortDirBronze(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBronze(key); setSortDirBronze('desc'); }
  }

  function handleSortPrata(key: SortKeyPrata) {
    if (sortPrata === key) setSortDirPrata(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortPrata(key); setSortDirPrata(key === 'posicao' ? 'asc' : 'desc'); }
  }

  function SortIconBronze({ col }: { col: SortKeyBronze }) {
    if (sortBronze !== col) return <span style={{ color: '#c1c9bf', marginLeft: 4 }}>↕</span>;
    return <span style={{ color: BRONZE.mid, marginLeft: 4 }}>{sortDirBronze === 'asc' ? '↑' : '↓'}</span>;
  }

  function SortIconPrata({ col }: { col: SortKeyPrata }) {
    if (sortPrata !== col) return <span style={{ color: '#c1c9bf', marginLeft: 4 }}>↕</span>;
    return <span style={{ color: PRATA.mid, marginLeft: 4 }}>{sortDirPrata === 'asc' ? '↑' : '↓'}</span>;
  }

  async function handleExport(which: Tab) {
    const ref = which === 'bronze' ? exportRefBronze : exportRefPrata;
    if (!ref.current || exporting) return;
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const el = ref.current;
      const canvas = await html2canvas(el, {
        scale: 2, useCORS: true,
        backgroundColor: which === 'bronze' ? BRONZE.exportBg : PRATA.exportBg,
        logging: false,
        width: el.offsetWidth, height: el.scrollHeight,
        windowWidth: el.offsetWidth, windowHeight: el.scrollHeight,
      });
      const a = document.createElement('a');
      a.download = `sv-${which}-${hoje.replace('/', '-')}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    } catch (err) { console.error(err); }
    finally { setExporting(false); }
  }

  const theme = tab === 'bronze' ? BRONZE : PRATA;
  const jogosComPlacar = resultados?.filter(r => r.realizado && r.partidas?.length).length ?? 0;
  const maxSaldoBronze = jogadoresBronze.length > 0 ? Math.max(...jogadoresBronze.map(j => Math.abs(j.saldo_games))) : 1;
  const maxSaldoPrata  = atletasPrata.length > 0 ? Math.max(...atletasPrata.map(a => Math.abs(a.saldo_games))) : 1;

  return (
    <div>
      <SectionTabs tabs={RANKING_TABS} section="Classificação" />
      {/* ── PAGE HEADER ── */}
      <div style={{ background: 'var(--branco)', borderBottom: '1px solid rgba(26,58,26,0.12)' }}>
        <div className="page-header-inner">
          <p className="section-label" style={{ marginBottom: 10, color: theme.primary }}>Temporada 2025 · Feminino</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(32px, 5vw, 56px)', color: '#191c19', letterSpacing: '-0.02em', marginBottom: 16 }}>
                Classificação Feminino
              </h1>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 4 }}>
                {(['bronze', 'prata'] as Tab[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      padding: '10px 24px',
                      border: '1px solid',
                      borderColor: tab === t ? '#191c19' : '#c1c9bf',
                      background: tab === t ? (t === 'bronze' ? BRONZE.dark : PRATA.dark) : '#ffffff',
                      color: tab === t ? (t === 'bronze' ? BRONZE.accent : PRATA.accent) : '#717971',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {t === 'bronze' ? 'Bronze' : 'Prata'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleExport(tab)}
              disabled={exporting || (tab === 'bronze' && !resultados)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 18px',
                background: (exporting || (tab === 'bronze' && !resultados)) ? '#e7e9e4' : theme.primary,
                color: (exporting || (tab === 'bronze' && !resultados)) ? '#717971' : theme.accentLight,
                border: '1px solid #191c19',
                boxShadow: (exporting || (tab === 'bronze' && !resultados)) ? 'none' : '3px 3px 0 #191c19',
                fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: (exporting || (tab === 'bronze' && !resultados)) ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s', whiteSpace: 'nowrap',
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
                  Baixar Classificação
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="page-body-inner">

        {/* ══ BRONZE TAB ══════════════════════════════════════════════════════════ */}
        {tab === 'bronze' && (
          resultados === null ? (
            <div style={{ padding: 80, textAlign: 'center' }}>
              <span style={{ display: 'inline-block', width: 32, height: 32, border: `3px solid ${BRONZE.accentLight}`, borderTopColor: BRONZE.mid, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            </div>
          ) : (
            <>
              {/* Meta */}
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#717971', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, background: BRONZE.mid, display: 'inline-block' }} />
                Atualizado em {hoje} · {jogadoresBronze.length} atletas · {jogosComPlacar} jogos com placar
              </p>

              {/* Top 3 */}
              <div className="top3-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
                {jogadoresBronze.slice(0, 3).map(j => (
                  <div key={j.posicao} style={{ background: BRONZE.top3[j.posicao as 1|2|3]?.bg || BRONZE.primary, border: '1px solid #191c19', boxShadow: '4px 4px 0 #191c19', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: -8, top: -16, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 100, color: 'rgba(255,255,255,0.05)', lineHeight: 1, userSelect: 'none' }}>{j.posicao}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: BRONZE.top3[j.posicao as 1|2|3]?.color || BRONZE.accent, marginBottom: 8, letterSpacing: '0.1em' }}>
                      #{j.posicao} {j.posicao === 1 ? '🥇' : j.posicao === 2 ? '🥈' : '🥉'}
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: '#ffffff', marginBottom: 12, lineHeight: 1.3 }}>{j.nome}</div>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: BRONZE.top3[j.posicao as 1|2|3]?.color || BRONZE.accent, fontWeight: 500 }}>{j.percentual_vitorias}%</div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Vitórias</div>
                      </div>
                      <div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: j.saldo_games >= 0 ? BRONZE.accent : '#ffdad6', fontWeight: 500 }}>{j.saldo_games > 0 ? '+' : ''}{j.saldo_games}</div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Saldo</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Busca */}
              <div style={{ marginBottom: 24 }}>
                <input type="text" placeholder="Buscar atleta..." value={buscaBronze} onChange={e => setBuscaBronze(e.target.value)}
                  style={{ width: '100%', maxWidth: 400, padding: '12px 16px', border: '1px solid #191c19', background: '#ffffff', fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#191c19', outline: 'none' }} />
              </div>

              {/* Tabela */}
              <div style={{ border: '1px solid #191c19', overflowX: 'auto' }}>
                <table className="rank-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: BRONZE.dark }}>
                      {([
                        { key: 'posicao' as SortKeyBronze,             label: 'POS',    noSort: false },
                        { key: 'posicao' as SortKeyBronze,             label: 'ATLETA', noSort: true  },
                        { key: 'jogos' as SortKeyBronze,               label: 'J',      noSort: false },
                        { key: 'vitorias' as SortKeyBronze,            label: 'V',      noSort: false },
                        { key: 'posicao' as SortKeyBronze,             label: 'D',      noSort: true  },
                        { key: 'percentual_vitorias' as SortKeyBronze, label: '%V',     noSort: false },
                        { key: 'saldo_games' as SortKeyBronze,         label: 'SG',     noSort: false },
                        { key: 'posicao' as SortKeyBronze,             label: 'BARRA',  noSort: true  },
                      ] satisfies { key: SortKeyBronze; label: string; noSort: boolean }[]).map((col, i) => (
                        <th key={i} onClick={() => !col.noSort && handleSortBronze(col.key)}
                          style={{ padding: '14px 16px', fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: BRONZE.accent, textAlign: i === 1 ? 'left' : 'center', cursor: col.noSort ? 'default' : 'pointer', whiteSpace: 'nowrap', borderRight: i < 7 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                          {col.label}{!col.noSort && <SortIconBronze col={col.key} />}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBronze.map((j, idx) => {
                      const isPodio = j.posicao <= 3;
                      const isEven = idx % 2 === 0;
                      const saldoBar = maxSaldoBronze > 0 ? Math.abs(j.saldo_games) / maxSaldoBronze * 100 : 0;
                      return (
                        <tr key={j.posicao} style={{ background: isEven ? '#ffffff' : BRONZE.rowOdd, borderBottom: '1px solid #e7e9e4', transition: 'background 0.1s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = BRONZE.rowHover)}
                          onMouseLeave={e => (e.currentTarget.style.background = isEven ? '#ffffff' : BRONZE.rowOdd)}>
                          <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid #e7e9e4', width: 60 }}>
                            {isPodio ? <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, background: BRONZE.top3[j.posicao as 1|2|3]?.bg || BRONZE.primary, fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{j.posicao}</span>
                              : <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 500, color: '#717971' }}>{j.posicao}</span>}
                          </td>
                          <td style={{ padding: '14px 16px', borderRight: '1px solid #e7e9e4' }}>
                            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: isPodio ? 700 : 500, fontSize: 14, color: '#191c19' }}>{j.nome}</span>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: '#414942' }}>{j.jogos}</span></td>
                          <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: BRONZE.mid, fontWeight: 500 }}>{j.vitorias}</span></td>
                          <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: '#717971' }}>{j.derrotas}</span></td>
                          <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 500, color: j.percentual_vitorias >= 67 ? BRONZE.primary : j.percentual_vitorias >= 33 ? '#414942' : '#ba1a1a' }}>{j.percentual_vitorias}%</span></td>
                          <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 500, color: j.saldo_games > 0 ? BRONZE.primary : j.saldo_games < 0 ? '#ba1a1a' : '#717971' }}>{j.saldo_games > 0 ? '+' : ''}{j.saldo_games}</span></td>
                          <td style={{ padding: '14px 16px', minWidth: 100 }}>
                            <div style={{ height: 8, width: `${saldoBar}%`, background: j.saldo_games >= 0 ? BRONZE.mid : '#ba1a1a', minWidth: j.saldo_games !== 0 ? 4 : 0, maxWidth: 100 }} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredBronze.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#717971', fontFamily: "'Inter', sans-serif" }}>Nenhuma atleta encontrada.</div>}
              </div>
            </>
          )
        )}

        {/* ══ PRATA TAB ═══════════════════════════════════════════════════════════ */}
        {tab === 'prata' && (
          <>
            {/* Meta */}
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#717971', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, background: PRATA.mid, display: 'inline-block' }} />
              {rankingPrata.nome} · {atletasPrata.filter(a => a.jogos > 0).length} atletas com jogos
            </p>

            {/* Top 3 */}
            <div className="top3-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
              {atletasPrata.slice(0, 3).map(a => (
                <div key={a.posicao} style={{ background: PRATA.top3[a.posicao as 1|2|3]?.bg || PRATA.primary, border: '1px solid #191c19', boxShadow: '4px 4px 0 #191c19', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', right: -8, top: -16, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 100, color: 'rgba(255,255,255,0.05)', lineHeight: 1, userSelect: 'none' }}>{a.posicao}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: PRATA.top3[a.posicao as 1|2|3]?.color || PRATA.accent, marginBottom: 8, letterSpacing: '0.1em' }}>
                    #{a.posicao} {a.posicao === 1 ? '🥇' : a.posicao === 2 ? '🥈' : '🥉'}
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: '#ffffff', marginBottom: 12, lineHeight: 1.3 }}>{a.nome}</div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: PRATA.top3[a.posicao as 1|2|3]?.color || PRATA.accent, fontWeight: 500 }}>{a.pontos}</div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Pontos</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: a.saldo_sets >= 0 ? PRATA.accent : '#ffdad6', fontWeight: 500 }}>{a.saldo_sets > 0 ? '+' : ''}{a.saldo_sets}</div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Saldo Sets</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: '#f0f0e0', fontWeight: 500 }}>{a.percentual.toFixed(0)}%</div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>%Vitórias</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Busca */}
            <div style={{ marginBottom: 24 }}>
              <input type="text" placeholder="Buscar atleta..." value={buscaPrata} onChange={e => setBuscaPrata(e.target.value)}
                style={{ width: '100%', maxWidth: 400, padding: '12px 16px', border: '1px solid #191c19', background: '#ffffff', fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#191c19', outline: 'none' }} />
            </div>

            {/* Tabela */}
            <div style={{ border: '1px solid #191c19', overflowX: 'auto' }}>
              <table className="rank-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: PRATA.dark }}>
                    {([
                      { key: 'posicao' as SortKeyPrata,     label: 'POS',      noSort: false },
                      { key: 'posicao' as SortKeyPrata,     label: 'ATLETA',   noSort: true  },
                      { key: 'jogos' as SortKeyPrata,       label: 'J',        noSort: false },
                      { key: 'pontos' as SortKeyPrata,      label: 'PTS',      noSort: false },
                      { key: 'posicao' as SortKeyPrata,     label: 'SETS V/D', noSort: true  },
                      { key: 'saldo_sets' as SortKeyPrata,  label: 'SS',       noSort: false },
                      { key: 'posicao' as SortKeyPrata,     label: 'GAMES V/D',noSort: true  },
                      { key: 'saldo_games' as SortKeyPrata, label: 'SG',       noSort: false },
                      { key: 'percentual' as SortKeyPrata,  label: '%V',       noSort: false },
                    ] satisfies { key: SortKeyPrata; label: string; noSort: boolean }[]).map((col, i) => (
                      <th key={i} onClick={() => !col.noSort && handleSortPrata(col.key)}
                        style={{ padding: '14px 12px', fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: PRATA.accent, textAlign: i === 1 ? 'left' : 'center', cursor: col.noSort ? 'default' : 'pointer', whiteSpace: 'nowrap', borderRight: i < 8 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                        {col.label}{!col.noSort && <SortIconPrata col={col.key} />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPrata.map((a, idx) => {
                    const isPodio = a.posicao <= 3;
                    const isEven = idx % 2 === 0;
                    const saldoBar = maxSaldoPrata > 0 ? Math.abs(a.saldo_games) / maxSaldoPrata * 100 : 0;
                    return (
                      <tr key={a.posicao} style={{ background: isEven ? '#ffffff' : PRATA.rowOdd, borderBottom: '1px solid #e7e9e4', transition: 'background 0.1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = PRATA.rowHover)}
                        onMouseLeave={e => (e.currentTarget.style.background = isEven ? '#ffffff' : PRATA.rowOdd)}>
                        <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #e7e9e4', width: 60 }}>
                          {isPodio ? <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, background: PRATA.top3[a.posicao as 1|2|3]?.bg || PRATA.primary, fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{a.posicao}</span>
                            : <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 500, color: '#717971' }}>{a.posicao}</span>}
                        </td>
                        <td style={{ padding: '14px 12px', borderRight: '1px solid #e7e9e4' }}><span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: isPodio ? 700 : 500, fontSize: 14, color: '#191c19' }}>{a.nome}</span></td>
                        <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: '#414942' }}>{a.jogos}</span></td>
                        <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700, color: PRATA.primary }}>{a.pontos}</span></td>
                        <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: '#414942' }}>
                            <span style={{ color: '#2c694e', fontWeight: 600 }}>{a.sets_vencidos}</span>
                            <span style={{ color: '#c1c9bf', margin: '0 2px' }}>/</span>
                            <span style={{ color: '#ba1a1a' }}>{a.sets_perdidos}</span>
                          </span>
                        </td>
                        <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 500, color: a.saldo_sets > 0 ? PRATA.primary : a.saldo_sets < 0 ? '#ba1a1a' : '#717971' }}>{a.saldo_sets > 0 ? '+' : ''}{a.saldo_sets}</span></td>
                        <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: '#414942' }}>
                            <span style={{ color: '#2c694e', fontWeight: 600 }}>{a.games_vencidos}</span>
                            <span style={{ color: '#c1c9bf', margin: '0 2px' }}>/</span>
                            <span style={{ color: '#ba1a1a' }}>{a.games_perdidos}</span>
                          </span>
                        </td>
                        <td style={{ padding: '14px 12px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 500, color: a.saldo_games > 0 ? PRATA.primary : a.saldo_games < 0 ? '#ba1a1a' : '#717971', minWidth: 32, textAlign: 'right' }}>{a.saldo_games > 0 ? '+' : ''}{a.saldo_games}</span>
                            <div style={{ height: 8, width: `${saldoBar * 0.6}%`, background: a.saldo_games >= 0 ? PRATA.mid : '#ba1a1a', minWidth: a.saldo_games !== 0 ? 4 : 0, maxWidth: 60 }} />
                          </div>
                        </td>
                        <td style={{ padding: '14px 12px', textAlign: 'center' }}><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 500, color: a.percentual >= 67 ? PRATA.primary : a.percentual >= 33 ? '#414942' : '#ba1a1a' }}>{a.percentual.toFixed(0)}%</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredPrata.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#717971', fontFamily: "'Inter', sans-serif" }}>Nenhuma atleta encontrada.</div>}
            </div>

            {/* Legenda */}
            <div style={{ marginTop: 16, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[{ label: 'PTS', desc: 'Pontos no ranking' }, { label: 'J', desc: 'Partidas disputadas' }, { label: 'SS', desc: 'Saldo de sets' }, { label: 'SG', desc: 'Saldo de games' }, { label: '%V', desc: 'Percentual de vitórias em sets' }].map(({ label, desc }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700, color: PRATA.mid, letterSpacing: '0.08em' }}>{label}</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#717971' }}>— {desc}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── EXPORT DIVS (hidden) ── */}
      <div ref={exportRefBronze} style={{ position: 'fixed', left: '-9999px', top: 0, width: 800, background: BRONZE.exportBg, fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: BRONZE.dark, padding: '28px 32px 22px' }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.28em', color: `${BRONZE.accent}70`, textTransform: 'uppercase', marginBottom: 8 }}>SQUADRA VERDE · TEMPORADA 2026</p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 42, color: BRONZE.accentLight, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 6 }}>Classificação Bronze</h2>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: `${BRONZE.accent}60`, letterSpacing: '0.1em' }}>Atualizado em {hoje}</p>
        </div>
        {(() => {
          const mid = Math.ceil(jogadoresBronze.length / 2);
          const cols = [jogadoresBronze.slice(0, mid), jogadoresBronze.slice(mid)] as const;
          const cg = '34px 1fr 26px 40px 36px'; const ch = ['POS','ATLETA','J','%V','SG'];
          const CH = () => <div style={{ display: 'grid', gridTemplateColumns: cg, background: BRONZE.primary, padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{ch.map((h,i) => <span key={h} style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: BRONZE.accent, textAlign: i===1?'left':'center' }}>{h}</span>)}</div>;
          return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: `2px solid ${BRONZE.dark}` }}>{cols.map((col,ci) => <div key={ci} style={{ borderRight: ci===0?`2px solid ${BRONZE.dark}`:'none' }}><CH />{col.map((j,idx) => <div key={j.posicao} style={{ display: 'grid', gridTemplateColumns: cg, padding: '9px 14px', background: idx%2===0?'#ffffff':BRONZE.rowOdd, borderBottom: '1px solid #e7e9e4', alignItems: 'center' }}><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: j.posicao<=3?700:500, color: j.posicao<=3?BRONZE.primary:'#717971', textAlign: 'center' }}>{j.posicao}</span><span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: j.posicao<=3?700:500, fontSize: 12, color: '#191c19', lineHeight: 1.3 }}>{j.nome}</span><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#414942', textAlign: 'center' }}>{j.jogos}</span><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, textAlign: 'center', color: j.percentual_vitorias>=67?BRONZE.primary:j.percentual_vitorias>=33?'#414942':'#ba1a1a' }}>{j.percentual_vitorias}%</span><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, textAlign: 'center', color: j.saldo_games>0?BRONZE.primary:j.saldo_games<0?'#ba1a1a':'#717971' }}>{j.saldo_games>0?'+':''}{j.saldo_games}</span></div>)}</div>)}</div>;
        })()}
        <div style={{ background: BRONZE.dark, padding: '14px 20px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: `${BRONZE.accent}90` }}>Squadra Verde</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: `${BRONZE.accent}50`, letterSpacing: '0.1em' }}>Temporada 2026</span>
        </div>
      </div>

      <div ref={exportRefPrata} style={{ position: 'fixed', left: '-9999px', top: 0, width: 800, background: PRATA.exportBg, fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: PRATA.dark, padding: '28px 32px 22px' }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.28em', color: `${PRATA.accent}70`, textTransform: 'uppercase', marginBottom: 8 }}>SQUADRA VERDE · TEMPORADA 2026</p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 42, color: PRATA.accentLight, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 6 }}>Classificação Prata</h2>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: `${PRATA.accent}60`, letterSpacing: '0.1em' }}>{rankingPrata.nome} · Atualizado em {hoje}</p>
        </div>
        {(() => {
          const mid = Math.ceil(atletasPrata.length / 2);
          const cols = [atletasPrata.slice(0, mid), atletasPrata.slice(mid)] as const;
          const cg = '34px 1fr 26px 40px 36px 36px'; const ch = ['POS','ATLETA','J','PTS','SS','%V'];
          const CH = () => <div style={{ display: 'grid', gridTemplateColumns: cg, background: PRATA.primary, padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{ch.map((h,i) => <span key={h} style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: PRATA.accent, textAlign: i===1?'left':'center' }}>{h}</span>)}</div>;
          return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: `2px solid ${PRATA.dark}` }}>{cols.map((col,ci) => <div key={ci} style={{ borderRight: ci===0?`2px solid ${PRATA.dark}`:'none' }}><CH />{col.map((a,idx) => <div key={a.posicao} style={{ display: 'grid', gridTemplateColumns: cg, padding: '9px 14px', background: idx%2===0?'#ffffff':PRATA.rowOdd, borderBottom: '1px solid #e7e9e4', alignItems: 'center' }}><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: a.posicao<=3?700:500, color: a.posicao<=3?PRATA.primary:'#717971', textAlign: 'center' }}>{a.posicao}</span><span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: a.posicao<=3?700:500, fontSize: 11, color: '#191c19', lineHeight: 1.3 }}>{a.nome}</span><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#414942', textAlign: 'center' }}>{a.jogos}</span><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700, textAlign: 'center', color: PRATA.primary }}>{a.pontos}</span><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, textAlign: 'center', color: a.saldo_sets>0?PRATA.primary:a.saldo_sets<0?'#ba1a1a':'#717971' }}>{a.saldo_sets>0?'+':''}{a.saldo_sets}</span><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, textAlign: 'center', color: a.percentual>=67?PRATA.primary:a.percentual>=33?'#414942':'#ba1a1a' }}>{a.percentual.toFixed(0)}%</span></div>)}</div>)}</div>;
        })()}
        <div style={{ background: PRATA.dark, padding: '14px 20px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: `${PRATA.accent}90` }}>Squadra Verde</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: `${PRATA.accent}50`, letterSpacing: '0.1em' }}>Temporada 2026</span>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
