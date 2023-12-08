import { Board } from "../model/Board"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

export const Options: React.FC<{ createGame: Function }> = ({ createGame }) => {


    const [showGameSettings, setShowGameSettings] = useState<boolean>(false)
    const [playingComputer, setPlayingComputer] = useState<boolean>(false)
    const [white, setWhite] = useState<boolean>(true)
    const [depth, setDepth] = useState<number>(1)
    const levels = [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 }
    ]

    function options(): JSX.Element {
        return <div className="flex flex-col items-center gap-3">
            Play {playingComputer ? 'against the computer' : 'with a friend'}
            <div className="flex flex-row items-center justify-center gap-3">
                <div className={`flex ${white ? 'bg-gray-300' : 'bg-white'} hover:bg-gray-300 select-none p-3`} onClick={(e) => {
                    e.preventDefault()
                    setWhite(true)
                }}>White</div>
                <div className={`flex ${white ? 'bg-white' : 'bg-gray-300'} hover:bg-gray-300 select-none p-3`} onClick={(e) => {
                    e.preventDefault()
                    setWhite(false)
                }}>Black</div>
            </div>
            {playingComputer ?
                <div>
                    <Select placeholder="Level" options={levels} onChange={(newValue) => {
                        setDepth(newValue?.value || 1)
                    }} />
                </div> : null
            }
            <div className="flex bg-white select-none p-3" onClick={(e) => {
                e.preventDefault()
                createGame(white, playingComputer ? { name: "computer", id: `computer-${depth}`} : undefined)
            }}>Create game</div>
        </div>
    }

    if (showGameSettings) {
        return options()
    } else {
        return <div className="flex flex-col items-center gap-3">
            <div className="flex bg-white select-none p-3" onClick={(e) => {
                e.preventDefault()
                setShowGameSettings(true)
            }}>Play with a friend</div>
            or
            <div className="flex bg-white select-none p-3" onClick={(e) => {
                e.preventDefault()
                setPlayingComputer(true)
                setShowGameSettings(true)
            }}>Play against the computer</div>
        </div>
    }
}