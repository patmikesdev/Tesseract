import {connect, disconnect} from '#mongooseConnect';
import {checkDaemon, spawnDaemon, killDaemon} from '#dbDaemon';
import config from '#config';
import cors from 'cors';
import express from 'express';
import Session from 'express-session';
import morgan from 'morgan';
import path from 'path';
import authRouter from '#authRouter';
import userRouter from '#userRouter';
import postRouter from '#postRouter';
import {MongooseStore} from '#sessionStore';
import {createServer} from 'http'; //necessary for combining express with websockets
import integrateSockets from '#socketManager';

//managing mongod Daemon
let daemon;

export const app = express();
const server = createServer(app);

const wss1 = integrateSockets(server);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(
    Session({
        name: config.cookie.sessionName,
        cookie: config.cookie.options,
        secret: config.cookie.secret,
        resave: false,
        rolling: true,
        saveUninitialized: false, //setting this to false made the cookie NOT be saved on the client unless req.session is actually initialized!
        store: new MongooseStore(),
        unset: 'destroy',
    })
);

app.use(
    express.static(path.resolve('build'), {
        extensions: ['html', 'css', 'js', 'png', 'ico'],
    })
);
app.use(
    express.static(path.resolve('capstone'), { 
        extensions: ['html', 'css', 'js', 'png', 'ico'],
    })
);

app.use('/api/auth', authRouter);

app.use('/api/user', userRouter);

app.use('/api/post', postRouter);

//allows for direct navigation via URL bar, bookmarking URLs etc
//serves regular index.html file, which is tiny, then browser will pull bundle from cache
app.get('*', (req, res) => {
    console.log('*hit')
    res.sendFile(path.resolve('build/index.html'));
});

app.use((err, req, res, next) => {
    debugger;
    console.log(err);
    res.status(500).end();
});

export const start = async () => {
    console.log('---- Launching App ----');
    daemon = checkDaemon(true); //if daemon launched separate from server, daemon.startedByServer will be false
    if (!daemon) {
        daemon = spawnDaemon(true); //here, daemon.startedByServer will be true
    }
    connect()
        .then(() => {
            server.listen(config.port, () => {
                console.log(`App Listening @ port:`, config.port);
            });
        })
        .catch((e) => console.log('Caught from server', e));
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));

//signal used by nodemon to trigger a reload
process.once('SIGUSR2', () => gracefulShutdown('SIGUSR2'));

function gracefulShutdown(signal) {
    console.log('\n---- Starting ShutDown ----');

    disconnect().then(() => {
        process.removeAllListeners();
        if (signal === 'SIGINT') {
            console.log('\n---- Closing All WebSockets ----');
            wss1.clients.forEach((client) => {
                client.close();
            });
            if (daemon.startedByServer) killDaemon();
            else
                console.log(
                    `---- mongodb Daemon was initially launched independent of server. ---- \n\t---- still running at pid: `,
                    daemon.pid,
                    ` ----`
                );
        }
        console.log('---- App Shutdown complete ----');
        queueMicrotask(process.exit);
    });
}
