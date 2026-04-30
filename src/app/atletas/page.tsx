'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import classificacao from '@/data/classificacao_ranking.json';

type Filtro = 'todos' | 'ativos' | 'aguardando';

const INITIALS = (nome: string) =>
  nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

function slugify(nome: string) {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export default function AtletasPage() {
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const jogadores = classificacao.ranking;
  const ativos = jogadores.filter(j => j.jogos > 0);

  const filtrados = useMemo(() => {
    return jogadores.filter(j => {
      if (busca && !j.nome.toLowerCase().includes(busca.toLowerCase())) return false;
      if (filtro === 'ativos' && j.jogos === 0) return false;
      if (filtro === 'aguardando' && j.jogos > 0) return false;
      return true;
    });
  }, [busca, filtro, jogadores]);

  return (
    <div>
      {/* ── PAGE HEADER ── */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e7e9e4' }}>
        <div className="page-header-inner">
          <p className="section-label" style={{ marginBottom: 10 }}>Beach Tennis · Temporada 2026</p>
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
            Participantes
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#717971' }}>
            {jogadores.length} atletas inscritos · {ativos.length} com jogos realizados
          </p>
        </div>
      </div>

      <div className="page-body-inner">

        {/* ── FILTROS ── */}
        <div className="filter-bar" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 0, border: '1px solid #191c19' }}>
            {([
              { key: 'todos', label: `Todos (${jogadores.length})` },
              { key: 'ativos', label: `Com jogos (${ativos.length})` },
              { key: 'aguardando', label: `Aguardando (${jogadores.length - ativos.length})` },
            ] as { key: Filtro; label: string }[]).map((f, i, arr) => (
              <button
                key={f.key}
                onClick={() => setFiltro(f.key)}
                style={{
                  padding: '8px 16px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRight: i < arr.length - 1 ? '1px solid #191c19' : 'none',
                  cursor: 'pointer',
                  background: filtro === f.key ? '#00361a' : '#ffffff',
                  color: filtro === f.key ? '#9dd3aa' : '#414942',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Buscar atleta..."
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

          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#717971', whiteSpace: 'nowrap' }}>
            {filtrados.length} atleta{filtrados.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── LISTA ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtrados.map(j => {
            const ativo = j.jogos > 0;
            return (
              <Link
                key={j.posicao}
                href={`/atletas/${slugify(j.nome)}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e7e9e4',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#00361a';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '3px 3px 0 #00361a';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translate(-1px,-1px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#e7e9e4';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                    (e.currentTarget as HTMLDivElement).style.transform = 'none';
                  }}
                >
                  {/* Position */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      background: ativo ? '#00361a' : '#f3f4ef',
                      border: `1px solid ${ativo ? '#191c19' : '#c1c9bf'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'DM Mono', monospace",
                      fontWeight: 500,
                      fontSize: 13,
                      color: ativo ? '#9dd3aa' : '#717971',
                      flexShrink: 0,
                    }}
                  >
                    {j.posicao}
                  </div>

                  {/* Avatar */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: ativo ? '#1a4d2e' : '#edeee9',
                      border: `1px solid ${ativo ? '#191c19' : '#c1c9bf'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: 15,
                      color: ativo ? '#9dd3aa' : '#717971',
                      flexShrink: 0,
                    }}
                  >
                    {INITIALS(j.nome)}
                  </div>

                  {/* Name */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: 15,
                        color: '#191c19',
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {j.nome}
                    </p>
                    {ativo && (
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#717971', marginTop: 2 }}>
                        {j.jogos}J · {j.vitorias}V · {j.derrotas}D
                      </p>
                    )}
                  </div>

                  {/* Stats ou status */}
                  {ativo ? (
                    <div className="atleta-row-stats" style={{ display: 'flex', gap: 20, alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500, fontSize: 18, color: '#00361a', lineHeight: 1 }}>
                          {j.percentual_vitorias}%
                        </div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#717971', marginTop: 2 }}>
                          Vitórias
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontWeight: 500,
                            fontSize: 18,
                            color: j.saldo_games > 0 ? '#00361a' : j.saldo_games < 0 ? '#ba1a1a' : '#717971',
                            lineHeight: 1,
                          }}
                        >
                          {j.saldo_games > 0 ? '+' : ''}{j.saldo_games}
                        </div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#717971', marginTop: 2 }}>
                          Saldo
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="chip-pending" style={{ fontSize: 10, flexShrink: 0 }}>⏳ Aguardando</span>
                  )}

                  {/* Chevron */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.3 }}>
                    <path d="M9 18l6-6-6-6" stroke="#191c19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        {filtrados.length === 0 && (
          <div style={{ padding: 60, textAlign: 'center', border: '1px solid #e7e9e4', background: '#ffffff' }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, color: '#717971' }}>
              Nenhum atleta encontrado
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
