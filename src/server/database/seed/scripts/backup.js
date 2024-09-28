import config from '#config';
import util from 'util';
import {exec} from 'child_process';

const execPromise = util.promisify(exec);

export default function backup(fileName) {
    console.log(`---- Creating db backup / seed ----\n`);
    //VERSION EXPORTING .bson FILES FOR ENTIRE DB TO SPECIFIC DIRECTORY
    let command = `mongodump --host ${config.dbHost} --port ${config.dbPort} --db ${config.db} --out ./${fileName}/`;
    return execPromise(command, {
        cwd: config.resolveServer('./database/seed/dumps'),
    }) //dump the contents to file
        .then((results) => {
            console.log(results.stderr);
        });
}
