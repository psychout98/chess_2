import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Board, BoardResponse, Player } from "../model/Board";
import { BoardPreview } from "./BoardPreview";


export const Profile: React.FC = () => {

    const { playerName } = useParams()
    const navigate = useNavigate()
    const [boards, setBoards] = useState<Board[]>()
    const [games, setGames] = useState<number>(0)
    const [wins, setWins] = useState<number>(0)

    useEffect(() => {
        if (!playerName) {
            navigate('/')
        }
        if (!boards) {
            getBoards()
        }
    }, [boards, games, wins])

    function getBoards() {
        axios.get<Board[]>(`/player/${playerName}/boards`)
        .then((result) => {
            setBoards(result.data)
            setGames(result.data.length)
            setWins(result.data.map(board => board.winner === (board.white.name === playerName ? 1 : board.black.name === playerName ? 2 : -1)).filter(win => win === true).length)
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div className="flex flex-col w-screen bg-sky-300 items-center justify-center">
            <a href="/chess_2/" className="flex absolute top-0 left-0 w-20 h-20 items-center"><img src='/chess_2/bk.png' /></a>
            <span className="text-xl my-5">{playerName}'s games</span>
            <span>Games: {games}</span>
            <span className="mb-3">Wins: {wins}</span>
            {boards?.map(board => <BoardPreview board={board} />)}
        </div>
    )
}