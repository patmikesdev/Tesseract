// import build from '../seed/scripts/initialBuild.js';
import backup from '../seed/scripts/backup.js';
import backupCollections from '../seed/scripts/backupCollections.js';
import drop from '../seed/scripts/drop.js';
import restore from '../seed/scripts/restore.js';
import restoreCollections from '../seed/scripts/restoreCollections.js';
import {
    spawnDaemon,
    killDaemon,
    shell,
    clearLogs,
    checkDaemon,
} from '#dbDaemon';

switch (process.argv[2]) {
case 'drop':
    drop();
    break;
    // case 'initialBuild':
    //     build();
    //     break;
case 'backup':
    backup(process.argv[3]);
    break;
case 'backupCollections':
    backupCollections();
    break;
case 'restore':
    restore(process.argv[3]);
    break;
case 'restoreCollections':
    restoreCollections();
    break;
case 'fullReSeed':
    drop().then(build).then(backup);
    break;
case 'launchDaemon':
    spawnDaemon();
    break;
case 'killDaemon':
    killDaemon();
    break;
case 'checkDaemon':
    checkDaemon();
    break;
case 'shell':
    shell();
    console.log(`---- Mongo Shell Exited ----`);
    break;
case 'clearLogs':
    clearLogs();
    break;
case 'logins':
    loginSimulator();
    break;
}
