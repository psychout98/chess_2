import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Board, BoardResponse } from "../model/Board";
import axios from "axios";
import { Game } from "./Game"
import { Client } from '@stomp/stompjs';

const client = new Client();
client.brokerURL = process.env.REACT_APP_CHESS_SERVER_WS;


export const Home: React.FC = () => {

    let { boardid } = useParams()
    const [board, setBoard] = useState<Board>()
    const [player, setPlayer] = useState<number>(0)
    const [subscribed, setSubscribed] = useState<boolean>(false)
    const [started, setStarted] = useState<boolean>(false)
    const [sessionId, setSessionId] = useState<string>(window.sessionStorage.getItem("sessionId") || '')
    const navigate = useNavigate()
    const [rematchOffer, setRematchOffer] = useState<string | undefined>()

    useEffect(() => {
        if (boardid && !board) {
            getBoard()
        }
        if (!subscribed) {
            client.deactivate()
            client.onConnect = () => {
                client.subscribe(`/board/${board?.id}`, (message) => {
                    if (message?.body === 'update') {
                        getBoard()
                    }
                    if (message?.body.startsWith('rematch:')) {
                        setRematchOffer(message.body.split(':')[1])
                    }
                })
                setSubscribed(board !== undefined)
            }
            client.activate();
        }
        if (board && player === 0) {
            setSessionId(window.sessionStorage.getItem("sessionId") || '')
            if (sessionId) {
                if (board.white?.sessionId === sessionId) {
                    setPlayer(1)
                }
                if (board.black?.sessionId === sessionId) {
                    setPlayer(2)
                }
            }
        }
    }, [board, started])

    function getBoard(viewingMove: number | undefined = board?.currentMove) {
        axios.get<BoardResponse>(`board/${boardid || board?.id || ''}${viewingMove ? `/${viewingMove}` : ''}`)
            .then((result) => {
                let sessionId = window.sessionStorage.getItem("sessionId")
                if (!sessionId) {
                    window.sessionStorage.setItem("sessionId", result.data.sessionId)
                    sessionId = result.data.sessionId
                }
                setBoard(result.data.board)
                if (result.data.board.white && result.data.board.black) {
                    setStarted(true)
                }
            }).catch((error) => {
                console.log(error)
            })
    }

    function move(moveCode: string) {
        axios.put<BoardResponse>(`board/${board?.id}/move/${moveCode}`)
            .then((result) => {
                client.publish({ destination: `/board/${board?.id}`, body: 'update' });
                setBoard(result.data.board)
            }).catch((error) => {
                console.log(error)
            })
    }

    function createGame(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault()
        axios.post<BoardResponse>('board').then((result) => {
            window.sessionStorage.setItem("sessionId", result.data.sessionId)
            navigate(`/${result.data.board.id}`)
            setPlayer(1)
            setBoard(result.data.board)
        })
    }

    function joinGame(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        axios.put<String>(`board/${board?.id}/join`)
            .then((result) => {
                client.publish({ destination: `/board/${board?.id}`, body: 'update' });
                window.sessionStorage.setItem("sessionId", result.data.trim())
                setPlayer(2)
                setStarted(true)
            })
    }

    function handleRematch() {
        if (rematchOffer) {
            navigate(`/${rematchOffer}`)
            window.location.reload()
        } else {
            axios.post<BoardResponse>('board').then((result) => {
                client.publish({ destination: `/board/${board?.id}`, body: `rematch:${result.data.board.id}` });
                window.sessionStorage.setItem("sessionId", result.data.sessionId)
                navigate(`/${result.data.board.id}`)
                setPlayer(1)
                setSubscribed(false)
                setStarted(false)
                setBoard(result.data.board)
            })
        }
    }

    function mainPanel(): JSX.Element {
        if (board && started) {
            return <Game board={board} move={move} getBoard={getBoard} player={player} handleRematch={handleRematch} />
        } else if (board && !started) {
            if (player === 0) {
                return <div className="flex bg-white select-none p-3" onClick={joinGame}>Join game</div>
            } else {
                return <div>Waiting for opponent...</div>
            }
        } else if (!board && !started) {
            return <div className="flex bg-white select-none p-3" onClick={createGame}>Create game</div>
        } else {
            return <div>Impossible error. You should probably just reload</div>
        }
    }



    return (
        <div className="flex flex-col w-screen h-screen bg-sky-300 items-center justify-center">
            <a href="/chess_2/" className="flex flex-col absolute top-0 left-0 w-20 h-20 items-center"><img src='/chess_2/bk.png' /></a>
            {mainPanel()}
        </div>
    )
}