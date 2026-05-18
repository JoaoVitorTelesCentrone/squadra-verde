'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import classificacaoM from '@/data/classificacao_ranking.json';
import rankingBronzeF from '@/data/ranking_feminino.json';
import rankingPrataF from '@/data/ranking_prata_feminino.json';

function slugify(nome: string) {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

const INITIALS = (nome: string) =>
  nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

type Categoria = 'todos' | 'masculino' | 'bronze-f' | 'prata-f';

const AVATAR_BG: Record<string, string[]> = {
  masculino: ['#00361a', '#1a4d2e', '#2c694e', '#1b5e35', '#0d4a24', '#3a7a54'],
  'bronze-f': ['#6b2c4a', '#8b3a5e', '#7a2040', '#5a1f38', '#a04870', '#4d1a30'],
  'prata-f':  ['#0f1e35', '#1a3050', '#233d60', '#162842', '#2a4870', '#0d2240'],
};

const CATEGORIA_LABEL: Record<string, string> = {
  masculino: 'Masculino',
  'bronze-f': 'Feminino Bronze',
  'prata-f':  'Feminino Prata',
};

const CATEGORIA_ACCENT: Record<string, string> = {
  masculino: '#9dd3aa',
  'bronze-f': '#e8b4c8',
  'prata-f':  '#b8cff2',
};

const TABS: { key: Categoria; label: string }[] = [
  { key: 'todos',     label: 'Todos' },
  { key: 'masculino', label: 'Masculino' },
  { key: 'bronze-f',  label: 'F Bronze' },
  { key: 'prata-f',   label: 'F Prata' },
];

export default function AtletasPage() {
  const [busca, setBusca] = useState('');
  const [tab, setTab] = useState<Categoria>('todos');

  const todos = useMemo(() => {
    const m = classificacaoM.ranking.map((j, i) => ({
      nome: j.nome,
      categoria: 'masculino' as const,
      avatarBg: AVATAR_BG.masculino[i % AVATAR_BG.masculino.length],
      ativo: j.jogos > 0,
    }));
    const bf = rankingBronzeF.atletas.map((j, i) => ({
      nome: j.nome,
      categoria: 'bronze-f' as const,
      avatarBg: AVATAR_BG['bronze-f'][i % AVATAR_BG['bronze-f'].length],
      ativo: j.jogos > 0,
    }));
    const pf = rankingPrataF.atletas.map((j, i) => ({
      nome: j.nome,
      categoria: 'prata-f' as const,
      avatarBg: AVATAR_BG['prata-f'][i % AVATAR_BG['prata-f'].length],
      ativo: j.jogos > 0,
    }));
    return [...m, ...bf, ...pf].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }, []);

  const filtrados = useMemo(() => {
    let lista = tab === 'todos' ? todos : todos.filter(j => j.categoria === tab);
    if (busca) lista = lista.filter(j => j.nome.toLowerCase().includes(busca.toLowerCase()));
    return lista;
  }, [todos, tab, busca]);

  const total = tab === 'todos'
    ? todos.length
    : todos.filter(j => j.categoria === tab).length;

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
            {todos.length} atletas inscritos · Masculino, Feminino Bronze e Feminino Prata
          </p>
        </div>
      </div>

      <div className="page-body-inner">

        {/* ── TABS ── */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '8px 16px',
                border: '1px solid',
                borderColor: tab === t.key ? '#191c19' : '#c1c9bf',
                background: tab === t.key ? '#191c19' : '#ffffff',
                color: tab === t.key ? '#ffffff' : '#414942',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

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
            {filtrados.length} de {total}
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
          {filtrados.map(j => (
            <Link
              key={`${j.categoria}-${j.nome}`}
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
                  (e.currentTarget as HTMLDivElement).style.borderColor = j.avatarBg;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `3px 3px 0 ${j.avatarBg}`;
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
                    background: j.avatarBg,
                    border: '1px solid #191c19',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: 18,
                    color: CATEGORIA_ACCENT[j.categoria],
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

                {/* Categoria badge */}
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    background: j.avatarBg + '18',
                    border: `1px solid ${j.avatarBg}55`,
                    color: j.avatarBg,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: 9,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {CATEGORIA_LABEL[j.categoria]}
                </span>
              </div>
            </Link>
          ))}
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
