//WARNING: THIS IS A DEV ONLY FEATURE, USED TO SIMULATE MULTIPLE USERS LOGGED IN AT ONCE
//WHILE FUNCTIONAL, I DIDN'T HAVE TIME TO FINE TUNE THIS PRIOR TO SUBMISSION
//Would like to come back, and make this an async process with actual user-agents rather than just writing data to json file

import fetch from 'node-fetch';
import config from '#config';
import {writeFileSync, readFileSync} from 'fs';

let pathToData = './database/utils/activitySimulator/loggedInUserData.json';
let sessionCookies = readFileSync(pathToData, {encoding: 'utf8'});
if (!sessionCookies) sessionCookies = [];
else sessionCookies = JSON.parse(sessionCookies);

export function loginSimulator(users) {
    for (let user of users) {
        fetch(`http://localhost:${config.port}/api/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({...user}),
        }).then((r) => {
            let cookie = r.headers.get('set-cookie').split(' ')[0];
            //alternative method from node-fetch readme,
            //.raw would be useful in event I had multiple cookie values, would return an array of strings instead of a single long string
            // r.headers.raw()['set-cookie']
            // console.log('cookie:', cookie)
            sessionCookies.push(cookie);
            writeFileSync(pathToData, JSON.stringify(sessionCookies, null, 2));
            // console.log('session cookies:', sessionCookies)
        });
    }
    // console.log(users)
}

export function logoutSimulator() {
    writeFileSync(pathToData, '');
    for (let cookie of sessionCookies) {
        fetch(`http://localhost:${config.port}/api/auth/logout`, {
            method: 'GET',
            headers: {cookie: cookie},
        });
    }
}

//format of req.headers sent from logout
// {
//     cookie: 'tesseractSession=s%3ATDBGjofIAgbhELTEAqlh5ppfhajft7rb.EItJB2aMoO%2BKpcMB33TCv3gqMgCIDmG0oXBe3AkudtU',
//      ...
// }
