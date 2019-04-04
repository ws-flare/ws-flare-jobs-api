import { Client, expect } from '@loopback/testlab';
import { WsFlareJobsApiApplication } from '../..';
import { setupApplication, startMysqlContainer } from './test-helper';

describe('Sockets', () => {
    let app: WsFlareJobsApiApplication;
    let client: Client;
    let container: any;
    let port: number;

    before(async () => {
        ({container, port} = await startMysqlContainer());

        ({app, client} = await setupApplication(port));
    });

    after(async () => {
        await container.stop();
        await app.stop();
    });

    it('should create a new socket', async () => {
        const res = await client.post('/sockets').send({
            jobId: 'abc123',
            connected: true
        }).expect(200);

        expect(res.body.id).not.null();
        expect(res.body.connected).to.eql(true);
    });

    it('should get a list of sockets', async () => {
        await client.post('/sockets').send({jobId: 'abc123', connected: true}).expect(200);
        await client.post('/sockets').send({jobId: 'abc123', connected: true}).expect(200);
        await client.post('/sockets').send({jobId: 'abc123', connected: true}).expect(200);

        const res = await client.get('/sockets').expect(200);

        expect(res.body.length).greaterThanOrEqual(3);
    });

});
