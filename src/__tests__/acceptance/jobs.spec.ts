import {Client, expect} from '@loopback/testlab';
import {WsFlareJobsApiApplication} from '../..';
import {setupApplication, startMysqlContainer} from './test-helper';

describe('Jobs', () => {
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

    it('should create a new job', async () => {
        const res = await client.post('/jobs').send({
            userId: 'user1',
            taskId: 'abc123'
        }).expect(200);

        expect(res.body.id).not.null();
        expect(res.body.createdAt).not.null();
        expect(res.body.userId).to.eql('user1');
        expect(res.body.taskId).to.eql('abc123');
    });

    it('should get a list of jobs', async () => {
        await client.post('/jobs').send({userId: 'user1', taskId: 'abc123'}).expect(200);
        await client.post('/jobs').send({userId: 'user2', taskId: 'abc123'}).expect(200);
        await client.post('/jobs').send({userId: 'user3', taskId: 'abc123'}).expect(200);

        const res = await client.get('/jobs').expect(200);

        expect(res.body.length).to.be.greaterThan(2);
    });

    it('should get a job by id', async () => {
        const job = await client.post('/jobs').send({userId: 'myTestUser', taskId: 'abc123'}).expect(200);

        const res = await client.get(`/jobs/${job.body.id}`).expect(200);

        expect(res.body.id).not.null();
        expect(res.body.userId).to.eql('myTestUser');
        expect(res.body.taskId).to.eql('abc123');
    });

    it('should update running status', async () => {
        const job = await client.post('/jobs').send({
            userId: 'myTestUser',
            taskId: 'abc123',
            isRunning: false
        }).expect(200);

        await client.patch(`/jobs/${job.body.id}`).send({
            userId: 'myTestUser',
            taskId: 'abc123',
            isRunning: true
        }).expect(204);

        const res = await client.get(`/jobs/${job.body.id}`).expect(200);

        expect(res.body.isRunning).to.eql(true);
    });

    it('should update test result', async () => {
        const job = await client.post('/jobs').send({
            userId: 'myTestUser',
            taskId: 'abc123',
            isRunning: true,
            passed: false
        }).expect(200);

        await client.patch(`/jobs/${job.body.id}`).send({
            userId: 'myTestUser',
            taskId: 'abc123',
            isRunning: true,
            passed: true
        }).expect(204);

        const res = await client.get(`/jobs/${job.body.id}`).expect(200);

        expect(res.body.passed).to.eql(true);
    });

});
