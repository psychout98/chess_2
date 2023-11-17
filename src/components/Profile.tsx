import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Board, BoardResponse, Player } from "../model/Board";
import { BoardPreview } from "./BoardPreview";


export const Profile: React.FC = () => {

    const { playerName } = useParams()
    const navigate = useNavigate()
    const [boards, setBoards] = useState<Board[]>()
    console.log(boards)

    useEffect(() => {
        if (!playerName) {
            navigate('/')
        }
        if (!boards) {
            getBoards()
        }
    }, [boards])

    function getBoards() {
        axios.get<Board[]>(`/player/${playerName}/boards`)
        .then((result) => {
            setBoards(result.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div className="flex flex-col w-screen h-screen bg-sky-300 items-center justify-center">
            <a href="/chess_2/" className="flex absolute top-0 left-0 w-20 h-20 items-center"><img src='/chess_2/bk.png' /></a>
            <span className="text-xl m-5">{playerName}'s games</span>
            {boards?.map(board => <BoardPreview board={board} />)}
        </div>
    )
}