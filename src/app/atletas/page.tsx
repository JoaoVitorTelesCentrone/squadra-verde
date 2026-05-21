'use client';

import { useState, useMemo } from 'react';
import classificacaoM from '@/data/classificacao_ranking.json';
import rankingBronzeF from '@/data/ranking_feminino.json';
import rankingPrataF from '@/data/ranking_prata_feminino.json';

const INITIALS = (nome: string) =>
  nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

type Categoria = 'todos' | 'masculino' | 'bronze-f' | 'prata-f';

const AVATAR_BG: Record<string, string[]> = {
  masculino: ['#00361a', '#1a4d2e', '#2c694e', '#1b5e35', '#0d4a24', '#3a7a54'],
  'bronze-f': ['#5c3a1e', '#7a4e2d', '#3d2510', '#6b4530', '#4a2e15', '#8a5c35'],
  'prata-f':  ['#1c2830', '#2a3540', '#3a4f60', '#253040', '#354555', '#1a2e3a'],
};

const CATEGORIA_LABEL: Record<string, string> = {
  masculino: 'Masculino',
  'bronze-f': 'Feminino Bronze',
  'prata-f':  'Feminino Prata',
};

const CATEGORIA_ACCENT: Record<string, string> = {
  masculino: '#9dd3aa',
  'bronze-f': '#c8a878',
  'prata-f':  '#b8c5cf',
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
      <div className="page-head">
        <div className="page-head-inner">
          <p className="section-label" style={{ marginBottom: 10, color: 'var(--verde-glow)' }}>Beach Tennis · Temporada 2026</p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 'clamp(54px, 12vw, 72px)',
              color: 'var(--paper)',
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              lineHeight: 0.95,
              marginBottom: 14,
            }}
          >
            Atletas
          </h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: 'color-mix(in oklch, var(--paper) 50%, transparent)', letterSpacing: '0.05em' }}>
            {todos.length} atletas inscritos · Masculino, Feminino Bronze e Feminino Prata
          </p>
        </div>
      </div>

      <div className="page-body-inner">

        {/* ── TABS ── */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, padding: '3px', background: 'var(--sand-2)', border: '1px solid var(--line)', borderRadius: 100, width: 'fit-content' }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: tab === t.key ? 'var(--ink)' : 'transparent',
                color: tab === t.key ? 'var(--paper)' : 'color-mix(in oklch, var(--ink) 50%, transparent)',
                fontFamily: "var(--font-mono)",
                fontWeight: 500,
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s',
                borderRadius: 100,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── BUSCA ── */}
        <div style={{ marginBottom: 28, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Buscar atleta..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{
              flex: '1 1 200px',
              width: 'min(100%, 400px)',
              padding: '10px 16px',
              border: '1px solid var(--line)',
              background: 'var(--sand)',
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              color: 'var(--ink)',
              outline: 'none',
            }}
          />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: 'color-mix(in oklch, var(--ink) 45%, transparent)', whiteSpace: 'nowrap' }}>
            {filtrados.length} de {total}
          </span>
        </div>

        {/* ── GRID ── */}
        <div
          className="atletas-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(180px, 100%), 1fr))',
            gap: 12,
          }}
        >
          {filtrados.map(j => (
            <div
              key={`${j.categoria}-${j.nome}`}
              style={{
                background: 'var(--paper)',
                border: '1px solid var(--line)',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                textAlign: 'center',
                height: '100%',
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
                    fontFamily: "var(--font-display)",
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
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 14,
                    color: 'var(--ink)',
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
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    fontSize: 9,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {CATEGORIA_LABEL[j.categoria]}
                </span>
            </div>
          ))}
        </div>

        {filtrados.length === 0 && (
          <div style={{ padding: 60, textAlign: 'center', border: '1px solid var(--line)', background: 'var(--paper)' }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 18, color: 'color-mix(in oklch, var(--ink) 45%, transparent)' }}>
              Nenhum atleta encontrado
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

