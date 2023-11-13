import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Board, BoardResponse } from "../model/Board";
import axios from "axios";
import { Game } from "./Game"
import { Client } from '@stomp/stompjs';

const client = new Client();
client.brokerURL = 'wss://pacific-refuge-56148-96967b0a6dc5.herokuapp.com/';


export const Home: React.FC = () => {

    let { boardid } = useParams()
    const [board, setBoard] = useState<Board>()
    const [player, setPlayer] = useState<number>(0)
    const [subscribed, setSubscribed] = useState<boolean>(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (boardid && !board) {
            getBoard()
        }
        if (!subscribed) {
            client.deactivate()
            client.onConnect = () => {
                client.subscribe(`/board/${board?.id}`, (message) => {
                    if (message?.body === 'move') {
                        getBoard()
                    }
                })
                setSubscribed(board !== undefined)
            }
            client.activate();
        }
    }, [board])

    function getBoard() {
        axios.get<BoardResponse>(`board/${boardid || board?.id || ''}`)
            .then((result) => {
                console.log(result)
                setBoard(result.data.board)
                setPlayer(result.data.board.white.sessionId === result.data.sessionId ? 1 : result.data.board.black.sessionId === result.data.sessionId ? 2 : 0)
                setTimeout(getBoard, 10000)
            }).catch((error) => {
                console.log(error)
            })
    }

    function move(moveCode: string) {
        axios.put<BoardResponse>(`board/${board?.id}/move/${moveCode}`)
            .then((result) => {
                console.log(result)
                client.publish({ destination: `/board/${board?.id}`, body: 'move' });
                setBoard(result.data.board)
            }).catch((error) => {
                console.log(error)
            })
    }

    function createGame(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault()
        axios.post<BoardResponse>('board').then((result) => {
            navigate(`/${result.data.board.id}`)
            // console.log(result)
            // window.history.replaceState(null, "Chess", result.data.board.id)
            setPlayer(result.data.board.white.sessionId === result.data.sessionId ? 1 : result.data.board.black.sessionId === result.data.sessionId ? 2 : 0)
            setBoard(result.data.board)
        })
    }

    return (
        <div className="flex flex-col w-screen h-screen bg-sky-300 items-center justify-center">
            <a href="/chess_2/" className="absolute top-0 left-0">home</a>
            {board ?
                <Game board={board} move={move} player={player} /> :
                <div className="flex bg-white select-none p-3" onClick={createGame}>Create game</div>
            }
        </div>
    )
}