import {Client, expect} from '@loopback/testlab';
import {WsFlareJobsApiApplication} from '../..';
import {setupApplication, startMysqlContainer} from './test-helper';

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
            connected: true,
            errorTime: new Date()
        }).expect(200);

        expect(res.body.id).not.null();
        expect(res.body.connected).to.eql(true);
        expect(res.body.data).not.null();
    });

    it('should get a list of sockets', async () => {
        await client.post('/sockets').send({jobId: 'abc123', connected: true}).expect(200);
        await client.post('/sockets').send({jobId: 'abc123', connected: true}).expect(200);
        await client.post('/sockets').send({jobId: 'abc123', connected: true}).expect(200);

        const res = await client.get('/sockets').expect(200);

        expect(res.body.length).greaterThanOrEqual(3);
    });

    it('should filter into time groups of 10 seconds', async () => {
        await client.post('/sockets').send({
            jobId: 'time',
            connected: true,
            connectionTime: '2019-04-07T11:51:13.000Z'
        });
        await client.post('/sockets').send({
            jobId: 'time',
            connected: true,
            connectionTime: '2019-04-07T11:51:15.000Z'
        });
        await client.post('/sockets').send({
            jobId: 'time',
            connected: true,
            connectionTime: '2019-04-07T11:51:14.000Z'
        });
        await client.post('/sockets').send({
            jobId: 'time',
            connected: true,
            connectionTime: '2019-04-07T11:51:21.000Z'
        });
        await client.post('/sockets').send({
            jobId: 'time',
            connected: true,
            connectionTime: '2019-04-07T11:51:23.000Z'
        });
        await client.post('/sockets').send({
            jobId: 'time',
            connected: true,
            connectionTime: '2019-04-07T11:51:24.000Z'
        });
        await client.post('/sockets').send({
            jobId: 'unknown',
            connected: true,
            connectionTime: '2019-04-07T11:51:24.000Z'
        });
        await client.post('/sockets').send({
            jobId: 'time',
            connected: false,
            connectionTime: '2019-04-07T11:51:24.000Z'
        });

        const filter1 = {
            jobId: 'time',
            connected: true,
            connectionTime: {neq: null},
            and: [
                {connectionTime: {gte: '2019-04-07T11:51:12.000Z'}},
                {connectionTime: {lte: '2019-04-07T11:51:22.000Z'}}
            ]
        };

        const filter2 = {
            jobId: 'time',
            connected: true,
            connectionTime: {neq: null},
            and: [
                {connectionTime: {gte: '2019-04-07T11:51:22.000Z'}},
                {connectionTime: {lte: '2019-04-07T11:51:32.000Z'}}
            ]
        };

        const res1 = await client.get(`/sockets/count?where=${JSON.stringify(filter1)}`).expect(200);
        const res2 = await client.get(`/sockets/count?where=${JSON.stringify(filter2)}`).expect(200);

        expect(res1.body.count).to.eql(4);
        expect(res2.body.count).to.eql(2);
    });

    it('should get max and min connection time within a job', async () => {
        await client.post('/sockets').send({
            jobId: 'max-time',
            connected: true,
            connectionTime: '2019-04-07T11:51:13.000Z'
        });
        await client.post('/sockets').send({
            jobId: 'max-time',
            connected: true,
            connectionTime: '2019-04-07T11:51:15.000Z'
        });
        await client.post('/sockets').send({
            jobId: 'max-time',
            connected: true,
            connectionTime: '2019-04-07T11:51:14.000Z'
        });
        await client.post('/sockets').send({
            jobId: 'max-time',
            connected: true
        });

        const filterMax = {
            where: {
                jobId: 'max-time',
                connectionTime: {neq: null}
            },
            order: 'connectionTime DESC',
            limit: 1,
            fields: {connectionTime: true}
        };

        const filterMin = {
            where: {
                jobId: 'max-time',
                connectionTime: {neq: null}
            },
            order: 'connectionTime ASC',
            limit: 1,
            fields: {connectionTime: true}
        };


        const max = await client.get(`/sockets?filter=${JSON.stringify(filterMax)}`).expect(200);
        const min = await client.get(`/sockets?filter=${JSON.stringify(filterMin)}`).expect(200);

        expect(max.body).to.eql([{connectionTime: '2019-04-07T11:51:15.000Z'}]);
        expect(min.body).to.eql([{connectionTime: '2019-04-07T11:51:13.000Z'}]);
    });

});
