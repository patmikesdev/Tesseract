import {WebSocketServer} from 'ws';
import {parse} from 'url';
import Game from '#GameModel';
import getOptions from '#gameOptions';
import {defaultMsgParser} from '#socketControllers';

export default function integrateSockets(server) {
    let clients = {};
    let games = {};
    const wss1 = new WebSocketServer({noServer: true});

    wss1.on('connection', function connection(ws, req) {
        let {userName} = parse(req.url, true).query;
        console.log(`${userName} socket open`);
        clients[userName] = ws;
        ws.on('error', console.error);
        let defaultListener = defaultMsgParser(
            clients,
            games,
            getOptions,
            Game
        );
        if (games[userName]) {
            if (games[userName] === 'deleted') {
                //Game was exited while userName's socket was down.
                ws.send(JSON.stringify({type: 'gameOver'}));
                let formerPartner = games[userName].partner;
                games[userName] = null;
                console.log(
                    `game between ${userName} and ${formerPartner} deleted`
                );
                ws.on('message', defaultListener);
            } else {
                games[userName].game.rejoin(ws);
            }
        } else {
            ws.on('message', defaultListener);
        }

        ws.on('close', (e) => {
            delete clients[userName];
            console.log(`closing ${userName}'s webSocket with code ${e}`);
        });

        ws.send(JSON.stringify({data: 'Socket Connected!'}));
    });

    server.on('upgrade', function upgrade(request, socket, head) {
        wss1.handleUpgrade(request, socket, head, function done(ws) {
            wss1.emit('connection', ws, request);
        });
    });
    return wss1;
}
