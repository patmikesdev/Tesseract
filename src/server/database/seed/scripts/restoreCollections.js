import config from '#config';
import util from 'util';
import {exec} from 'child_process';

const execPromise = util.promisify(exec);

// view in mongo shell with
// db.users.find({}, { pic: 0 }).pretty()

//INITIAL VERSION IMPORTING FROM A JSON ARRAY
// let command1 = `mongoimport --host ${config.dbHost} --port ${config.dbPort} --db ${config.db} --collection users --jsonArray --drop --file ./userSeed.json`;

//VERSION USING MONGORESTORE, PROBABLY SUPERIOR BECAUSE IT DUMP/RESTORE CAN PRESERVE INDEXES?
let command1 = `mongorestore --host ${config.dbHost} --port ${config.dbPort} --drop ./_userSeed/`;
let command2 = `mongorestore --host ${config.dbHost} --port ${config.dbPort} --drop ./_accountSeed/`;
let command3 = `mongorestore --host ${config.dbHost} --port ${config.dbPort} --drop ./_postSeed/`;

//FROM SODA DINER VERSION, W/O LAUNCH DAEMON
//interesting, before I added await, the logging from this import was coming in the middle of my test logs,
//see test_setup.js, where this gets imported, basically was starting tests before importing was complete?
// await execPromise(command1, { cwd: './database/seed/' })
//     .then(result => console.log(result.stderr)) //result = object returned from execPromise

export default async function restoreCollections() {
    await execSeed().then((results) => {
        console.log(results[0].stderr);
        console.log(results[1].stderr);
        console.log(results[2].stderr);
    });

    function execSeed() {
        return Promise.all([
            execPromise(command1, {
                cwd: config.resolveServer('./database/seed/collectionDumps'),
            }),
            execPromise(command2, {
                cwd: config.resolveServer('./database/seed/collectionDumps'),
            }),
            execPromise(command3, {
                cwd: config.resolveServer('./database/seed/collectionDumps'),
            }),
        ]);
    }
}
