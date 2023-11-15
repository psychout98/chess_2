import { useState, useEffect } from "react";
import { Board, Piece } from "../model/Board";

export const Game: React.FC<{ board: Board, player: number, move: Function, getBoard: Function, handleRematch: Function }> = ({ board, player, move, getBoard, handleRematch }) => {

    const [selected, setSelected] = useState<string | undefined>(undefined)
    const [currentSpot, setCurrentSpot] = useState<string>('')
    const [moves, setMoves] = useState<string[]>([])
    const myMove = (board.whiteToMove && player === 1) || (!board.whiteToMove && player === 2)
    const rows = ['1', '2', '3', '4', '5', '6', '7', '8']
    const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const [viewingMove, setViewingMove] = useState<number>(board.currentMove)
    const [resigning, setResigning] = useState<boolean>(false)
    const [lastSpots, setLastSpots] = useState<string[]>(['', ''])

    useEffect(() => {
        if (board.currentMove > 0) {
            const lastMoveCode = viewingMove === board.currentMove ? board.history[board.currentMove]?.moveCode : ''
            setLastSpots([lastMoveCode.substring(0, 2), lastMoveCode.substring(2, 4)])
        }
    }, [selected, currentSpot, moves, viewingMove, resigning, lastSpots])

    function resign(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
        if (resigning) {
            setResigning(false)
            move("resign")
        } else {
            setResigning(true)
        }
    }

    function viewMove(move: number) {
        setViewingMove(move)
        getBoard(move)
    }

    function getHistory(): JSX.Element[] {
        var historyItems: JSX.Element[] = []
        for (var i = 1; i < Object.keys(board.history).length; i += 2) {
            historyItems.push(historyItem(i, board.history[i]?.moveString, board.history[i + 1]?.moveString || ''))
        }
        return historyItems
    }

    function historyItem(move: number, moveString1: string, moveString2: string) {
        const viewingMove1 = viewingMove === move
        const viewingMove2 = viewingMove === move + 1
        return (<span className="flex flex-nowrap p-1 whitespace-nowrap select-none" key={move}>
            <span className={`${viewingMove1 ? 'text-white' : ''} ml-1`}>{Math.ceil(move / 2)}.</span>
            <span className={`${viewingMove1 ? 'text-white' : ''} mx-1`} onClick={() => viewMove(move)}>{moveString1}</span>
            <span className={`${viewingMove2 ? 'text-white' : ''} mr-1`} onClick={() => viewMove(move + 1)}>{moveString2}</span></span>)
    }

    return (
        <div className="flex flex-col w-full h-full items-center justify-center">
            <div className="flex flex-row overflow-x-auto items-left w-[350px] sm:w-[600px] no-scrollbar">
                {getHistory().map((historyItem) => {
                    return historyItem
                })}
            </div>
            <div className={`flex ${player === 0 || player === 1 ? 'flex-col-reverse' : 'flex-col'} w-[350px] h-[350px] min-w-[350px] min-h[350px] sm:w-[600px] sm:h-[600px] sm:min-w[600px] sm:min-h-[600px] bg-white text-xs`}>
                {board.boardKey?.map((row, i) => {
                    return <div className={`flex ${player === 2 ? 'flex-row-reverse' : 'flex-row'} w-full h-[12.5%]`} key={i}>
                        {row?.map((key, j) => {
                            let spot = i.toString() + j.toString()
                            return <div className={`flex relative w-[12.5%] h-full
                            ${i % 2 === 0 ? (j % 2 === 0 ? 'bg-sky-500 text-white' : 'text-sky-500') : 
                            (j % 2 === 0 ? 'text-sky-500' : 'bg-sky-500 text-white')}`} key={j}>
                                <span id={key} className={`flex absolute top-0 left-0 w-full h-full
                                ${selected === key ? 'bg-green-300' : 
                                (moves.includes(spot) ? 'bg-green-300 opacity-50' : 
                                (spot === lastSpots[0] ?  'bg-indigo-300 opacity-60' : (spot === lastSpots[1] ? 'bg-indigo-300' : '')))}
                                ${board.check && key.includes(board.whiteToMove ? 'wk' : 'bk') ? 'bg-red-400' : ''}`} onMouseDown={(e) => {
                                    e.preventDefault()
                                    if (key.startsWith(board.whiteToMove ? 'w' : 'b') && myMove && !board.shallow) {
                                        setSelected(key)
                                        setCurrentSpot(spot)
                                        let piece: Piece | undefined = board.pieces[key]
                                        if (piece) {
                                            let pieceMoves: string[] | undefined = piece.moves.map(move => move.destination[0].toString() + move.destination[1].toString())
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
            <span>{board.stalemate ? 'draw' : board.checkmate ? 'checkmate' : board.winner === 0 ? (board.whiteToMove ? 'white to move' : 'black to move') : ''}</span>
            <span>{board.winner === 1 ? 'white wins' : board.winner === 2 ? 'black wins' : null}</span>
            {player !== 0 ? (board.winner === 0 ?
                <div className={`flex ${resigning ? 'bg-red-300' : 'bg-white'} px-3 select-none mt-1`} onClick={resign}>resign</div> :
                <div className={`flex bg-white px-3 select-none`} onClick={() => handleRematch()}>rematch</div>) : null
            }
        </div>
    )
}