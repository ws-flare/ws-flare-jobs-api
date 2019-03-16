import { WsFlareJobsApiApplication } from '../..';
import { createRestAppClient, givenHttpServerConfig, Client } from '@loopback/testlab';
import * as mysql from 'mysql';
import { retry } from 'async';

let getRandomPort = require('random-port-as-promised');
let {Docker} = require('node-docker-api');

export async function setupApplication(mysqlPort: number): Promise<AppWithClient> {
    const config = givenHttpServerConfig();

    config.host = config.host || process.env.HOST || '127.0.0.1';
    config.port = config.port || +(process.env.PORT || 3000);

    const app = new WsFlareJobsApiApplication({
        mysqlPort,
        mysqlUsername: 'test',
        mysqlPassword: 'test',
        rest: config,
    });

    await app.boot();
    await app.migrateSchema();
    await app.start();

    const client = createRestAppClient(app);

    return {app, client};
}

export interface AppWithClient {
    app: WsFlareJobsApiApplication;
    client: Client;
}

export async function startMysqlContainer(): Promise<{ container: any, port: number }> {
    const docker = new Docker({socketPath: '/var/run/docker.sock'});
    const port = await getRandomPort();

    const container = await docker.container.create({
        Image: 'mysql:5',
        host: '127.0.0.1',
        port: port,
        Env: ['MYSQL_ROOT_PASSWORD=1', 'MYSQL_USER=test', 'MYSQL_PASSWORD=test', 'MYSQL_DATABASE=wsFlareJobsApi'],
        HostConfig: {
            PortBindings: {
                '3306/tcp': [
                    {
                        HostPort: `${port}`,
                    },
                ],
            },
        },
    });

    await container.start();

    await new Promise((resolve) => {
        retry({times: 20, interval: 2000}, done => {
            console.log('Trying to connect to mysql');
            const connection = mysql.createConnection({
                host: 'localhost',
                port: port,
                user: 'test',
                password: 'test',
                database: 'wsFlareJobsApi'
            });

            connection.connect();

            connection.query('SHOW TABLES', error => {
                done(error);
                connection.end();
            });

        }, () => resolve());
    });

    console.log('Mysql is up and running');

    return {container, port};
}
