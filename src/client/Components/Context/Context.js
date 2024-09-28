import {createContext, useContext, useEffect, useLayoutEffect, useReducer, useMemo, useState} from 'react';
import {useLocation} from 'react-router-dom';
import useLayout from '#Hooks/Layout';
import usePlayers from '#Hooks/Players';
import useModal from '#Hooks/Modal'
import useSocket from '#Hooks/Socket'

const AppContext = createContext();

export default function useAppContext() {
    return useContext(AppContext);
}

export function Context({children}) {
    const location = useLocation();
    const players = usePlayers(); 
    // const { player, setPlayer, otherPlayer, setOtherPlayer } = players; //all destructured
    const layout = useLayout(players.player); 
    // const { setTheme, dimensions, landscape, deviceType, touchScreen } = layout //all destructured
    const modal = useModal(); 
    // const { modalProps, setModalProps } = modal; //all destructured
    const socket = useSocket(players.player, modal.setModalProps)
    // const { ready, msg, setMsg, send, setPlaying } = socket //all destructured

    return (
        <AppContext.Provider value={{location, layout, players, modal, socket }}>
            {children}
        </AppContext.Provider>
    );
}
