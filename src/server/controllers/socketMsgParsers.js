//DEFAULT SOCKET CONTROLLER FOR SENDING, ACCEPTING, DENYING INVITATIONS TO GAME
export function defaultMsgParser(clients, games, getOptions, Game) {
    function defaultListener(input) {
        let msg = JSON.parse(input);
        let {type, from, to, gameSettings} = msg;
        console.log(msg.type, msg.from, msg.to);
        switch (type) {
        case 'invitation':
            if (clients[to])
                clients[to].send(
                    JSON.stringify({
                        type: 'invitation',
                        from,
                        to,
                        gameSettings,
                    })
                );
            break;
        case 'accept':
            clients[from].send(
                JSON.stringify({
                    type: 'accepted',
                    from,
                    to,
                    gameSettings,
                })
            );
            clients[from].removeAllListeners('message');
            clients[to].removeAllListeners('message');
            let settings = getOptions(gameSettings);
            let g = new Game(
                clients[from],
                from,
                clients[to],
                to,
                settings,
                defaultListener,
                games,
                clients
            );
            games[from] = {game: g, partner: to};
            games[to] = {game: g, partner: from};
            break;
        case 'deny':
            clients[from].send(JSON.stringify({type: 'denied', from, to}));
            break;
        }
    }
    return defaultListener;
}

//Socket controller for actual game play
export function makeGameHandler(
    origin,
    otherSocket,
    me,
    them,
    Shape,
    rejoin = false
) {
    return function (input) {
        let msg = JSON.parse(input);
        console.log(msg);
        switch (msg.type) {
        case 'move':
            let {motion, locs, id} = msg;
            this.vacate(me.current.coords);
            if (!this.testOccupied(locs)) {
                origin.send(JSON.stringify({type: 'approveMe', id}));
                otherSocket.send(
                    JSON.stringify({type: 'moveThem', motion, locs})
                );
                this.occupy(me.current, locs);
            } else {
                origin.send(JSON.stringify({type: 'rejectMe', id}));
                this.occupy(me.current, me.current.coords);
            }
            break;
        case 'pause':
            me.current.pause();
            break;
        case 'unpause':
            me.current.resumeFalling();
            break;
            // case 'drop':
            //     me.current.drop()
            //     break;
        case 'gotNewMine':
            me.mineLoaded = true;
            this.cycle(true);
            break;
        case 'gotNewTheirs':
            me.theirsLoaded = true;
            this.cycle(true);
            break;
        case 'exit':
            this.exit(origin, me, otherSocket, them);
            break;
        case 'getNewShape':
            let shape = this.popShape();
            // console.log('sending newMine')
            origin.send(
                JSON.stringify({
                    type: 'newMine',
                    shape: shape.coords,
                    color: me.bg,
                })
            );
            // console.log('sending newTheirs')
            otherSocket.send(
                JSON.stringify({
                    type: 'newTheirs',
                    shape: shape.coords,
                    color: me.bg,
                })
            );
            // console.log('both news sent')
            me.current = shape;
            shape.assignOwnership(origin, otherSocket, me, them);
            //enQueue new random Shape
            this.shapeQueue.unshift(
                new Shape(
                    this.templates[
                        Math.floor(Math.random() * this.templates.length)
                    ]
                )
            );
            break;
        case 'clientReady':
            console.log(`clientReady from ${me.userName}`);
            let oldStatus = me.ready;
            me.ready = true;
            if (them.ready && !oldStatus) {
                //guards against extra triggers to this code (eg both players ready but another clientReady signal comes in)
                clearInterval(this.setUpLoop);
                console.log('both Ready, sending start signal to both');
                origin.send(JSON.stringify({type: 'start'}));
                otherSocket.send(JSON.stringify({type: 'start'}));
            }
            break;
        case 'clientReadyResume':
            let resuming = me.ready;
            me.ready = true;
            if (them.ready && !resuming) {
                //guards against extra triggers to this code (eg both players ready but another clientReadyResume signal comes in)
                clearInterval(this.setUpLoop);
                origin.send(JSON.stringify({type: 'resume'}));
                otherSocket.send(JSON.stringify({type: 'resume'}));
                if (me.current) {
                    me.current.assignOwnership(
                        origin,
                        otherSocket,
                        me,
                        them
                    );
                    me.current.resumeFalling();
                }
                if (them.current) {
                    them.current.assignOwnership(
                        otherSocket,
                        origin,
                        them,
                        me
                    ); //DOUBLE CHECK
                    them.current.resumeFalling();
                }
                this.cycle(true);
            }
            break;
        }
    };
}

//SOCKET CONTROLLER IN EVENT ONE SOCKET CLOSES MID-GAME
export function socketClosure(me, them, sockets, exit, stopCycle) {
    return function (e) {
        debugger;
        me.ready = false;
        delete sockets[me.userName];
        if (sockets[them.userName]) {
            sockets[them.userName].send(
                JSON.stringify({type: 'interruption', partner: me.userName})
            );
            sockets[them.userName].removeAllListeners('message');
            sockets[them.userName].on('message', function (m) {
                let msg = JSON.parse(m);
                console.log(msg);
                if (msg.type === 'exit') exit();
            });
        }
        stopCycle(); //stops both falling
    };
}
