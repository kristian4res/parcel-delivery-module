import request from 'supertest';
import { app } from '../../test/setup';


const BASE_URL = '/api/v1/parcel-delivery';

describe('GET /', () => {
    it('should respond with a message', async () => {
        const res = await request(app)
            .get(`${BASE_URL}`)
            .send();

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Backend API is online!');
    });
});

describe('GET /health', () => {
    it('should respond with a health message', async () => {
        const res = await request(app)
            .get(`${BASE_URL}/health`)
            .send();

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('API is healthy');
    });
});