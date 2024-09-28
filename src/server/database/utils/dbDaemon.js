import config from '#config';
import {spawn, execSync} from 'child_process';
import {
    openSync,
    readdirSync,
    writeFileSync,
    readFileSync,
    existsSync,
} from 'fs';
const {resolveServer} = config;

const logCount = readdirSync(resolveServer('database/mongodLogs')).length;
let subProcess;
let pidPath = resolveServer('database/utils/.daemonPID.txt');
if (!existsSync(pidPath)) {
    execSync(`touch ${pidPath}`);
}

export function trackDaemon(pid, startedByServer = false) {
    writeFileSync(pidPath, JSON.stringify({pid, startedByServer}));
}

export function checkDaemon(log = false) {
    let daemon = readFileSync(pidPath, {encoding: 'utf8'});
    if (daemon) {
        daemon = JSON.parse(daemon);
        try {
            if (process.kill(daemon.pid, 0)) {
                if (log)
                    console.log(
                        `---- mongod Daemon running with pid:`,
                        daemon.pid,
                        ` ----`
                    );
                return daemon;
            } else {
                writeFileSync(pidPath, ``); //catches case where daemon was killed manually, but pid file wasn't set to empty
                return false;
            }
        } catch (e) {
            console.log(e);
            return false; //process.kill(pid, 0) used to test for existence of process. Does nothing if exists, throws error if doesn't exist.
        }
    } else return false;
}

export function killDaemon() {
    let daemon = checkDaemon();
    if (!daemon) {
        console.log('---- No running db Daemon to kill ----');
    } else {
        // let pid = daemon.pid
        try {
            if (process.kill(daemon.pid, 'SIGINT')) {
                writeFileSync(pidPath, ``);
                console.log(
                    `---- mongodb Daemon killed successfully, former pid: `,
                    daemon.pid,
                    ` ----`
                );
            }
        } catch (e) {
            console.log(
                `---- Error, failed to kill mongodb Daemon. Still running at pid: `,
                daemon.pid,
                ` ----`
            );
        }
    }
}

export function spawnDaemon(startedByServer = false) {
    let daemon = checkDaemon();
    if (daemon) {
        console.log(
            `---- MongoDB Daemon already running w/ pid: `,
            daemon.pid,
            ` ----`
        );
    } else {
        const outPath = resolveServer(
            `database/mongodLogs/out_${logCount}.log`
        );
        console.log('---- Attempting to launch a child mongod process ----');
        //put these 4 lines in the actual function body, since just because this module gets imported, that doesn't mean it is necessarily going to be invoked
        console.log(
            'mongod logFile #',
            logCount,
            `(path: src/server/database/mongodLogs/out_${logCount}.log)`
        );
        //When using the detached option to start a long-running process, the process will not stay running in the background after the parent exits unless it is provided with a stdio configuration that is not connected to the parent. If the parent's stdio is inherited, the child will remain attached to the controlling terminal.
        const out = openSync(outPath, 'a');
        const err = openSync(outPath, 'a');
        subProcess = spawn(
            `${config.mongodPath}`,
            [
                `--dbpath ${config.dbPath}`,
                `--bind_ip ${config.dbHost}`,
                `--port ${config.dbPort}`,
                `--directoryperdb`,
            ],
            {
                detached: true,
                stdio: ['ignore', out, err],
                shell: true,
            }
        );
        subProcess.once('spawn', () => {
            subProcess.unref();
            console.log(
                `---- mongod spawned with pid:`,
                subProcess.pid,
                ` ----`
            );
            trackDaemon(subProcess.pid, startedByServer);
        });
        return {pid: subProcess.pid, startedByServer};
    }
}

export function shell() {
    console.log('---- Attempting to launch a Mongo Shell ----');
    try {
        execSync(
            `mongo mongodb://${config.dbHost}:${config.dbPort}/${config.db}`,
            {
                stdio: 'inherit',
                shell: true,
            }
        );
    } catch (e) {
        console.warn(
            `---- Mongo Shell could not connect to a running mongo server ----`
        );
        throw e;
    }
}

export function clearLogs() {
    if (checkDaemon()) {
        console.log(
            `---- Won't delete logs while daemon is still writing to one ----`
        );
        console.log(`---- Kill Daemon and then try again ----`);
        return;
    }
    console.log('---- Deleting all mongod log files ----');
    execSync(`rm ${resolveServer('database/mongodLogs/*')}`);
}

//SWITCHED TO USING A GENERAL PURPOSE DB MANAGER SCRIPT WITH INQUIRER, THIS WAS ORIGINAL VERSION

//FORMER SCRIPTS WERE
//     "clearLogs": "rm ./database/mongodLogs/*",
//     "clearMongo": "rm -R ./database/.mongo/*",
//     "mongoDaemon": "node ./database/utils/dbDaemon.js launchDaemon",
//     "killDaemon": "node ./database/utils/dbDaemon.js killDaemon",
//     "mongoShell": "node database/utils/dbDaemon.js shell",
//     "clearUsers": "node database/utils/dbDaemon.js clearUsers",
//     "clearDB": "node database/utils/dbDaemon.js clearDB",
//     "mongoose": "node database/utils/mongoose.connection.js"

//to enable use via npm scripts and command line args
// let cmd = process.argv[2]
// if (cmd) {
//     // console.log(cmd)
//     switch (cmd) {
//         case 'launchDaemon':
//             spawnDaemon();
//             break;
//         case 'killDaemon':
//             killDaemon();
//             break;
//         case 'shell':
//             //come back later and fix async structure?
//             try {
//                 shell()
//                 console.log(`---- Mongo Shell Exited ----`)
//             }
//             catch (e) {
//                 // console.warn(`---- Mongo Shell could not connect to a running mongo server ----`)
//                 spawnDaemon();
//                 console.log(`---- Waiting for mongod Server to spin up ----`)
//                 setTimeout(() => {
//                     shell()
//                     console.log(`---- Mongo Shell Exited ----`)
//                 }, 2000) //wait 2 seconds, try shell again.
//             }
//             break;
//         case 'clearUsers':
//             console.log(`---- Attempting to drop users collection from db ${config.db} ----`)
//             execPromise(`mongo ${config.dbURL} --eval 'db.users.drop()'`)
//                 .then(result => {
//                     console.log(result.stdout);
//                 })
//             break;
//         case 'clearDB':
//             console.log(`---- Attempting to drop db ${config.db} ----`)
//             execPromise(`mongo ${config.dbURL} --eval 'db.dropDatabase()'`)
//                 .then(result => {
//                     console.log(result.stdout);
//                 })
//             break;
//     }
// }
