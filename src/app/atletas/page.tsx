'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import classificacao from '@/data/classificacao_ranking.json';

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

const AVATAR_COLORS = [
  '#00361a', '#1a4d2e', '#2c694e', '#1b5e35',
  '#0d4a24', '#3a7a54', '#14503c', '#256845',
];

export default function AtletasPage() {
  const [busca, setBusca] = useState('');

  const jogadores = useMemo(() =>
    [...classificacao.ranking].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
    []
  );

  const filtrados = useMemo(() =>
    busca
      ? jogadores.filter(j => j.nome.toLowerCase().includes(busca.toLowerCase()))
      : jogadores,
    [busca, jogadores]
  );

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
            Atletas
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#717971' }}>
            {classificacao.ranking.length} atletas inscritos na temporada
          </p>
        </div>
      </div>

      <div className="page-body-inner">

        {/* ── BUSCA ── */}
        <div style={{ marginBottom: 28, display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Buscar atleta..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{
              flex: 1,
              maxWidth: 400,
              padding: '10px 16px',
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

        {/* ── GRID ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 12,
          }}
        >
          {filtrados.map((j, i) => {
            const ativo = j.jogos > 0;
            const cor = AVATAR_COLORS[i % AVATAR_COLORS.length];
            return (
              <Link
                key={j.nome}
                href={`/atletas/${slugify(j.nome)}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e7e9e4',
                    padding: '24px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    textAlign: 'center',
                    height: '100%',
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
                  {/* Avatar */}
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      background: cor,
                      border: '1px solid #191c19',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: 18,
                      color: '#9dd3aa',
                      flexShrink: 0,
                    }}
                  >
                    {INITIALS(j.nome)}
                  </div>

                  {/* Nome */}
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: 14,
                      color: '#191c19',
                      lineHeight: 1.3,
                    }}
                  >
                    {j.nome}
                  </p>

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
