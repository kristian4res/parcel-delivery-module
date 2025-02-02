import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env['DATABASE_HOST'],
    port: Number(process.env['DATABASE_PORT']) || 3306,
    user: process.env['DATABASE_USERNAME'],
    database: process.env['DATABASE_SCHEMA'],
    password: process.env['DATABASE_PASSWORD'],
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function dbConnectWithRetry(retries = 4, delay = 2000) {
    try {
        await pool.getConnection();
        console.log('Connected to Parcel-Delivery Database 📦');
    } catch (err) {
        if (retries === 0) {
            console.error('Database connection error 📦❌: ', err);
            process.exit(1);
        } else {
            console.log(`Failed to connect to database. Retrying in ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            await dbConnectWithRetry(retries - 1, delay);
        }
    }
}

dbConnectWithRetry();

export { pool as db }