export interface BoardResponse {
    player: Player,
    board: Board
}

export interface Board {
    id: string,
    white: Player,
    black: Player,
    fen: FEN,
    check: boolean,
    checkmate: boolean,
    stalemate: boolean,
    moves: { [key: string]: Move },
    history: { [key: number]: PGN },
    shallow: boolean,
    winner: number
}

export interface Player {
    name: string,
    id: string
}

export interface Move {
    moveCode: string,
    moveString: string,
    valid: boolean
}

export interface FEN {
    FEN: string,
    boardKey: string[],
    whiteToMove: boolean
}

export interface PGN {
    moveString: string,
    moveCode: string,
    FEN: string
}