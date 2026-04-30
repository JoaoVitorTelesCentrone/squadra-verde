'use client';

import { useState, useMemo } from 'react';
import classificacaoData from '@/data/classificacao_ranking.json';
import type { Jogador } from '@/lib/types';

type SortKey = 'posicao' | 'percentual_vitorias' | 'saldo_games' | 'vitorias' | 'jogos';
type SortDir = 'asc' | 'desc';

const RANK_BG: Record<number, { bg: string; color: string }> = {
  1: { bg: '#00361a', color: '#9dd3aa' },
  2: { bg: '#1a4d2e', color: '#aeeecb' },
  3: { bg: '#2c694e', color: '#b1f0ce' },
};

export default function RankingPage() {
  const [busca, setBusca] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('posicao');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const jogadores: Jogador[] = classificacaoData.ranking;

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

  const maxSaldo = Math.max(...jogadores.map(j => Math.abs(j.saldo_games)));

  return (
    <div>
      {/* Page Header */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e7e9e4' }}>
        <div className="page-header-inner">
          <p className="section-label" style={{ marginBottom: 10 }}>Temporada 2026</p>
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
            <span
              style={{
                width: 8,
                height: 8,
                background: '#2c694e',
                display: 'inline-block',
              }}
            />
            Atualizado em {classificacaoData.atualizado_em} · {jogadores.length} atletas
          </p>
        </div>
      </div>

      <div className="page-body-inner">
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
              <div
                style={{
                  position: 'absolute',
                  right: -8,
                  top: -16,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 100,
                  color: 'rgba(255,255,255,0.05)',
                  lineHeight: 1,
                  userSelect: 'none',
                }}
              >
                {j.posicao}
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  color: RANK_BG[j.posicao]?.color || '#9dd3aa',
                  marginBottom: 8,
                  letterSpacing: '0.1em',
                }}
              >
                #{j.posicao} {j.posicao === 1 ? '🥇' : j.posicao === 2 ? '🥈' : '🥉'}
              </div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: '#ffffff',
                  marginBottom: 12,
                }}
              >
                {j.nome}
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: RANK_BG[j.posicao]?.color || '#9dd3aa', fontWeight: 500 }}>
                    {j.percentual_vitorias}%
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                    Vitórias
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: j.saldo_games >= 0 ? '#9dd3aa' : '#ffdad6', fontWeight: 500 }}>
                    {j.saldo_games > 0 ? '+' : ''}{j.saldo_games}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                    Saldo
                  </div>
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
                    style={{
                      background: isEven ? '#ffffff' : '#f8faf5',
                      borderBottom: '1px solid #e7e9e4',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f0f1ec')}
                    onMouseLeave={e => (e.currentTarget.style.background = isEven ? '#ffffff' : '#f8faf5')}
                  >
                    {/* POS */}
                    <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid #e7e9e4', width: 60 }}>
                      {isPodio ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            background: RANK_BG[j.posicao]?.bg || '#00361a',
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 14,
                            fontWeight: 700,
                            color: '#ffffff',
                          }}
                        >
                          {j.posicao}
                        </span>
                      ) : (
                        <span
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 14,
                            fontWeight: 500,
                            color: '#717971',
                          }}
                        >
                          {j.posicao}
                        </span>
                      )}
                    </td>

                    {/* Nome */}
                    <td style={{ padding: '14px 16px', borderRight: '1px solid #e7e9e4' }}>
                      <span
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: isPodio ? 700 : 500,
                          fontSize: 14,
                          color: '#191c19',
                        }}
                      >
                        {j.nome}
                      </span>
                    </td>

                    {/* J */}
                    <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: '#414942' }}>{j.jogos}</span>
                    </td>

                    {/* V */}
                    <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: '#2c694e', fontWeight: 500 }}>{j.vitorias}</span>
                    </td>

                    {/* D */}
                    <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: '#717971' }}>{j.derrotas}</span>
                    </td>

                    {/* %V */}
                    <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 500, color: j.percentual_vitorias >= 67 ? '#00361a' : j.percentual_vitorias >= 33 ? '#414942' : '#ba1a1a' }}>
                        {j.percentual_vitorias}%
                      </span>
                    </td>

                    {/* SG */}
                    <td style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid #e7e9e4' }}>
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 14,
                          fontWeight: 500,
                          color: j.saldo_games > 0 ? '#00361a' : j.saldo_games < 0 ? '#ba1a1a' : '#717971',
                        }}
                      >
                        {j.saldo_games > 0 ? '+' : ''}{j.saldo_games}
                      </span>
                    </td>

                    {/* Saldo bar */}
                    <td style={{ padding: '14px 16px', minWidth: 120 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            height: 8,
                            width: `${saldoBar}%`,
                            background: j.saldo_games >= 0 ? '#1a4d2e' : '#ba1a1a',
                            minWidth: j.saldo_games !== 0 ? 4 : 0,
                            maxWidth: 100,
                            transition: 'width 0.3s ease',
                          }}
                        />
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

        {/* Legenda */}
        <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {Object.entries(classificacaoData.legenda).map(([key, val]) => (
            <span key={key} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#717971' }}>
              <strong style={{ color: '#414942' }}>{key}</strong> = {val}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
