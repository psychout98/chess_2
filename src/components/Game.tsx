import { useState } from "react";
import { Board, Piece } from "../model/Board";

export const Game: React.FC<{ board: Board, move: Function, player: number }> = ({ board, move, player }) => {

    const [selected, setSelected] = useState<string | undefined>(undefined)
    const [currentSpot, setCurrentSpot] = useState<string>('')
    const [moves, setMoves] = useState<string[]>([])
    const myMove = (board.whiteToMove && player === 1) || (!board.whiteToMove && player === 2)
    const rows = ['1', '2', '3', '4', '5', '6', '7', '8']
    const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

    return (
        <div className="flex flex-col w-full h-full items-center justify-center">
            <div className="flex flex-row overflow-x-scroll">
                {Object.keys(board.history).map((moveNum) => {
                    return <span>{moveNum}</span>
                })}
            </div>
            <div className={`flex ${player === 0 || player === 1 ? 'flex-col-reverse' : 'flex-col'} w-[350px] h-[350px] sm:w-[600px] sm:h-[600px] aspect-square bg-white text-xs`}>
                {board.boardKey?.map((row, i) => {
                    return <div className={`flex ${player === 2 ? 'flex-row-reverse' : 'flex-row'} w-full h-[12.5%]`} key={i}>
                        {row?.map((key, j) => {
                            let spot = i.toString() + j.toString()
                            return <div className={`flex relative w-[12.5%] h-full ${i % 2 === 0 ? (j % 2 === 0 ? 'bg-sky-500 text-white' : 'text-sky-500') : (j % 2 === 0 ? 'text-sky-500' : 'bg-sky-500 text-white')}`} key={j}>
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
                                }}>
                                {key !== '' ? <img src={`/chess_2/${key.substring(0, 2)}.png`} /> : null}
                                {i === 0 ? <span className={`absolute ${player === 0 || player === 1 ? 'bottom-1' : 'top-0'} left-1`}>{cols[j]}</span> : null}
                                {j === 0 ? <span className={`absolute ${player === 0 || player === 1 ? 'top-0 left-1' : 'bottom-1 right-1'}`}>{rows[i]}</span> : null}
                                </span>
                            </div>
                        })}
                    </div>
                })}
            </div>
            {board.stalemate ? 'draw' : board.checkmate ? 'checkmate' : null}
        </div>
    )
}