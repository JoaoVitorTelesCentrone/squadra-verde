'use client';

import { useState, useEffect, useCallback } from 'react';
import jogosData from '@/data/jogos_ranking.json';
import type { Resultado } from '@/lib/types';

type PartidaInput = { games1: string; games2: string };
type JogoState = {
  realizado: boolean;
  partidas: [PartidaInput, PartidaInput, PartidaInput];
  saving: boolean;
  saved: boolean;
};

const EMPTY_PARTIDAS: [PartidaInput, PartidaInput, PartidaInput] = [
  { games1: '', games2: '' },
  { games1: '', games2: '' },
  { games1: '', games2: '' },
];

function buildPairings(dupla1: string[], dupla2: string[]) {
  const [A, B] = dupla1;
  const [C, D] = dupla2;
  return [
    { label: 'AB × CD', pair1: `${A} + ${B}`, pair2: `${C} + ${D}` },
    { label: 'AC × BD', pair1: `${A} + ${C}`, pair2: `${B} + ${D}` },
    { label: 'AD × BC', pair1: `${A} + ${D}`, pair2: `${B} + ${C}` },
  ];
}

export default function AdminPage() {
  const [form, setForm] = useState<Record<number, JogoState>>({});
  const [loading, setLoading] = useState(true);
  const [rodadaAtiva, setRodadaAtiva] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/resultados')
      .then(r => r.json())
      .then((data: { resultados: Resultado[] }) => {
        const map: Record<number, JogoState> = {};
        const resultadosMap = new Map(data.resultados.map(r => [r.jogo_id, r]));

        for (const rodada of jogosData.rodadas) {
          for (const jogo of rodada.jogos) {
            const r = resultadosMap.get(jogo.id);
            map[jogo.id] = {
              realizado: r?.realizado ?? false,
              partidas: r?.partidas
                ? [
                    { games1: String(r.partidas[0]?.games1 ?? ''), games2: String(r.partidas[0]?.games2 ?? '') },
                    { games1: String(r.partidas[1]?.games1 ?? ''), games2: String(r.partidas[1]?.games2 ?? '') },
                    { games1: String(r.partidas[2]?.games1 ?? ''), games2: String(r.partidas[2]?.games2 ?? '') },
                  ]
                : [...EMPTY_PARTIDAS.map(p => ({ ...p }))] as [PartidaInput, PartidaInput, PartidaInput],
              saving: false,
              saved: false,
            };
          }
        }
        setForm(map);
        setLoading(false);
      });
  }, []);

  const updatePartida = useCallback((jogoId: number, idx: number, field: 'games1' | 'games2', value: string) => {
    setForm(prev => {
      const state = prev[jogoId];
      const newPartidas = state.partidas.map((p, i) =>
        i === idx ? { ...p, [field]: value } : p
      ) as [PartidaInput, PartidaInput, PartidaInput];
      return { ...prev, [jogoId]: { ...state, partidas: newPartidas, saved: false } };
    });
  }, []);

  const toggleRealizado = useCallback((jogoId: number) => {
    setForm(prev => ({
      ...prev,
      [jogoId]: { ...prev[jogoId], realizado: !prev[jogoId].realizado, saved: false },
    }));
  }, []);

  const salvar = useCallback(async (jogoId: number) => {
    const state = form[jogoId];
    setForm(prev => ({ ...prev, [jogoId]: { ...prev[jogoId], saving: true } }));

    const partidasValidas = state.partidas.every(
      p => p.games1 !== '' && p.games2 !== ''
    );
    const partidas = partidasValidas
      ? state.partidas.map(p => ({ games1: Number(p.games1), games2: Number(p.games2) }))
      : null;

    await fetch('/api/resultados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jogo_id: jogoId, realizado: state.realizado, partidas }),
    });

    setForm(prev => ({ ...prev, [jogoId]: { ...prev[jogoId], saving: false, saved: true } }));
    setTimeout(() => setForm(prev => ({ ...prev, [jogoId]: { ...prev[jogoId], saved: false } })), 3000);
  }, [form]);

  const rodadasVisiveis = rodadaAtiva === null
    ? jogosData.rodadas
    : jogosData.rodadas.filter(r => r.rodada === rodadaAtiva);

  const totalComPlacar = Object.values(form).filter(s => s.realizado && s.partidas.every(p => p.games1 !== '' && p.games2 !== '')).length;
  const totalRealizados = Object.values(form).filter(s => s.realizado).length;

  return (
    <div style={{ minHeight: '100vh', background: '#f8faf5' }}>
      {/* Header */}
      <div style={{ background: '#1a3a2a', borderBottom: '2px solid #191c19' }}>
        <div className="page-header-inner">
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: 'rgba(157,211,170,0.6)', textTransform: 'uppercase', marginBottom: 8 }}>
            Administração
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 'clamp(28px, 4vw, 48px)', color: '#e8e8d8', letterSpacing: '-0.02em' }}>
              Inserir Resultados
            </h1>
            {!loading && (
              <div style={{ display: 'flex', gap: 12 }}>
                <span className="chip-green">{totalComPlacar} com placar</span>
                <span className="chip-pending">{totalRealizados - totalComPlacar} sem placar</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="page-body-inner">
        {loading ? (
          <div style={{ padding: 80, textAlign: 'center' }}>
            <span style={{ display: 'inline-block', width: 32, height: 32, border: '3px solid #e7e9e4', borderTopColor: '#2c694e', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          </div>
        ) : (
          <>
            {/* Rodada tabs */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 32 }}>
              <button
                onClick={() => setRodadaAtiva(null)}
                style={tabStyle(rodadaAtiva === null)}
              >
                Todas
              </button>
              {jogosData.rodadas.map(r => (
                <button
                  key={r.rodada}
                  onClick={() => setRodadaAtiva(rodadaAtiva === r.rodada ? null : r.rodada)}
                  style={tabStyle(rodadaAtiva === r.rodada)}
                >
                  R{r.rodada}
                </button>
              ))}
            </div>

            {/* Rodadas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
              {rodadasVisiveis.map(rodada => (
                <div key={rodada.rodada}>
                  {/* Rodada header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid #191c19' }}>
                    <div style={{ background: '#2e312e', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 14, color: '#ffffff', letterSpacing: '0.05em' }}>
                        RODADA {rodada.rodada}
                      </span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#9dd3aa' }}>
                        {rodada.data}
                      </span>
                    </div>
                  </div>

                  {/* Jogos grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: 20 }}>
                    {rodada.jogos.map(jogo => {
                      const state = form[jogo.id];
                      if (!state) return null;
                      const pairings = buildPairings(jogo.dupla1, jogo.dupla2);
                      const temPlacar = state.partidas.every(p => p.games1 !== '' && p.games2 !== '');

                      return (
                        <div
                          key={jogo.id}
                          style={{
                            background: '#ffffff',
                            border: `1px solid ${state.realizado ? '#2c694e' : '#c1c9bf'}`,
                            boxShadow: `3px 3px 0 ${state.realizado ? '#2c694e' : '#c1c9bf'}`,
                          }}
                        >
                          {/* Card header */}
                          <div style={{ background: state.realizado ? '#1a3a2a' : '#2e312e', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#9dd3aa' }}>{jogo.horario}</span>
                              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(157,211,170,0.5)' }}>#R{rodada.rodada}.{jogo.id}</span>
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={state.realizado}
                                onChange={() => toggleRealizado(jogo.id)}
                                style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#9dd3aa' }}
                              />
                              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: state.realizado ? '#9dd3aa' : 'rgba(157,211,170,0.5)', textTransform: 'uppercase' }}>
                                Realizado
                              </span>
                            </label>
                          </div>

                          {/* Duplas summary */}
                          <div style={{ padding: '12px 16px 8px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #e7e9e4' }}>
                            <div style={{ flex: 1 }}>
                              {jogo.dupla1.map(n => (
                                <p key={n} style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 600, fontSize: 13, color: '#191c19', lineHeight: 1.3 }}>{n}</p>
                              ))}
                            </div>
                            <div style={{ width: 28, height: 28, background: '#1a4d2e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 10, color: '#9dd3aa' }}>VS</span>
                            </div>
                            <div style={{ flex: 1, textAlign: 'right' }}>
                              {jogo.dupla2.map(n => (
                                <p key={n} style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 600, fontSize: 13, color: '#191c19', lineHeight: 1.3 }}>{n}</p>
                              ))}
                            </div>
                          </div>

                          {/* Partidas */}
                          {state.realizado && (
                            <div style={{ padding: '12px 16px' }}>
                              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#717971', marginBottom: 10 }}>
                                Placar das partidas
                              </p>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {pairings.map((p, i) => (
                                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto 1fr', alignItems: 'center', gap: 8, background: '#f8faf5', padding: '8px 10px', border: '1px solid #e7e9e4' }}>
                                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#414942', lineHeight: 1.3 }}>{p.pair1}</span>
                                    <input
                                      type="number"
                                      min="0"
                                      max="99"
                                      value={state.partidas[i].games1}
                                      onChange={e => updatePartida(jogo.id, i, 'games1', e.target.value)}
                                      placeholder="0"
                                      style={scoreInputStyle}
                                    />
                                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: '#c1c9bf', textAlign: 'center' }}>×</span>
                                    <input
                                      type="number"
                                      min="0"
                                      max="99"
                                      value={state.partidas[i].games2}
                                      onChange={e => updatePartida(jogo.id, i, 'games2', e.target.value)}
                                      placeholder="0"
                                      style={scoreInputStyle}
                                    />
                                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#414942', textAlign: 'right', lineHeight: 1.3 }}>{p.pair2}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Footer */}
                          <div style={{ padding: '10px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: state.realizado ? '1px solid #e7e9e4' : 'none' }}>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: state.realizado && temPlacar ? '#2c694e' : '#c1c9bf' }}>
                              {!state.realizado ? 'Jogo pendente' : temPlacar ? '✓ Placar completo' : '⚠ Placar não preenchido'}
                            </span>
                            <button
                              onClick={() => salvar(jogo.id)}
                              disabled={state.saving}
                              style={{
                                padding: '8px 16px',
                                background: state.saved ? '#2c694e' : state.saving ? '#e7e9e4' : '#00361a',
                                color: state.saved || state.saving ? '#717971' : '#9dd3aa',
                                border: '1px solid #191c19',
                                boxShadow: state.saving ? 'none' : '2px 2px 0 #191c19',
                                fontFamily: "'DM Mono', monospace",
                                fontSize: 12,
                                fontWeight: 700,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                cursor: state.saving ? 'not-allowed' : 'pointer',
                              }}
                            >
                              {state.saving ? 'Salvando...' : state.saved ? '✓ Salvo' : 'Salvar'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: '7px 14px',
  fontFamily: "'DM Mono', monospace",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  border: '1px solid #191c19',
  cursor: 'pointer',
  background: active ? '#00361a' : '#ffffff',
  color: active ? '#9dd3aa' : '#414942',
});

const scoreInputStyle: React.CSSProperties = {
  width: 44,
  padding: '6px 8px',
  textAlign: 'center',
  border: '1px solid #c1c9bf',
  background: '#ffffff',
  fontFamily: "'DM Mono', monospace",
  fontSize: 16,
  fontWeight: 700,
  color: '#191c19',
  outline: 'none',
};
