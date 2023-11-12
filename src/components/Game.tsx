import { useState } from "react";
import { Board, Piece } from "../model/Board";

export const Game: React.FC<{ board: Board, move: Function, player: number }> = ({ board, move, player }) => {

    const [selected, setSelected] = useState<string | undefined>(undefined)
    const [currentSpot, setCurrentSpot] = useState<string>('')
    const [moves, setMoves] = useState<string[]>([])
    const myMove = (board.whiteToMove && player === 1) || (!board.whiteToMove && player === 2)

    return (
        <div className={`flex ${player === 0 || player === 1 ? 'flex-col-reverse' : 'flex-col'} w-[600px] h-[600px] bg-white`}>
            {board.stalemate ? 'draw' : board.checkmate ? 'checkmate' : null}
            {board.boardKey?.map((row, i) => {
                return <div className={`flex ${player === 2 ? 'flex-row-reverse' : 'flex-row'} w-full h-[75px]`} key={i}>
                    {row?.map((key, j) => {
                        let spot = i.toString() + j.toString()
                        return <div className={`flex relative w-[75px] h-full ${i % 2 === 0 ? (j % 2 === 0 ? 'bg-sky-500' : '') : (j % 2 === 0 ? '' : 'bg-sky-500')}`} key={j}>
                            <span id={key} className={`flex absolute top-0 left-0 w-full h-full  ${selected === key || moves.includes(spot) ? 'bg-green-400 opacity-50' : ''}`} onMouseDown={(e) => {
                                e.preventDefault()
                                if (key.startsWith(board.whiteToMove ? 'w' : 'b') && myMove) {
                                    setSelected(key)
                                    setCurrentSpot(spot)
                                    let piece: Piece | undefined = board.pieces[key]
                                    if (piece) {
                                        let pieceMoves: string[] | undefined = piece.moves.map(move => move[0].toString() + move[1].toString())
                                        setMoves(pieceMoves)
                                    }
                                } else if (moves.includes(spot)) {
                                    move(currentSpot + spot)
                                    setSelected(undefined)
                                    setCurrentSpot('')
                                    setMoves([])
                                }
                            }}>{key !== '' ? <img src={`./${key.substring(0, 2)}.png`}/> : null}</span>
                        </div>
                    })}
                </div>
            })}
        </div>
    )
}