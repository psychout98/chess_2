export interface Board {
    id: string,
    boardKey: string[][],
    history: { [key: number]: Move },
    pieces: { [key: string]: Piece },
    whiteToMove: boolean,
    currentMove: number,
    check: boolean,
    checkmate: boolean
}

export interface Move {
    moveCode: string,
    moveString: string
}

export interface Piece {
    row: number,
    col: number,
    white: boolean,
    moves: number[][]
}