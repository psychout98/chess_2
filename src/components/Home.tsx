import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Board, BoardResponse, Player } from "../model/Board";
import axios from "axios";
import { Game } from "./Game"
import { Client } from '@stomp/stompjs';

const client = new Client();
client.brokerURL = process.env.REACT_APP_CHESS_SERVER_WS;


export const Home: React.FC = () => {

    let { boardid } = useParams()
    const navigate = useNavigate()
    const [board, setBoard] = useState<Board>()
    const [player, setPlayer] = useState<number>(0)
    const [subscribed, setSubscribed] = useState<boolean>(false)
    const [started, setStarted] = useState<boolean>(false)
    const [localId, setLocalId] = useState<string>()
    const [localName, setLocalName] = useState<string>()
    const [rematchOffer, setRematchOffer] = useState<string | undefined>()
    const [viewingMove, setViewingMove] = useState<number>(0)

    useEffect(() => {
        setLocalPlayer()
        setWebSocketConnection()
        if (boardid && !board) {
            getBoard()
        }
    }, [board, player, subscribed, started, localId, localName, rematchOffer])

    function setLocalPlayer() {
        const localStorageId = window.localStorage.getItem("localId")
        const localStorageName = window.localStorage.getItem("localName")
        if (localStorageId && !localId) {
            setLocalId(localStorageId)
        } else if (!localStorageId && localId) {
            window.localStorage.setItem("localId", localId)
        }
        if (localStorageName && !localName) {
            setLocalName(localStorageName)
        } else if (!localStorageName && localName) {
            window.localStorage.setItem("localName", localName)
        } else if (!localStorageName && !localName) {
            setLocalName('anonymous')
            window.localStorage.setItem("localName", 'anonymous')
        }
        if (board && player === 0) {
            if (localId === board.white?.id) {
                setPlayer(1)
            }
            if (localId === board.black?.id) {
                setPlayer(2)
            }
        }
        if (localId) {
            axios.defaults.headers.common['playerId'] = localId
        }
        if (localName) {
            axios.defaults.headers.common['playerName'] = localName
        }
    }

    function setWebSocketConnection() {
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
    }

    function updateId(id: string) {
        if (!localId && !window.localStorage.getItem("localId")) {
            setLocalId(id)
            window.localStorage.setItem("localId", id)
        }
    }


    function getBoard(viewingMove: number | undefined = undefined) {
        axios.get<BoardResponse>(`board/${boardid || board?.id || ''}${viewingMove ? `/${viewingMove}` : ''}`)
            .then((result) => {
                updateId(result.data.player.id)
                setViewingMove(result.data.board.currentMove)
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
                updateId(result.data.player.id)
                client.publish({ destination: `/board/${board?.id}`, body: 'update' })
                setBoard(result.data.board)
                setViewingMove(result.data.board.currentMove)
            }).catch((error) => {
                console.log(error)
            })
    }

    function createGame(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault()
        axios.post<BoardResponse>('board').then((result) => {
            updateId(result.data.player.id)
            navigate(`/${result.data.board.id}`)
            setPlayer(1)
            setBoard(result.data.board)
        })
    }

    function joinGame(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        axios.put<Player>(`board/${board?.id}/join`)
            .then((result) => {
                client.publish({ destination: `/board/${board?.id}`, body: 'update' })
                updateId(result.data.id)
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
                client.publish({ destination: `/board/${board?.id}`, body: `rematch:${result.data.board.id}` })
                updateId(result.data.player.id)
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
            return <Game board={board} move={move} viewingMove={viewingMove} setViewingMove={setViewingMove} getBoard={getBoard} player={player} handleRematch={handleRematch} />
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
            <a href="/chess_2/" className="flex absolute top-0 left-0 w-20 h-20 items-center"><img src='/chess_2/bk.png' /></a>
            <div className="flex absolute top-0 right-0">
                {board ?
                    <div className="w-full h-full">{localName}</div> :
                    <input type="text" className="w-full h-full text-center bg-white p-3" placeholder={localName || 'anonymous'} onChange={(e) => {
                        setLocalName(e.target.value)
                        window.localStorage.setItem("localName", e.target.value)
                    }}/>
                }
            </div>
            {mainPanel()}
        </div>
    )
}