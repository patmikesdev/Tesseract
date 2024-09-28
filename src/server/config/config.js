import {realpathSync} from 'fs';
import {resolve} from 'path';

const serverRoot = resolve(realpathSync(process.cwd()), 'src/server');

export function resolveServer(relativePath) {
    return resolve(serverRoot, relativePath);
}

let config = {
    port: process.env.PORT || 3000,
    devServerPort: 2324,
    dbHost: process.env._dbHost || '127.0.0.1', //sometimes localhost name might be changed, use this instead
    dbPort: process.env._dbPort || '23232',
    mongodPath: process.env._mongodPath || '/usr/local/mongodb/bin/mongod',
    dbPath: process.env._dbPath || resolve(serverRoot, 'database/.mongo'),
    cookie: {
        options: {
            httpOnly: false,
            path: '/',
        },
        secret: 'secretSquirrel',
        sessionName: 'tesseractSession',
    },
    serverRoot,
    resolveServer: (relativePath) => resolve(serverRoot, relativePath), //original code was written with different file structure, this adapts to newer structure (particularly relationship of process.cwd and everything else)
};

switch (process.env.NODE_ENV) {
case 'testing':
    config.db = 'testing';
    config.port = 3001;
    break;
case 'dev':
    config.db = 'tesseractDev';
    break;
case 'seeding':
    config.db = 'dev';
    // config.dbPort = '27017';
    break;
case 'production':
    config.db = 'production';
    break;
default:
    config.db = 'dev';
}
config.dbURL = `mongodb://${config.dbHost}:${config.dbPort}/${config.db}`;

export default config;
