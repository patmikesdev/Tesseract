import {resolveServer} from '#config';
import inquirer from 'inquirer';
import {execSync} from 'child_process';
import {readdirSync} from 'fs';
// import {
//     loginSimulator,
//     logoutSimulator,
// } from './activitySimulator/simulateLogins.js';

//read names of possible DB backups to use
let backupEntries = readdirSync(resolveServer('database/seed/dumps'), {
    withFileTypes: true,
    encoding: 'utf8',
});
let backups = [];
for (let entry of backupEntries) {
    backups.push(entry.name);
}

let inq = inquirer.createPromptModule();

let questions = [];
let q1 = {};
q1.type = 'list';
q1.name = 'q1';
q1.message = 'Which database do you wish to access?';
q1.choices = [
    {
        name: 'dev',
        value: 'dev',
    },
    {
        name: 'test',
        value: 'test',
    },
    {
        name: 'production',
        value: 'production',
    },
];
questions.push(q1);

let q2 = {};
q2.type = 'list';
q2.name = 'q2';
q2.message = 'Which operation do you want to perform?';
q2.choices = [
    new inquirer.Separator(`\t---- mongo Daemon operations ----`),
    {name: 'Clear mongo log files', value: 'clearLogs'},
    {name: 'Launch a mongo shell', value: 'shell'},
    {name: 'Kill Running mongo Daemon', value: 'killDaemon'},
    {name: 'Launch a mongo Daemon in background', value: 'launchDaemon'},
    {name: 'Check if mongo Daemon running', value: 'checkDaemon'},
    new inquirer.Separator(`\n\t---- DB Seeding, Backup operations ----`),
    {name: 'Drop db (erase contents)', value: 'drop'},
    {name: 'Create backup/seed by dumping DB to file', value: 'backup'},
    {name: 'Clone from backup into different DB', value: 'clone' },
    {
        name: 'Create backup/seed by dumping individual collections to file',
        value: 'backupCollections',
    },
    {name: 'Restore from backup/seed', value: 'restore'},
    {
        name: 'Restore individual collections from seed',
        value: 'restoreCollections',
    },
    {name: 'Full teardown and re-seed from js', value: 'fullReSeed'},
    {
        name: 'Seed empty database using JS and mongoose',
        value: 'initialBuild',
    },
    new inquirer.Separator(`\n\t---- Simulate Users Activity----`),
    {name: 'Simulate Multiple User logins', value: 'login'},
    {name: 'Logout Simulated Users', value: 'logout'},
];
q2.pageSize = 20;
questions.push(q2);

let qU = {};
qU.type = 'checkbox';
qU.name = 'qU';
(qU.message = 'What Users do you want to login?'),
(qU.choices = [
    {
        name: 'Alan Turing',
        value: {
            email: 'aTuring@gmail.com',
            password: 'turing',
        },
    },
    {
        name: 'Rosalind Franklin',
        value: {
            email: 'rFranklin@gmail.com',
            password: 'franklin',
        },
    },
    {
        name: 'Albert Einstein',
        value: {
            email: 'aEinstein@gmail.com',
            password: 'einstein',
        },
    },
    {
        name: 'James Clerk Maxwell',
        value: {
            email: 'jMaxwell@gmail.com',
            password: 'maxwell',
        },
    },
    {
        name: 'Emmy Noether',
        value: {
            email: 'eNoether@gmail.com',
            password: 'noether',
        },
    },
    {
        name: 'Frank Wilczek',
        value: {
            email: 'fWilczek@gmail.com',
            password: 'wilczek',
        },
    },
]),
(qU.when = (a) => a.q2 === 'login');
questions.push(qU);

//Input for specifying name of backup, default uses current date string
let qNameBackup = {};
qNameBackup.type = 'input';
qNameBackup.name = 'qNameBackup';
(qNameBackup.message = 'What File Name to you want to save the Db Seed under?'),
    (qNameBackup.default = (a) => {
        let d = new Date().toISOString();
        return `${a.q1}_DB_Backup_${d}`;
    });
qNameBackup.when = (a) => a.q2 === 'backup';
questions.push(qNameBackup);

//Input for selecting which backup you want to use as seed
let qSelectBackup = {};
qSelectBackup.type = 'list';
qSelectBackup.name = 'qSelectBackup';
(qSelectBackup.message = 'Which backup file do you wish to restore/clone from?'),
(qSelectBackup.choices = backups);
qSelectBackup.when = (a) => (a.q2 === 'restore' || a.q2 === 'clone');
questions.push(qSelectBackup);

let qDesignateBackupDB = {};
qDesignateBackupDB.type = 'list';
qDesignateBackupDB.name = 'qDesignateBackupDB';
qDesignateBackupDB.message = 'Which DB are you trying to restore from?',
    qDesignateBackupDB.choices = [
        {
            name: 'development',
            value: 'development',
        },
        {
            name: 'test',
            value: 'test',
        },
        {
            name: 'production',
            value: 'production',
        },
    ];
qDesignateBackupDB.when = (a) => a.q2 === 'clone';
questions.push(qDesignateBackupDB);

let q3 = {};
q3.type = 'confirm';
q3.name = 'q3';
q3.message = 'Confirm this is what you want';
q3.default = false;
questions.push(q3);

inq(questions).then((answers) => {
    let fileArg = answers.qNameBackup
        ? answers.qNameBackup
        : answers.qSelectBackup
            //really will be three args in one, fileName, srcDB, and targetDB, passed as argv[] 3-5
            ? `${answers.qSelectBackup} Portfolio_${answers.qDesignateBackupDB} Portfolio_${answers.q1}`
            : null;
    if (!answers.q3) {
        return;
    }
    if (answers.qU) {
        loginSimulator(answers.qU);
    }
    if (answers.q2 === 'logout') {
        logoutSimulator();
    } else {
        //had to run this way so importing config didn't happen before user could choose which db to use
        let command = `_env=${answers.q1} node ${resolveServer('database/utils/operator.js')} ${answers.q2} ${fileArg}`;
        // console.log(command)
        execSync(command, {stdio: 'inherit'});
    }
});
