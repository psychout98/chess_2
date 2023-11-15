export interface BoardResponse {
    sessionId: string,
    board: Board
}

export interface Board {
    id: string,
    white: Player,
    black: Player,
    pieces: { [key: string]: Piece },
    boardKey: string[][],
    whiteToMove: boolean,
    currentMove: number,
    check: boolean,
    checkmate: boolean,
    stalemate: boolean,
    history: { [key: number]: Move },
    shallow: boolean,
    winner: number
}

export interface Player {
    name: string,
    sessionId: string
}

export interface Move {
    moveCode: string,
    moveString: string,
    boardKeyString: string,
    origin: number[],
    destination: number[],
    attack: boolean
}

export interface Piece {
    row: number,
    col: number,
    white: boolean,
    moves: Move[]
}