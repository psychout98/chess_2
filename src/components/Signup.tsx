import { useState } from 'react'
import axios from "axios";
import { UserResponse } from '../model/User';
import { useNavigate } from "react-router-dom";

export const Signup: React.FC = () => {

    const [username, setUsername] = useState<string>('')
    const [password1, setPassword1] = useState<string>('')
    const [password2, setPassword2] = useState<string>('')
    const [error, setError] = useState<string>('')
    const navigate = useNavigate()

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (password1 === password2) {
            axios.post<UserResponse>('/user', null, {
                headers: {
                    'username': username,
                    'password': password1
                }
            }).then((result) => {
                window.localStorage.setItem("playerName", result.data.username)
                window.localStorage.setItem("playerId", result.data.playerId)
                navigate('/')
            }).catch((error) => {
                setError(error.message)
                console.log(error)
            })
        } else {
            setError('Passwords must match')
        }
    }

    return (
        <div className='flex flex-col w-screen h-screen bg-sky-300 items-center justify-center'>
            <a href="/chess_2/" className="flex absolute top-0 left-0 w-20 h-20 items-center"><img src='/chess_2/bk.png' alt="/chess_2/bp.png" /></a>
            <form className='flex flex-col bg-sky-500 p-5' onSubmit={handleSubmit}>
                <span className='text-center text-xl'>Sign up</span>
                <input type='text' className='my-3 p-1' placeholder='username' onChange={(e) => setUsername(e.target.value)} />
                <input type='password' className='my-3 p-1' placeholder='password' onChange={(e) => setPassword1(e.target.value)} />
                <input type='password' className='my-3 p-1' placeholder='re-enter password' onChange={(e) => setPassword2(e.target.value)} />
                <input type='submit' className='my-3 bg-white p-1' />
                <span className='text-red-500'>{error}</span>
            </form>
        </div>
    )
}