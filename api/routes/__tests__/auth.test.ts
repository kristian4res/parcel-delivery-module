import request, { Agent } from 'supertest';
import { BASE_URL, app } from '../../test/setup';
import { UserPayload } from '../../interfaces/auth';

const createTestUser = (agent: Agent, userPayload: UserPayload) => {
    return agent
    .post(`${BASE_URL}/auth/register`)
    .send(userPayload);
};

const loginTestUser = (agent: Agent, userPayload: UserPayload) => {
    return agent
    .post(`${BASE_URL}/auth/login`)
    .send(userPayload);
};

describe('User login', () => {
    let agent = new request.agent(app);

    it('should login a user with valid credentials', async () => {
        await createTestUser(agent, {
            username: 'testuser',
            password: 'TestPassword123!'
        });

        const res = await agent
            .post(`${BASE_URL}/auth/login`)
            .send({
                username: 'testuser',
                password: 'TestPassword123!'
            });

        expect(res.statusCode).toEqual(200);
    });

    it('should not login a user with invalid credentials', async () => {
        const res = await agent
            .post(`${BASE_URL}/auth/login`)
            .send({
                username: 'invaliduser',
                password: 'invalidpassword'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body.errors[0].msg).toEqual("Please enter a valid password. It must be at least 8 characters long with one lowercase and uppercase letter, one number and one symbol (e.g. %$@!)");
    });
});

describe('User logout', () => {
    let agent = new request.agent(app);

    beforeAll(async () => {
        await createTestUser(agent, {
            username: 'newuser',
            password: 'NewPassword123!'
        });
    });

    it('should logout a user', async () => {
        await loginTestUser(agent, {
            username: 'newuser',
            password: 'NewPassword123!'
        });

        const res = await agent
            .post(`${BASE_URL}/auth/logout`);

        expect(res.statusCode).toEqual(200);

        const failedRes = await agent
            .post(`${BASE_URL}/auth/logout`);

        expect(failedRes.statusCode).toEqual(401);
    });

    it('should not logout a user who is not logged in', async () => {
        const res = await agent
            .post(`${BASE_URL}/auth/logout`);

        expect(res.statusCode).toEqual(401);
    });
});

describe('User registration', () => {
    let agent = new request.agent(app);

    it('should register a user with valid credentials', async () => {
        const res = await agent
            .post(`${BASE_URL}/auth/register`)
            .send({
                username: 'newuser',
                password: 'NewPassword123!'
            });

        expect(res.statusCode).toEqual(201);
    });

    it('should not register a user with invalid username', async () => {
        const res = await agent
            .post(`${BASE_URL}/auth/register`)
            .send({
                username: 'invalid@username',
                password: 'ValidPassword123!'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body.errors[1].msg).toEqual('Please enter a valid username. It should not include any special characters (e.g. @£$%@^) and must be within 1 - 15 characters long.');
    });

    it('should not register a user with invalid password', async () => {
        const res = await agent
            .post(`${BASE_URL}/auth/register`)
            .send({
                username: 'validusername',
                password: 'invalid'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body.errors[0].msg).toEqual('Please enter a valid password. It must be at least 8 characters long with one lowercase and uppercase letter, one number and one symbol (e.g. %$@!)');
    });

    it('should not register a user with existing username', async () => {
        await createTestUser(agent, {
                username: 'existinguser',
                password: 'ValidPassword123!'
            });

        const res = await agent
            .post(`${BASE_URL}/auth/register`)
            .send({
                username: 'existinguser',
                password: 'ValidPassword123!'
            });

        expect(res.statusCode).toEqual(409);
        expect(res.body.message).toEqual('Username already exists');
    });
});