import { RowDataPacket } from "mysql2";
import Hasher from "../helpers/hasher";
import { db } from "./index";
import { UserDetails } from "../interfaces/auth";


export async function insertUserRecord(username: string, password: string) {
    try {
        const hasher = new Hasher();
        const hashedPassword = hasher.hashPassword(password);
        const email = `${username}@parcel.com`;
        const role = 'user';

        const [result] = await db.execute<RowDataPacket[]>(
            'INSERT INTO accounts (full_name, username, email, password, role) VALUES (?, ?, ?, ?, ?)', 
            [username, username, email, hashedPassword, role]
        );

        console.log(`Successfully inserted user record: ${username}`);
        return result;
    } catch (err) {
        console.error(`Error inserting user record: ${username}`);
        throw err;
    }
};

export async function doesUserExist(username: string): Promise<boolean> {
    try {
        const [rows] = await db.execute<RowDataPacket[]>(
            'SELECT * FROM accounts WHERE username = ?', 
            [username]
        );

        if (rows.length > 0) {
            console.log(`User exists: ${username}`);
            return true;
        } else {
            console.log(`User does not exist: ${username}`);
            return false;
        }
    } catch (err) {
        console.error(`Error checking user existence: ${username}`);
        throw err;
    }
};

export async function findUserDetails(username: string, password: string) {
    try {
        const hasher = new Hasher();
        const [rows, _fields] = await db.execute<RowDataPacket[]>('SELECT * FROM accounts WHERE username = ?', [username]);

        if (rows.length > 0 && hasher.comparePassword(password, rows[0]['password'])) {
            const userDetails: UserDetails = { id: rows[0]['id'], username: username, role: rows[0]['role'] };
            console.log(`Successfully verified user: ${username}`);
            return { status: 200, message: 'Successfully verified user', data: userDetails};
        } else {
            console.log(`Could not find or identify user: ${username}`);
            return { status: 404, message: 'Could not find or identify user', data: null };
        }
    } catch (error) {
        console.error(`Error verifying user identity: ${username}`, error);
        throw { status: 500, message: 'Error verifying user identity', data: null };
    }
};