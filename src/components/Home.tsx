import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Board } from "../model/Board";
import axios from "axios";
import { Game } from "./Game"

export const Home: React.FC = () => {

    let { boardid } = useParams()
    const [board, setBoard] = useState<Board>()

    useEffect(() => {
        if (boardid) {
            getBoard()
        }
    }, [])

    function getBoard() {
        axios.get<Board>(`board/${boardid}`)
        .then((result) => {
            setBoard(result.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    function move(moveCode: string) {
        axios.put<Board>(`board/${board?.id}/move/${moveCode}`)
        .then((result) => {
            setBoard(result.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    function createGame(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault()
        axios({
            method: 'POST',
            url: 'board'
        }).then((result) => {
            window.history.replaceState(null, "Chess", result.data.id)
            setBoard(result.data)
        })
    }

    return (
        <div className="flex flex-col w-screen h-screen bg-sky-300 items-center justify-center">
            <a href="/" className="absolute top-0 left-0">home</a>
            {board ?
                <Game board={board} move={move} /> :
                <div className="flex bg-white select-none p-3" onClick={createGame}>Create game</div>
            }
        </div>
    )
}