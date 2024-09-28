import config from '#config';
import util from 'util';
import {exec} from 'child_process';

const execPromise = util.promisify(exec);
//ORIGINAL VERSION EXPORTING DATA AS A JSON ARRAY
// let command1 = `mongoexport --host ${config.dbHost} --port ${config.dbPort} --db ${config.db} --collection users --pretty --jsonArray --out ./userSeed.json`;

//VERSION EXPORTING .bson FILES FOR A SPECIFIC COLLECTION TO SPECIFIC DIRECTORY
let command1 = `mongodump --host ${config.dbHost} --port ${config.dbPort} --db ${config.db} --collection accounts --out ./_accountSeed/`;
let command2 = `mongodump --host ${config.dbHost} --port ${config.dbPort} --db ${config.db} --collection users --out ./_userSeed/`;
let command3 = `mongodump --host ${config.dbHost} --port ${config.dbPort} --db ${config.db} --collection posts --out ./_postSeed/`;

export default function backupCollections() {
    console.log(`---- Creating db backup / seed ----\n`);
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
    ]) //dump the contents to file
        .then((results) => {
            console.log(results[0].stderr);
            console.log(results[1].stderr);
            console.log(results[2].stderr);
        });
}
