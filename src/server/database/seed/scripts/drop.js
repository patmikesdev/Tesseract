import config from '#config';
import {connect, disconnect} from '#mongooseConnect';
import {User, buildUserSeed} from '#userModel';
import {Account, buildAccountSeed} from '#accountModel';
import util from 'util';
import {exec} from 'child_process';
import mongoose from 'mongoose';

const execPromise = util.promisify(exec);

let command3 = `mongo ${config.dbURL} --eval 'db.dropDatabase()'`;

export default function drop() {
    return execPromise(command3, {cwd: config.resolveServer('database/seed/')}) //drop the db
        .then((result) => {
            console.log('---- dropping db ----\n');
            console.log(result.stdout);
            console.log('---- db dropped ----\n');
        });
}
