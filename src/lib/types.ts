export interface Jogador {
  posicao: number;
  nome: string;
  jogos: number;
  vitorias: number;
  derrotas: number;
  percentual_vitorias: number;
  games_vencidos: number;
  games_perdidos: number;
  saldo_games: number;
}

export interface Jogo {
  id: number;
  horario: string;
  dupla1: string[];
  dupla2: string[];
}

export interface Rodada {
  rodada: number;
  data: string;
  jogos: Jogo[];
}

export interface Resultado {
  id: number;
  rodada: number;
  jogo_id: number;
  data: string;
  horario: string;
  dupla1: string[];
  dupla2: string[];
  realizado: boolean;
  data_realizada?: string;
}

export interface Lance {
  id: number;
  titulo: string;
  rodada: number;
  jogador: string;
  tipo: 'Smash' | 'Defesa' | 'Ace' | 'Voleio' | 'Largada' | 'Outro';
  midia_tipo: 'video' | 'foto';
  midia_url: string;
  thumbnail_url: string;
  descricao: string;
  data: string;
  curtidas: number;
}
