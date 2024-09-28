import { useReducer, useCallback, useLayoutEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function usePlayers() {
    const params = useParams()
    const playerReducer = useCallback((oldProps, newProps) =>{
        if (!newProps) return null;
        if (newProps instanceof Promise || oldProps instanceof Promise) return newProps
        else return { ...oldProps, ...newProps }
    })
    const [player, setPlayer] = useReducer(playerReducer, null)
    const [otherPlayer, setOtherPlayer] = useReducer(playerReducer, null)

    useLayoutEffect(() => {
        //used when navigating from player to otherPlayer
        if (params.userName && !otherPlayer) {
            setOtherPlayer(fetch(`/api/user/${params.userName}`)
                .then(r => r.json())
                .then(r => { setOtherPlayer(r.data) })
            )
        }
        //navigating from one otherPlayer to another
        else if (otherPlayer && otherPlayer.userName && params.userName) {
            if (params.userName !== otherPlayer.userName) {
                setOtherPlayer(fetch(`/api/user/${params.userName}`)
                    .then(r => r.json())
                    .then(r => { setOtherPlayer(r.data) })
                )
            }
        }
        //resets otherPlayer
        else if (otherPlayer && !params.userName) {
            setOtherPlayer(null)
        }
    }, [params])

    return { player, setPlayer, otherPlayer, setOtherPlayer }; 
}