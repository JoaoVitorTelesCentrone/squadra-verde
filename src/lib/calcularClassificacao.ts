import type { Jogador, Jogo, Resultado } from './types';

type Stats = {
  nome: string;
  jogos: number;
  vitorias: number;
  derrotas: number;
  games_vencidos: number;
  games_perdidos: number;
};

export function calcularClassificacao(jogos: Jogo[], resultados: Resultado[]): Jogador[] {
  const resultadosMap = new Map(resultados.map(r => [r.jogo_id, r]));

  const statsMap = new Map<string, Stats>();
  for (const jogo of jogos) {
    for (const nome of [...jogo.dupla1, ...jogo.dupla2]) {
      if (!statsMap.has(nome)) {
        statsMap.set(nome, { nome, jogos: 0, vitorias: 0, derrotas: 0, games_vencidos: 0, games_perdidos: 0 });
      }
    }
  }

  for (const jogo of jogos) {
    const resultado = resultadosMap.get(jogo.id);
    if (!resultado?.realizado || !resultado.partidas?.length) continue;

    const [A, B] = jogo.dupla1;
    const [C, D] = jogo.dupla2;

    // Combinações: AB×CD · AC×BD · AD×BC
    const pairings = [
      { pair1: [A, B], pair2: [C, D] },
      { pair1: [A, C], pair2: [B, D] },
      { pair1: [A, D], pair2: [B, C] },
    ];

    resultado.partidas.forEach((partida, i) => {
      if (i >= pairings.length) return;
      const { pair1, pair2 } = pairings[i];
      const { games1, games2 } = partida;
      const p1Win = games1 > games2;
      const p2Win = games2 > games1;

      for (const nome of pair1) {
        const s = statsMap.get(nome)!;
        s.jogos++;
        s.games_vencidos += games1;
        s.games_perdidos += games2;
        if (p1Win) s.vitorias++;
        else if (p2Win) s.derrotas++;
      }

      for (const nome of pair2) {
        const s = statsMap.get(nome)!;
        s.jogos++;
        s.games_vencidos += games2;
        s.games_perdidos += games1;
        if (p2Win) s.vitorias++;
        else if (p1Win) s.derrotas++;
      }
    });
  }

  const sorted = [...statsMap.values()].sort((a, b) => {
    const pvA = a.jogos > 0 ? a.vitorias / a.jogos : 0;
    const pvB = b.jogos > 0 ? b.vitorias / b.jogos : 0;
    if (pvB !== pvA) return pvB - pvA;
    const sgA = a.games_vencidos - a.games_perdidos;
    const sgB = b.games_vencidos - b.games_perdidos;
    return sgB - sgA;
  });

  return sorted.map((s, i) => ({
    posicao: i + 1,
    nome: s.nome,
    jogos: s.jogos,
    vitorias: s.vitorias,
    derrotas: s.derrotas,
    percentual_vitorias: s.jogos > 0 ? Math.round((s.vitorias / s.jogos) * 100) : 0,
    games_vencidos: s.games_vencidos,
    games_perdidos: s.games_perdidos,
    saldo_games: s.games_vencidos - s.games_perdidos,
  }));
}
