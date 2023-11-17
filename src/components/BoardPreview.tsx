import { Board } from "../model/Board"
import { useNavigate } from "react-router-dom";

export const BoardPreview: React.FC<{ board: Board }> = ({ board }) => {

    const navigate = useNavigate()
    const rows = ['1', '2', '3', '4', '5', '6', '7', '8']
    const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

    return (
        <div>
            <div className="flex flex-row">
                <span className="mx-1 select-none hover:text-white" onClick={board.white?.name === 'anonymous' ? () => { } : () => navigate(`/player/${board.white?.name}`)}>
                    {board.white?.name}
                </span>
                <span>vs.</span>
                <span className="mx-1 select-none hover:text-white" onClick={board.white?.name === 'anonymous' ? () => { } : () => navigate(`/player/${board.black?.name}`)}>
                    {board.black?.name}
                </span>
            </div>
            <div className="flex flex-col-reverse w-[350px] h-[350px] min-w-[350px] min-h[350px] bg-white text-xs" onClick={() => navigate(`/${board.id}`)}>
                {board.boardKey?.map((row, i) => {
                    return <div className="flex flex-row w-full h-[12.5%]" key={i}>
                        {row?.map((key, j) => {
                            return <div className={`flex relative w-[12.5%] h-full
                            ${i % 2 === 0 ? (j % 2 === 0 ? 'bg-sky-500 text-white' : 'text-sky-500') :
                                    (j % 2 === 0 ? 'text-sky-500' : 'bg-sky-500 text-white')}`} key={j}>
                                <span id={key} className="flex absolute top-0 left-0 w-full h-full">
                                    {key !== '' ? <img className="w-full h-full" src={`/chess_2/${key.substring(0, 2)}.png`} /> : null}
                                    {i === 0 ? <span className="absolute bottom-1 left-1">{cols[j]}</span> : null}
                                    {j === 0 ? <span className="absolute top-0 left-1">{rows[i]}</span> : null}
                                </span>
                            </div>
                        })}
                    </div>
                })}
            </div>
        </div>
    )
}