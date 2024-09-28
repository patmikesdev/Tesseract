//CODE ADAPTED FROM COMPLETE GUIDE TO WEBSOCKETS WITH REACT
//https://ably.com/blog/websockets-react-tutorial

import { useState, useEffect, useRef, useMemo, useLayoutEffect } from "react";

//variable for controlling sequencing of multiple, rapid hook calls to help prevent loss of any data
let socketBusy = false;

export default function useSocket(player) {
    //ref of actual WebSocket object player will use
    const ws = useRef(null)

    //for differentiating between initial loading and subsequent reconnections
    const [initialized, setInitialized] = useState(false);

    //for setting up loop that continuously will try to reconnect in event of broken socket connection
    const [timer, setTimer] = useState(null)

    //indicates the socket 'open' event has been fired
    const [ready, setReady] = useState(false);

    //value of the data that was received from the socket
    const [msg, setMsg] = useState(null);

    //used for managing multiple rapid calls to send on the socket
    const outQ = useRef([])
    const sendTimer = useRef(null)

    //used for managing multiple rapid receptions of messages in sequence
    const inQ = useRef([]);

    //used to signal when a game starts and finished
    const [playing, setPlaying] = useState(false)

    //not really used yet.
    const [error, setError] = useState(false);

    //create client socket when player logs in, close when player logs out
    useEffect(() => {
        if (player && player.userName) {
            makeSocket(player.userName)
        }
        else {
            if (ws.current && !(player instanceof Promise)) {
                ws.current.close()
                ws.current = null;
            }
        }
    }, [player])

    //Handy way of automatically stringifying any JS object I want to send via the socket, 
    //Also updates anytime the websocket closes and has to be recreated
    const send = useMemo(() => {
        if (!(ws.current && ready)) {
            if (sendTimer.current) {
                clearInterval(sendTimer.current);
                sendTimer.current = null
            }
            return input => {
                outQ.current.push(JSON.stringify(input))
            }
        }
        else {
            if (outQ.current.length > 0) {
                sendTimer.current = setInterval(sendWhenReady, 50)
            }
            return input => {
                let output = JSON.stringify(input);
                if (canSend()) {
                    ws.current.send(output)
                }
                else {
                    // console.log(`${input.type} pushed to outQ`)
                    outQ.current.push(output)
                    if (!sendTimer.current) sendTimer.current = setInterval(sendWhenReady, 50)
                }
            }
        }
        function canSend() {
            return ws.current.bufferedAmount === 0
        }

        function sendWhenReady() {
            // console.log('sendWhenReady Called')
            // console.log(ws.current.bufferedAmount)
            // console.log(`outQ length: ${outQ.current.length}`)
            // console.log(`canSend() ${canSend()}`)
            // console.log(`sendTimer: ${sendTimer.current}`)
            // debugger; 
            if (outQ.current.length <= 0) {
                clearInterval(sendTimer.current)
                sendTimer.current = null
                return;
            }
            else if (canSend()) {
                // debugger; 
                //production code
                ws.current.send(outQ.current.shift())
                //dev code with logging
                // let m = outQ.current.shift()
                // let parsed = JSON.parse(m)
                // console.log(`${parsed.type} msg pulled off outQ`)
                // ws.current.send(m)
            }
        }
    }, [ws.current, ready])

    //hook used to process queue of multiple rapidly received messages in correct sequence
    useLayoutEffect(() => {
        if (!msg) {
            if (inQ.current.length > 0) {
                //production code
                setMsg(inQ.current.shift())
                //dev version with logging
                // let m = inQ.current.shift()
                // console.log(`${m.type} pulled off inQ`)
                // setMsg(m)

            }
            else socketBusy = false;
        }
    }, [msg])

    //used to reset inQ and outQ if a game was exited with moves still on either Q
    useLayoutEffect(() => {
        if (!playing) {
            inQ.current = [];
            outQ.current = [];
            if (initialized && ready) send({ type: 'exit' })
        }
    }, [playing])
    //Error handling in event ws closed unexpectedly, recreate a new socket connection after 2 seconds
    //minimal, but functional
    useEffect(() => {
        //instead of relying on error (which wouldn't be set in event socket closed cleanly, relied on ready because I always want to be connected via ws as long as I'm logged in)
        if (ready) {
            if (timer) {
                clearInterval(timer);
                setTimer(null)
            }
        }
        else {
            // if (!initialized) return;
            if (timer) clearInterval(timer);
            if (player && player.userName) {
                setTimer(setInterval((p) => {
                    if (p && p.userName) makeSocket(p.userName)
                }, 2000, player))
            }
        }
    }, [ready])

    //DEV ONLY method for simulating a broken socket connection
    useEffect(() => {
        if (!ws.current) return
        let handler = devKeydownHandler();
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler)
    }, [ws.current])


    return { ready, msg, setMsg, send, setPlaying }


    function makeSocket(userName) {
        // console.log('Attempting to Create WebSocket')
        const socket = new WebSocket(`ws://localhost:3000?userName=${userName}`);
        socket.onopen = () => {
            setReady(true);
            setInitialized(true);
            setError(false);
        }
        socket.onclose = (evt) => {
            // console.log('WebSocket Closed')
            setReady(false);
            socketBusy = false;
            ws.current = null;
            if (!evt.wasClean) {
                setError(true)
            }
        }
        socket.onerror = err => {
            console.log(err)
        }
        socket.onmessage = (evt) => {
            let m = JSON.parse(evt.data)
            if (!socketBusy) {
                socketBusy = true;
                setMsg(m)
            }
            else {
                console.log(`${m.type} pushed to inQ`)
                inQ.current.push(m)
            }
        }
        ws.current = socket;
    }

    function devKeydownHandler() {
        return function (e) {
            if (e.keyCode === 88) {
                ws.current.close(4020) //codes 4k - 4999 available for use by applications
                setError(true)
            }
        }
    }
}

