import { Board } from "../model/Board"
import { useNavigate } from "react-router-dom";

const rows = ['1', '2', '3', '4', '5', '6', '7', '8']
const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const keyMap: {[key: string]: string} = {'r': 'br', 'n' : 'bn', 'b': 'bb', 'k': 'bk', 'q': 'bq', 'p': 'bp',
    'R': 'wr', 'N': 'wn', 'B': 'wb', 'K': 'wk', 'Q': 'wq'}

export const BoardPreview: React.FC<{ board: Board }> = ({ board }) => {

    const navigate = useNavigate()
    const boardKey: string[][] = boardKeyConverter(board?.fen?.boardKey)

    function boardKeyConverter(oldKey: string[]): string[][] {
        const keyIndex: {[key: string] : number} = {'R': 0, 'N': 0, 'B': 0, 'K': 0, 'Q': 0, 'P': 0,
            'r': 0, 'n': 0, 'b': 0, 'k': 0, 'q': 0, 'p': 0}
            console.log(oldKey)
        return oldKey?.map(row => row.split('').map(key => {
            keyIndex[key]++
            return keyMap[key] + keyIndex[key]
        }));
    }

    return (
        <div className="flex flex-col mb-5">
            <div className="flex flex-row">
                <span className="mx-1 select-none hover:text-white" onClick={board.white?.name === 'anonymous' ? () => {} : () => navigate(`/player/${board.white?.name}`)}>
                    {board.white?.name}
                </span>
                <span>vs.</span>
                <span className="mx-1 select-none hover:text-white" onClick={board.black?.name === 'anonymous' ? () => {} : () => navigate(`/player/${board.black?.name}`)}>
                    {board.black?.name}
                </span>
            </div>
            <div className="flex flex-col-reverse w-[350px] h-[350px] min-w-[350px] min-h[350px] bg-white text-xs" onClick={() => navigate(`/${board.id}`)}>
                {boardKey.map((row, i) => {
                    return <div className="flex flex-row w-full h-[12.5%]" key={i}>
                        {row?.map((key, j) => {
                            return <div className={`flex relative w-[12.5%] h-full
                            ${i % 2 === 0 ? (j % 2 === 0 ? 'bg-sky-500 text-white' : 'text-sky-500') :
                                    (j % 2 === 0 ? 'text-sky-500' : 'bg-sky-500 text-white')}`} key={j}>
                                <span id={key} className="flex absolute top-0 left-0 w-full h-full">
                                    {key !== '' ? <img className="w-full h-full" src={`/chess_2/${key.substring(0, 2)}.png`} alt="/chess_2/bp.png" /> : null}
                                    {i === 0 ? <span className="absolute bottom-1 right-1">{cols[j]}</span> : null}
                                    {j === 0 ? <span className="absolute top-0 left-1">{rows[i]}</span> : null}
                                </span>
                            </div>
                        })}
                    </div>
                })}
            </div>
            <div className="flex flex-row">
                <span className="select-none mr-1">{board.stalemate ? 'draw - ' : board.checkmate ? 'checkmate - ' : board.winner === 0 ? (board.fen.whiteToMove ? 'white to move' : 'black to move') : board.winner === 1 ? 'black resigned - ' : 'white resigned - '}</span>
                <span className="select-none">{board.winner === 1 ? 'white wins' : board.winner === 2 ? 'black wins' : null}</span>
            </div>
        </div>
    )
}