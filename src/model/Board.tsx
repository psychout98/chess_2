export interface BoardResponse {
    player: Player,
    board: Board
}

export interface Board {
    id: string,
    white: Player,
    black: Player,
    boardKey: string[],
    whiteToMove: boolean,
    check: boolean,
    checkmate: boolean,
    stalemate: boolean,
    moves: { [key: string]: Move },
    history: { [key: number]: Move },
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
    boardKeyString: string,
    valid: boolean
}