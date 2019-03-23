import { Client, expect } from '@loopback/testlab';
import { WsFlareJobsApiApplication } from '../..';
import { setupApplication, startMysqlContainer } from './test-helper';

describe('Nodes', () => {
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

    it('should create a new node', async () => {
        const res = await client.post('/nodes').send({
            jobId: 'abc123',
            name: 'test-node-1',
            running: true
        }).expect(200);

        expect(res.body.id).not.null();
        expect(res.body.jobId).to.eql('abc123');
        expect(res.body.name).to.eql('test-node-1');
        expect(res.body.running).to.eql(true);
        expect(res.body.totalSuccessfulConnections).to.eql(0);
        expect(res.body.totalFailedConnections).to.eql(0);
        expect(res.body.totalDroppedConnections).to.eql(0);
    });

    it('should get a list of nodes in a job', async () => {
        await client.post('/nodes').send({jobId: 'node1', name: 'test-node-1', running: true}).expect(200);
        await client.post('/nodes').send({jobId: 'node1', name: 'test-node-2', running: true}).expect(200);
        await client.post('/nodes').send({jobId: 'node2', name: 'test-node-3', running: true}).expect(200);
        await client.post('/nodes').send({jobId: 'node2', name: 'test-node-4', running: true}).expect(200);

        const res = await client.get(`/nodes?filter=${JSON.stringify({where: {jobId: 'node2'}})}`);

        expect(res.body.length).to.equal(2);
    });

    it('should be able to update connection stats', async () => {
        const node = await client.post('/nodes').send({jobId: 'node1', name: 'test-stats', running: true}).expect(200);

        await client.patch(`/nodes/${node.body.id}`).send({
            jobId: 'node1',
            name: 'test-stats',
            running: false,
            totalSuccessfulConnections: 100,
            totalFailedConnections: 25,
            totalDroppedConnections: 32
        });

        const res = await client.get(`/nodes/${node.body.id}`).expect(200);

        expect(res.body.id).to.equal(node.body.id);
        expect(res.body.jobId).to.eql('node1');
        expect(res.body.name).to.eql('test-stats');
        expect(res.body.running).to.equal(false);
        expect(res.body.totalSuccessfulConnections).to.equal(100);
        expect(res.body.totalFailedConnections).to.equal(25);
        expect(res.body.totalDroppedConnections).to.equal(32);
    });

});
