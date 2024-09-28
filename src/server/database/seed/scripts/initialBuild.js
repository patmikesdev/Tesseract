// import config from '#config';
// import {connect, disconnect} from '#mongooseConnect';
// import {User, buildUserSeed} from '#userModel';
// import {Account, buildAccountSeed} from '#accountModel';
// import util from 'util';
// import {exec} from 'child_process';
// import mongoose from 'mongoose';

// export default function build() {
//     console.log(`---- populating initial db from .js files w/ mongoose ----`);
//     let ids = {
//         'Albert Einstein': new mongoose.Types.ObjectId(),
//         'James Clerk Maxwell': new mongoose.Types.ObjectId(),
//         'Frank Wilczek': new mongoose.Types.ObjectId(),
//         'Alan Turing': new mongoose.Types.ObjectId(),
//         'Rosalind Franklin': new mongoose.Types.ObjectId(),
//         'Emmy Noether': new mongoose.Types.ObjectId(),
//     };

//     let accounts = buildAccountSeed(ids);
//     let users = buildUserSeed(ids);

//     return connect()
//         .then(() => Promise.all([Account.create(accounts), User.create(users)]))
//         .then((results) => {
//             // console.log(results[0])
//             for (let account of results[0]) {
//                 console.log(`\t-- Account created for ${account.userName} --`);
//             }
//             for (let user of results[1]) {
//                 console.log(`\t-- User ${user.name} created --`);
//             }
//             console.log(`---- finished populating DB ----`);
//         })
//         .then(disconnect);
// }
