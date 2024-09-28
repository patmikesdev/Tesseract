import config from '#config';
import util from 'util';
import {exec} from 'child_process';

const execPromise = util.promisify(exec);

// view in mongo shell with
// db.users.find({}, { pic: 0 }).pretty()

//FROM SODA DINER VERSION, W/O LAUNCH DAEMON
//interesting, before I added await, the logging from this import was coming in the middle of my test logs,
//see test_setup.js, where this gets imported, basically was starting tests before importing was complete?
// await execPromise(command1, { cwd: './database/seed/' })
//     .then(result => console.log(result.stderr)) //result = object returned from execPromise

export default async function restore(fileArg) {
    //VERSION USING MONGORESTORE, PROBABLY SUPERIOR BECAUSE IT DUMP/RESTORE CAN PRESERVE INDEXES?
    let command = `mongorestore --host ${config.dbHost} --port ${config.dbPort} --drop ./${fileArg}`;
    await execSeed().then((results) => {
        console.log(results.stderr);
    });

    function execSeed() {
        return execPromise(command, {
            cwd: config.resolveServer('./database/seed/dumps'),
        });
    }
}
