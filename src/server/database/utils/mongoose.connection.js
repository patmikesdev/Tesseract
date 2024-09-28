import config from '#config';
import mongoose from 'mongoose';
import {spawnDaemon, killDaemon} from '#dbDaemon';
let mongodSubProcess = null;

mongoose.connection.on('open', () => {
    console.log('---- Mongoose now connected ----');
});

async function connect() {
    console.log('---- Attempting to connect Mongoose to MongoDB Server ----');
    return (
        mongoose.connection.readyState === 1
            ? mongoose.createConnection(config.dbURL, {
                serverSelectionTimeoutMS: 5000,
            })
            : mongoose.connect(config.dbURL, {
                serverSelectionTimeoutMS: 5000,
            })
    )
        .catch((e) => {
            if (
                e.message ===
                `connect ECONNREFUSED ${config.dbHost}:${config.dbPort}`
            ) {
                console.log(
                    `---- Mongoose failed to connect to mongoDB @  ${config.dbHost}:${config.dbPort} ----`
                );
                mongodSubProcess = spawnDaemon();
                return mongoose.connect(config.dbURL, {
                    serverSelectionTimeoutMS: 5000,
                });
            } else throw e;
        })
        .then(registerListeners);
}

function disconnect() {
    console.log('---- Closing Mongoose Connection ----');
    if (mongodSubProcess) {
        killDaemon();
    }
    return mongoose.connection.close();
}

function registerListeners() {
    mongoose.connection.on('error', (err) => {
        console.log('---- Mongoose connection error: ----\n', err);
    });
    mongoose.connection.on('disconnected', () => {
        console.log('---- Mongoose disconnected ----');
    });
}

export {connect, disconnect};
