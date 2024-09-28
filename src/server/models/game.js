import {makeGameHandler, socketClosure} from '#socketControllers';
import shapeClosure from './shape.js';
let Shape;

//Beta Code, not yet ready, for future development when Game Data will be persisted to DB
// let gameSchema = new Schema({
//     n: { type: Number, required: true, default: 10 },
//     player1: { type: String, required: true },
//     player2: { type: String, required: true },
//     frame: { type: [[[]]], required: true, },
// })

// gameSchema.pre('validate', function (next) {
//     if (this.isNew) {
//         this.frame = makeFrame(this.n)
//     }
//     next()
// })

// const GameModel = model('Game', gameSchema);

function makeFrame(n) {
    let b = new Array(n * 1.5);
    for (let z = 0; z < n * 1.5; z++) {
        b[z] = new Array(n);
        for (let y = 0; y < n; y++) {
            b[z][y] = new Array(n);
            for (let x = 0; x < n; x++) {
                b[z][y][x] = false;
            }
        }
    }
    return b;
}

export default class Game {
    constructor(s1, p1, s2, p2, settings, defaultListener, games, clients) {
        // GameModel.create({
        //     n,
        //     player1: p1,
        //     player2: p2
        // }).then(g => this.game = g)
        this.templates = settings.templates;
        this.n = settings.n;
        this.zHeight = this.n * 1.5;
        this.speed = settings.speed;
        this.occupied = makeFrame(settings.n);
        this.defaultListener = defaultListener;
        this.allGames = games;
        this.allClients = clients;

        this.sockets = {};
        this.player1 = {
            userName: p1,
            bg: settings.p1BG,
            current: null,
            ready: false,
        };
        this.player2 = {
            userName: p2,
            bg: settings.p2BG,
            current: null,
            ready: false,
        };
        this.sockets[p1] = s1;
        this.sockets[p2] = s2;

        //pass this to shapeClosure to get Shape Class where game is accessible via closure
        Shape = shapeClosure(this);

        this.shapeQueue = [];
        this.shapes = [];
        for (let x = 0; x < 3; x++) {
            let r = Math.floor(Math.random() * this.templates.length);
            this.shapeQueue.push(new Shape(this.templates[r]));
        }

        s1.on(
            'message',
            makeGameHandler(s1, s2, this.player1, this.player2, Shape).bind(
                this
            )
        );
        s2.on(
            'message',
            makeGameHandler(s2, s1, this.player2, this.player1, Shape).bind(
                this
            )
        );
        s1.on(
            'close',
            socketClosure(
                this.player1,
                this.player2,
                this.sockets,
                () => {
                    this.exit(s1, player1, s2, player);
                },
                () => this.cycle(false)
            )
        );
        s2.on(
            'close',
            socketClosure(
                this.player2,
                this.player1,
                this.sockets,
                () => {
                    this.exit(s2, player2, s1, player1);
                },
                () => this.cycle(false)
            )
        );
        this.setUpLoop = this.checkUserStatuses(s1, s2); //sends signal every second to see if both players are ready
    }

    popShape() {
        let s = this.shapeQueue.pop();
        let dX = 0,
            dY = 0,
            dZ = 0;
        do {
            for (let c of s.coords) {
                c[0] -= dX;
                c[1] -= dY;
                c[2] -= dZ;
            }
            let {xOffset, yOffset, zOffset} =
                this.calculateRandomInsertionOffsets();
            dX = xOffset;
            dY = yOffset;
            dZ = zOffset;
            for (let c of s.coords) {
                c[0] += dX;
                c[1] += dY;
                c[2] += dZ;
            }
        } while (this.testOccupied(s.coords));
        this.occupy(s, s.coords);
        return s;
    }

    calculateRandomInsertionOffsets() {
        let xOffset = Math.floor(Math.random() * (this.n - 2));
        let yOffset = Math.floor(Math.random() * (this.n - 2));
        let zOffset = this.zHeight - 3;
        return {xOffset, yOffset, zOffset};
    }

    testOccupied(spaces, shape) {
        for (let s of spaces) {
            let spaceQueried = this.occupied[s[2]][s[1]][s[0]];
            if (spaceQueried) return spaceQueried;
        }
        return false;
    }
    occupy(shape, spaces, otherShape) {
        shape.coords = spaces;
        // shape.testFall(); //update height property, placed before occupation so shapes own blocks don't interfere with shape.testFall()
        for (let s of spaces) {
            this.occupied[s[2]][s[1]][s[0]] = shape;
        }
        // if(otherShape) otherShape.testFall(); //update their height property too?
        // return true;
    }

    vacate(spaces) {
        for (let s of spaces) {
            this.occupied[s[2]][s[1]][s[0]] = false;
        }
    }

    checkUserStatuses(s1, s2, resume) {
        if (resume) {
            return setInterval(() => {
                s1.send(JSON.stringify({type: `serverReadyResume`}));
                s2.send(JSON.stringify({type: `serverReadyResume`}));
            }, 1000);
        } else {
            return setInterval(() => {
                s1.send(JSON.stringify({type: `serverReady`}));
                s2.send(JSON.stringify({type: `serverReady`}));
            }, 1000);
        }
    }

    cycle(start) {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        if (!start) return;
        this.timer = setInterval(() => {
            let shape1 = this.player1.current;
            let shape2 = this.player2.current;
            let fall1,
                fall2 = false;
            if (shape1) {
                if (shape1.skipNext) shape1.skipNext = false;
                else {
                    fall1 = shape1.falling && shape1.checkShapeLoaded();
                }
            }
            if (shape2) {
                if (shape2.skipNext) shape2.skipNext = false;
                else {
                    fall2 = shape2.falling && shape2.checkShapeLoaded();
                }
            }
            let s1 = this.sockets[this.player1.userName];
            let s2 = this.sockets[this.player2.userName];
            if (fall1 && fall2) {
                s1.send(JSON.stringify({type: 'fallMEthenTHEM'}));
                s2.send(JSON.stringify({type: 'fallTHEMthenME'}));
            } else if (fall1) {
                s1.send(JSON.stringify({type: 'fallMe'}));
                s2.send(JSON.stringify({type: 'fallThem'}));
            } else if (fall2) {
                s2.send(JSON.stringify({type: 'fallMe'}));
                s1.send(JSON.stringify({type: 'fallThem'}));
            }
        }, this.speed);
    }

    rejoin(freshSocket) {
        //currently only handles a single socket breakdown
        let rejoining, waiting;
        let {sockets, player1, player2} = this;
        if (sockets[player1.userName]) {
            waiting = player1;
            rejoining = player2;
        } else {
            waiting = player2;
            rejoining = player1;
        }
        sockets[rejoining.userName] = freshSocket;
        debugger;
        let waitingSocket = sockets[waiting.userName];
        freshSocket.on(
            'message',
            makeGameHandler(
                freshSocket,
                waitingSocket,
                rejoining,
                waiting,
                Shape,
                true
            ).bind(this)
        );
        freshSocket.on('close', socketClosure(rejoining, waiting, sockets));
        waitingSocket.removeAllListeners('message'); //removes intermediate listener for exit command
        waitingSocket.on(
            'message',
            makeGameHandler(
                waitingSocket,
                freshSocket,
                waiting,
                rejoining,
                Shape,
                false
            ).bind(this)
        );
        //don't need to reattach close handler to waitingSocket
        this.setUpLoop = this.checkUserStatuses(
            waitingSocket,
            freshSocket,
            true
        );
    }

    exit(leavingSocket, me, remainingSocket, them) {
        this.restoreSocketDefaults(leavingSocket, me.userName);
        me.current?.pause();
        me.current = null;
        them.current?.pause();
        them.current = null;
        this.allGames[me.userName] = null;
        if (remainingSocket) {
            this.restoreSocketDefaults(remainingSocket, them.userName);
            this.allGames[them.userName] = null;
            console.log(
                `game between ${me.userName} and ${them.userName} deleted`
            );
        } else {
            this.allGames[them.userName] = 'deleted'; //handles case where one player exited game while the other players socket was disconnected;
        }
    }

    restoreSocketDefaults(socket, userName) {
        socket.send(JSON.stringify({type: 'gameOver'}));
        socket.removeAllListeners('message');
        socket.on('message', this.defaultListener);
        socket.removeAllListeners('close');
        socket.on('close', (e) => {
            delete this.allClients[userName];
            console.log(`closing ${userName}'s webSocket with code ${e}`);
        });
    }
}
