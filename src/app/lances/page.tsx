'use client';

import { useState, useEffect, useRef } from 'react';
import lancesData from '@/data/lances.json';
import type { Lance } from '@/lib/types';

/* ── curtidas via localStorage ── */
function useCurtidas(lances: Lance[]) {
  const [curtidas, setCurtidas] = useState<Record<number, number>>({});

  useEffect(() => {
    const saved = localStorage.getItem('sv_curtidas');
    if (saved) {
      setCurtidas(JSON.parse(saved));
    } else {
      const init: Record<number, number> = {};
      lances.forEach(l => { init[l.id] = l.curtidas; });
      setCurtidas(init);
    }
  }, [lances]);

  function curtir(id: number) {
    if (localStorage.getItem(`sv_liked_${id}`)) return;
    setCurtidas(prev => {
      const next = { ...prev, [id]: (prev[id] ?? 0) + 1 };
      localStorage.setItem('sv_curtidas', JSON.stringify(next));
      localStorage.setItem(`sv_liked_${id}`, '1');
      return next;
    });
  }

  const isLiked = (id: number) =>
    typeof window !== 'undefined' && !!localStorage.getItem(`sv_liked_${id}`);

  return { curtidas, curtir, isLiked };
}

/* ── Modal de vídeo ── */
function VideoModal({ lance, curtidas, onCurtir, isLiked, onClose }: {
  lance: Lance;
  curtidas: number;
  onCurtir: () => void;
  isLiked: boolean;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.92)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--ink)',
          border: '1px solid #2e312e',
          width: '100%',
          maxWidth: 720,
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderBottom: '1px solid #2e312e',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 15,
              color: '#ffffff',
              letterSpacing: '-0.01em',
            }}
          >
            {lance.titulo}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid #414942',
              color: 'var(--verde-glow)',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ background: '#000000', flexShrink: 0 }}>
          <video
            ref={videoRef}
            src={lance.midia_url}
            controls
            autoPlay
            style={{ width: '100%', display: 'block', maxHeight: '60vh' }}
          />
        </div>

        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: 'var(--verde-glow)', marginBottom: 3 }}>
              {lance.jogador}
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: 'color-mix(in oklch, var(--ink) 45%, transparent)' }}>
              Rodada {lance.rodada} · {lance.data}
            </p>
            {lance.descricao && (
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: 'rgba(240,241,236,0.6)', marginTop: 6, lineHeight: 1.5 }}>
                {lance.descricao}
              </p>
            )}
          </div>
          <button
            onClick={onCurtir}
            disabled={isLiked}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              background: isLiked ? '#1a4d2e' : 'none',
              border: `1px solid ${isLiked ? '#2c694e' : '#414942'}`,
              color: 'var(--verde-glow)',
              padding: '8px 16px',
              fontFamily: "var(--font-display)",
              fontSize: 14,
              fontWeight: 600,
              cursor: isLiked ? 'default' : 'pointer',
              flexShrink: 0,
            }}
          >
            {isLiked ? '❤️' : '🤍'} {curtidas}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Card de lance ── */
function LanceCard({ lance, curtidas, onCurtir, isLiked, onClick }: {
  lance: Lance;
  curtidas: number;
  onCurtir: (e: React.MouseEvent) => void;
  isLiked: boolean;
  onClick: () => void;
}) {
  return (
    <div
      style={{
        background: 'var(--paper)',
        border: '1px solid var(--ink)',
        boxShadow: '4px 4px 0 var(--ink)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onClick}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translate(-2px,-2px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '6px 6px 0 var(--ink)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'none';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '4px 4px 0 var(--ink)';
      }}
    >
      <div
        style={{
          height: 200,
          background: 'linear-gradient(135deg, #1a4d2e 0%, #00361a 100%)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(157,211,170,0.12) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />
        <div
          style={{
            width: 52,
            height: 52,
            background: 'rgba(255,255,255,0.12)',
            border: '2px solid rgba(255,255,255,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path d="M2 2l12 8-12 8V2z" fill="white" />
          </svg>
        </div>
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.5)',
              background: 'rgba(0,0,0,0.3)',
              padding: '2px 7px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            R{lance.rodada}
          </span>
        </div>
      </div>

      <div style={{ padding: '16px 16px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 15,
            color: 'var(--ink)',
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
          }}
        >
          {lance.titulo}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            fontSize: 13,
            color: '#2c694e',
          }}
        >
          {lance.jogador}
        </p>
        {lance.descricao && (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: 'color-mix(in oklch, var(--ink) 45%, transparent)',
              lineHeight: 1.5,
              flex: 1,
            }}
          >
            {lance.descricao}
          </p>
        )}
      </div>

      <div
        style={{
          padding: '10px 16px',
          borderTop: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: '#c1c9bf' }}>
          {lance.data}
        </span>
        <button
          onClick={onCurtir}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            background: isLiked ? '#f0f9f4' : 'none',
            border: `1px solid ${isLiked ? '#2c694e' : 'var(--line)'}`,
            padding: '4px 10px',
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            fontWeight: 600,
            color: isLiked ? '#00361a' : '#717971',
            cursor: isLiked ? 'default' : 'pointer',
          }}
        >
          {isLiked ? '❤️' : '🤍'} {curtidas}
        </button>
      </div>
    </div>
  );
}

/* ── Página ── */
export default function LancesPage() {
  const lances: Lance[] = lancesData.lances as Lance[];
  const { curtidas, curtir, isLiked } = useCurtidas(lances);
  const [modal, setModal] = useState<Lance | null>(null);

  return (
    <div>
      {/* ── HEADER ── */}
      <div className="page-head">
        <div className="page-head-inner">
          <p className="section-label" style={{ marginBottom: 10, color: 'var(--verde-glow)' }}>Temporada 2026</p>
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
            Melhores Lances
          </h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: 'color-mix(in oklch, var(--paper) 50%, transparent)' }}>
            Os melhores momentos da temporada · Clique para assistir
          </p>
        </div>
      </div>

      <div className="page-body-inner">
        {lances.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {lances.map(lance => (
              <LanceCard
                key={lance.id}
                lance={lance}
                curtidas={curtidas[lance.id] ?? lance.curtidas}
                onCurtir={e => { e.stopPropagation(); curtir(lance.id); }}
                isLiked={isLiked(lance.id)}
                onClick={() => setModal(lance)}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '80px 32px',
              textAlign: 'center',
              border: '2px dashed #c1c9bf',
              background: 'var(--sand)',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                background: 'linear-gradient(135deg, #1a4d2e, #00361a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <svg width="24" height="30" viewBox="0 0 16 20" fill="none">
                <path d="M2 2l12 8-12 8V2z" fill="white" />
              </svg>
            </div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 20,
                color: 'var(--ink)',
                marginBottom: 8,
              }}
            >
              Em breve
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: 'color-mix(in oklch, var(--ink) 45%, transparent)' }}>
              Os melhores lances da temporada serão publicados aqui
            </p>
          </div>
        )}
      </div>

      {/* ── MODAL ── */}
      {modal && (
        <VideoModal
          lance={modal}
          curtidas={curtidas[modal.id] ?? modal.curtidas}
          onCurtir={() => curtir(modal.id)}
          isLiked={isLiked(modal.id)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
