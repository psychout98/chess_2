import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Board, BoardResponse, Player } from "../model/Board";
import axios from "axios";
import { Game } from "./Game"
import { Client } from '@stomp/stompjs';
import { CopyToClipboard } from 'react-copy-to-clipboard'

const client = new Client();
client.brokerURL = process.env.REACT_APP_CHESS_SERVER_WS;


export const Home: React.FC = () => {

    let { boardid } = useParams()
    const navigate = useNavigate()
    const [board, setBoard] = useState<Board>()
    const [player, setPlayer] = useState<number>(0)
    const [subscribed, setSubscribed] = useState<boolean>(false)
    const [started, setStarted] = useState<boolean>(false)
    const [playerId, setPlayerId] = useState<string>()
    const [playerName, setPlayerName] = useState<string>()
    const [rematchOffer, setRematchOffer] = useState<string | undefined>()
    const [viewingMove, setViewingMove] = useState<number>(0)
    const [showOptions, setShowOptions] = useState<boolean>(false)
    const [showGameSettings, setShowGameSettings] = useState<boolean>(false)

    useEffect(() => {
        setLocalPlayer()
        setWebSocketConnection()
        if (boardid && !board) {
            getBoard()
        }
    }, [board, player, subscribed, started, playerId, playerName, rematchOffer, showGameSettings])

    function setLocalPlayer() {
        const localStorageId = window.localStorage.getItem("playerId")
        const localStorageName = window.localStorage.getItem("playerName")
        if (localStorageId && !playerId) {
            setPlayerId(localStorageId)
        } else if (!localStorageId && playerId) {
            window.localStorage.setItem("playerId", playerId)
        }
        if (localStorageName && !playerName) {
            setPlayerName(localStorageName)
        } else if (!localStorageName && playerName) {
            window.localStorage.setItem("playerName", playerName)
        } else if (!localStorageName && !playerName) {
            setPlayerName('anonymous')
            window.localStorage.setItem("playerName", 'anonymous')
        }
        if (board && player === 0) {
            if (playerId === board.white?.id) {
                setPlayer(1)
            }
            if (playerId === board.black?.id) {
                setPlayer(2)
            }
        }
        if (playerId) {
            axios.defaults.headers.common['playerId'] = playerId
        }
        if (playerName) {
            axios.defaults.headers.common['playerName'] = playerName
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
        if (!playerId && !window.localStorage.getItem("playerId")) {
            setPlayerId(id)
            window.localStorage.setItem("playerId", id)
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

    function createGame(opponent: boolean) {
        axios.post<BoardResponse>(`board${opponent ? '' : '?opponent=computer'}`).then((result) => {
            updateId(result.data.player.id)
            navigate(`/${result.data.board.id}`)
            setPlayer(1)
            setBoard(result.data.board)
            if (result.data.board.white && result.data.board.black) {
                setStarted(true)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    function joinGame(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault()
        axios.put<Player>(`board/${board?.id}/join`)
            .then((result) => {
                client.publish({ destination: `/board/${board?.id}`, body: 'update' })
                updateId(result.data.id)
                setPlayer(2)
                setStarted(true)
            }).catch((error) => {
                console.log(error)
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
            }).catch((error) => {
                console.log(error)
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
                return <div className="flex flex-col items-center">
                        <span>Waiting for opponent...</span>
                        <CopyToClipboard text={`https://psychout98.github.io/chess_2/#/${board.id}`} onCopy={() => { alert("Game link copied to clipboard") }}><span className="flex bg-white mt-1 select-none p-1">copy link</span></CopyToClipboard>
                    </div>
            }
        } else if (!board && !started) {
            return showGameSettings ? <div className="flex flex-col items-center gap-3">
                <div className="flex bg-white select-none p-3" onClick={ (e) => {
                    e.preventDefault()
                    createGame(true)
                }}>Play with a friend</div>
                or
                <div className="flex bg-white select-none p-3" onClick={ (e) => {
                    e.preventDefault()
                    createGame(false)
                }}>Play against the computer</div>
            </div> :
            <div className="flex bg-white select-none p-3" onClick={(e) => {
                e.preventDefault()
                setShowGameSettings(true) 
            }}>Create game</div>
        } else {
            return <div>Impossible error. You should probably just reload</div>
        }
    }



    return (
        <div className="flex flex-col w-screen h-screen bg-sky-300 items-center justify-center">
            <a href="/chess_2/" className="flex absolute top-0 left-0 w-20 h-20 items-center"><img src='/chess_2/bk.png' alt="/chess_2/bp.png" /></a>
            <div className={`flex flex-col absolute top-0 right-0 items-right text-right ${showOptions ? 'bg-sky-500' : ''}`}>
                <div className='p-3 select-none hover:text-white' onClick={() => setShowOptions(!showOptions)}>{playerName}</div>
                {showOptions ?
                    <div className="flex flex-col items-right">
                        {playerName === 'anonymous' ? null : <div className="p-3 select-none hover:text-white" onClick={() => navigate(`/player/${playerName}`)}>profile</div>}
                        {playerName === 'anonymous' ? <div className="p-3 select-none hover:text-white" onClick={() => navigate('/login')}>login</div> : null}
                        {playerName === 'anonymous' ? <div className="p-3 select-none hover:text-white" onClick={() => navigate('/signup')}>signup</div> : null}
                        <div className="p-3 select-none hover:text-white" onClick={() => {
                            window.localStorage.setItem("playerName", 'anonymous')
                            window.localStorage.removeItem("playerId")
                            setPlayerName(undefined)
                            setPlayerId(undefined)
                        }}>logout</div>
                    </div>
                    : null}
            </div>
            {mainPanel()}
        </div>
    )
}