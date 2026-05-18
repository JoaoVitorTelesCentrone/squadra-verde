import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { Resultado } from '@/lib/types';

const filePath = join(process.cwd(), 'src/data/resultados_feminino.json');

function readResultados(): Resultado[] {
  try {
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw).resultados ?? [];
  } catch {
    return [];
  }
}

function writeResultados(resultados: Resultado[]) {
  writeFileSync(filePath, JSON.stringify({ resultados }, null, 2), 'utf-8');
}

export async function GET() {
  const resultados = readResultados();
  return NextResponse.json({ resultados });
}

export async function POST(request: Request) {
  try {
    const { jogo_id, realizado, partidas } = await request.json();
    const resultados = readResultados();
    const idx = resultados.findIndex(r => r.jogo_id === jogo_id);
    if (idx >= 0) {
      resultados[idx] = { jogo_id, realizado, partidas };
    } else {
      resultados.push({ jogo_id, realizado, partidas });
    }
    writeResultados(resultados);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
