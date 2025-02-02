import 'dotenv/config';
import { RowDataPacket } from 'mysql2';
import { db } from '../database/index';
import { serverInstance } from '../index';
import { Agent } from 'supertest';

export const app = serverInstance;
export const BASE_URL = '/api/v1/parcel-delivery';

export async function testAuthenticatedUser(agent: Agent) {
    try {
        await agent
            .post(`${BASE_URL}/auth/register`)
            .send({
                username: 'testuser',
                password: 'TestPassword123!'
            });

        const loginRes = await agent
            .post(`${BASE_URL}/auth/login`)
            .send({
                username: 'testuser',
                password: 'TestPassword123!'
            });
        
        if (!loginRes.body.token) {
            console.error("Could not get token");
        }
        return agent;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const clearDatabaseTables = async () => {
    console.log('Clearing out database tables...');
    await db.query('DELETE FROM delivery_tokens');
    await db.query('DELETE FROM deliveries');
    await db.query('DELETE FROM accounts');

    let isCleared = true;
    let maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
        const [deliveryTokens] = await db.query('SELECT * FROM delivery_tokens') as RowDataPacket[];
        const [deliveries] = await db.query('SELECT * FROM deliveries') as RowDataPacket[];
        const [accounts] = await db.query('SELECT * FROM accounts') as RowDataPacket[];

        if (deliveryTokens.length > 0 || deliveries.length > 0 || accounts.length > 0) {
            console.error('Failed to clear out database tables');
            isCleared = false;
            break;
        }
    }

    return isCleared;
};

beforeAll(async () => {
    console.log('Establishing connection...');
});

afterEach(async () => {
    const isCleared = await clearDatabaseTables();
    if (isCleared) {
        console.log('Successfully cleared out database tables');
    }
    else {
        console.error('Failed to clear out database tables');
        throw new Error('Failed to clear out database!');
    }
});

afterAll(async () => {
    if (db) {
        console.log('Closing database connection...👋');
        await db.end();
    }

    if (app) {
        console.log('Closing server connection...👋');
        app.close();
    }
});