import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "./index";
import { formatDateInMySQL } from "../helpers/functions";
import { DeliveryRecord, DeliveryStatus } from "../interfaces/delivery";
import { DeliveryTokenRecord } from "../interfaces/deliveryToken";
import { WhereClause, QueryResult } from "../interfaces/sql";


const DELIVERIES_TABLE = 'deliveries';
const DELIVERY_TOKENS_TABLE = 'delivery_tokens';
export const DELIVERY_RECORD_FIELDS = [
    "delivery_id",
    "delivery_status",
    "service_level",
    "expected_delivery_date",
    "sender_address",
    "recipient_address",
    "created_at",
    "updated_at",
    "order_id"
];

// SQL operations (REFACTOR ERRs - custom error obj, returned errors should be meant for client side display, and RESOLVES; refactor to flexibily modify SELECT or WHERE clauses)
export async function insertDelivery(deliveryRecord: DeliveryRecord) {
    const keys = DELIVERY_RECORD_FIELDS;
    const values = Object.values(deliveryRecord);
    const placeholders = keys.map(() => '?').join(',');

    try {
        const [result] = await db.execute(
            `INSERT INTO ${DELIVERIES_TABLE} (${keys.join(',')}) VALUES (${placeholders})`, 
            values
        );
        console.log(`Successfully inserted delivery with ID '${deliveryRecord.deliveryId}'`);
        return result;
    } catch (err) {
        console.error(`Error inserting delivery with ID '${deliveryRecord.deliveryId}': `, err);
        throw err;
    }
}

export async function insertDeliveryToken(deliveryTokenId: string , deliveryToken: string, deliveryTokenExpiry: Date, deliveryId: string) {
    try {
        const [result] = await db.execute(
            `INSERT INTO ${DELIVERY_TOKENS_TABLE} (delivery_token_id, delivery_token, delivery_token_expiry, delivery_id) VALUES (?, ?, ?, ?)`, 
            [deliveryTokenId, deliveryToken, formatDateInMySQL(deliveryTokenExpiry), deliveryId]
        );
        console.log(`Successfully inserted delivery token: ${deliveryTokenId}`);
        return result;
    } catch (err) {
        console.error(`Error inserting delivery token: ${deliveryTokenId}`);
        throw err;
    }
}

export async function updateDeliveryRecord(deliveryId: string, updatedRecord: Partial<DeliveryRecord>): Promise<QueryResult<DeliveryRecord>> {
    try {
        console.log(`Updating delivery record with id ${deliveryId}...`);

        const updates = Object.keys(updatedRecord).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updatedRecord);
        values.push(deliveryId);

        const [result] = await db.execute(
            `UPDATE ${DELIVERIES_TABLE} 
            SET version = version + 1, ${updates}
            WHERE delivery_id = ?`, 
            values
        ) as [ResultSetHeader, FieldPacket[]];

        if (result.affectedRows === 0) {
            throw { status: 404, message: 'No delivery record found to update' };
        }

        console.log(`Successfully updated delivery record with id ${deliveryId}`);

        return { status: 200, message: `Successfully updated delivery record with id ${deliveryId}` };
    } catch (err) {
        console.error(`Error while trying to update database: `, err);
        throw { status: 500, message: 'Error while trying to update database', error: err };
    }
}

export async function getDeliveryRecords(page: number = 1, pageSize: number = 10): Promise<QueryResult<DeliveryRecord[]>> {
    try {
        const offset = (page - 1) * pageSize;
        console.log(`Fetching delivery records for page ${page} with page size ${pageSize}...`);
        const [rows] = await db.execute(
            `SELECT * FROM ${DELIVERIES_TABLE} LIMIT ?, ?`, 
            [offset, pageSize]
        ) as [RowDataPacket[], FieldPacket[]];

        if (!rows || rows.length === 0) {
            return { status: 404, message: 'No delivery records found' };
        }

        console.log(`Fetched ${rows.length} delivery records`);

        const deliveryRecords: DeliveryRecord[] = rows.map((row) => ({
            deliveryId: row.delivery_id,
            deliveryStatus: row.delivery_status,
            serviceLevel: row.service_level,
            expectedDeliveryDate: row.expected_delivery_date,
            senderAddress: row.sender_address,
            recipientAddress: row.recipient_address,
            deliveredAt: row.delivered_at,
            version: row.version,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            orderId: row.order_id,
        }));

        return { status: 200, message: `Fetched ${rows.length} delivery records`, data: deliveryRecords };
    } catch (err) {
        console.error(`Error while trying to query database for delivery records: `, err);
        throw { status: 500, message: 'Error while trying to query database', error: err };
    }
}

export async function getDeliveryRecordWhere(whereClause: WhereClause): Promise<QueryResult<DeliveryRecord>> {
    try {
        const [rows] = await db.execute(
            `SELECT * FROM ${DELIVERIES_TABLE} WHERE ${whereClause.field} = ?`, 
            [whereClause.value]
        ) as [RowDataPacket[], FieldPacket[]];

        if (!rows || rows.length === 0) {
            return { status: 404, message: 'Delivery not found' };
        }

        console.log(`Delivery record exists for '${whereClause.field}' = '${whereClause.value}'`);

        const deliveryRecord: DeliveryRecord = {
            deliveryId: rows[0].delivery_id,
            deliveryStatus: rows[0].delivery_status,
            serviceLevel: rows[0].service_level,
            expectedDeliveryDate: rows[0].expected_delivery_date,
            senderAddress: rows[0].sender_address,
            recipientAddress: rows[0].recipient_address,
            deliveredAt: rows[0].delivered_at,
            version: rows[0].version,
            createdAt: rows[0].created_at,
            updatedAt: rows[0].updated_at,
            orderId: rows[0].order_id,
        };

        return { status: 200, message: `Delivery record exists for '${whereClause.field}' = '${whereClause.value}'`, data: { ...deliveryRecord }};
    } catch (err) {
        console.error(`Error while trying to query database for a delivery record: `, err);
        throw { status: 500, message: 'Error while trying to query database', error: err };
    }
}

export async function getDeliveryRecordsForOrderIds(orderIds: string[], page: number = 1, pageSize: number = 10): Promise<QueryResult<DeliveryRecord[]>> {
    try {
        const placeholders = orderIds.map(() => '?').join(',');
        const offset = (page - 1) * pageSize;
        const [rows] = await db.execute(
            `SELECT * FROM ${DELIVERIES_TABLE} WHERE order_id IN (${placeholders}) LIMIT ?, ?`, 
            [...orderIds, offset, pageSize]
        ) as [RowDataPacket[], FieldPacket[]];

        if (!rows || rows.length === 0) {
            return { status: 404, message: 'No delivery records found for the given order IDs' };
        }

        console.log(`Found ${rows.length} delivery records for the given order IDs`);

        const deliveryRecords: DeliveryRecord[] = rows.map(row => ({
            deliveryId: row.delivery_id,
            deliveryStatus: row.delivery_status,
            serviceLevel: row.service_level,
            expectedDeliveryDate: row.expected_delivery_date,
            senderAddress: row.sender_address,
            recipientAddress: row.recipient_address,
            deliveredAt: row.delivered_at,
            version: row.version,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            orderId: row.order_id,
        }));

        return { status: 200, message: `Found ${rows.length} delivery records for the given order IDs`, data: deliveryRecords };
    } catch (err) {
        console.error(`Error while trying to query database for delivery records: `, err);
        throw { status: 500, message: 'Error while trying to query database', error: err };
    }
}

export async function getDeliveryTokenRecordWhere(whereClause: WhereClause): Promise<QueryResult<DeliveryTokenRecord>> {
    try {
        const [rows] = await db.execute(
            `SELECT * FROM ${DELIVERY_TOKENS_TABLE} WHERE ${whereClause.field} = ?`, 
            [whereClause.value]
        ) as [RowDataPacket[], FieldPacket[]];

        if (!rows || rows.length === 0) {
            return { status: 404, message: 'Delivery token not found' };
        }

        console.log(`Delivery token record exists for '${whereClause.field}' = '${whereClause.value}'`);

        const deliveryTokenRecord: DeliveryTokenRecord = {
            deliveryTokenId: rows[0].delivery_token_id,
            deliveryToken: rows[0].delivery_token,
            deliveryTokenExpiry: rows[0].delivery_token_expiry,
            deliveryId: rows[0].delivery_id,
        };

        return { status: 200, message: `Delivery token record exists for '${whereClause.field}' = '${whereClause.value}'`, data: { ...deliveryTokenRecord }};
    } catch (err) {
        console.error(`Error while trying to query database: `, err);
        throw { status: 500, message: 'Error while trying to query database', error: err };
    }
}

export async function validateDeliveryToken(deliveryToken: string): Promise<QueryResult<{ deliveryId: string }>> {
    try {
        const [rows] = await db.execute(
            `SELECT * FROM ${DELIVERY_TOKENS_TABLE} WHERE delivery_token = ? AND delivery_token_expiry > NOW() AND delivery_id IS NOT NULL`, 
            [deliveryToken]
        ) as [RowDataPacket[], FieldPacket[]];

        if (!rows || rows.length === 0 || !rows[0].delivery_id) {
            throw { status: 404, message: 'Delivery token is invalid or has expired' };
        }

        console.log(`Delivery token '${deliveryToken}' is valid`);

        return { status: 200, message: `Delivery token is valid`, data: { deliveryId: rows[0].delivery_id }};
    } catch (err) {
        console.error(`Error while trying to query database: `, err);
        throw { status: 500, message: 'Error while trying to query database', error: err };
    }
}

export async function setDeliveryTokenLinkToNull(deliveryId: string): Promise<QueryResult<null>> {
    try {
        const [result] = await db.execute(
            `UPDATE ${DELIVERY_TOKENS_TABLE} SET delivery_id = NULL WHERE delivery_id = ?`, 
            [deliveryId]
        ) as [ResultSetHeader, FieldPacket[]];

        if (result.affectedRows === 0) {
            throw { status: 404, message: 'No delivery token found to revoke' };
        }

        console.log(`Delivery token link to '${deliveryId}' has been set to null`);

        return { status: 200, message: `Delivery token has been revoked for ${deliveryId}`};
    } catch (err) {
        console.error(`Error while trying to update database: `, err);
        throw { status: 500, message: 'Error while trying to update database', error: err };
    }
}

export async function incrementDeliveryStatus(deliveryId: string): Promise<QueryResult<any>> {
    try {
        const [result] = await db.execute(
            `UPDATE ${DELIVERIES_TABLE} 
            SET delivery_status = delivery_status + 1,
            version = version + 1, 
            delivered_at = CASE WHEN delivery_status + 1 = 3 THEN NOW() ELSE delivered_at END 
            WHERE delivery_id = ?`, 
            [deliveryId]
        ) as [ResultSetHeader, FieldPacket[]];

        if (result.affectedRows === 0) {
            throw { status: 404, message: 'No delivery record found to update' };
        }

        console.log(`Successful delivery status update for: ${deliveryId}`);

        return { status: 200, message: `Successful delivery status update for: ${deliveryId}` };
    } catch (err) {
        console.error(`Error while trying to update database: `, err);
        throw { status: 500, message: 'Error while trying to update database', error: err };
    }
}

export async function resetDeliveryStatus(orderId: string): Promise<QueryResult<any>> {
    try {
        const [result] = await db.execute(
            `UPDATE ${DELIVERIES_TABLE} 
            SET delivery_status = 0
            WHERE order_id = ?`, 
            [orderId]
        ) as [ResultSetHeader, FieldPacket[]];

        if (result.affectedRows === 0) {
            throw { status: 404, message: 'No delivery record found to update' };
        }

        console.log(`Successful delivery status reset for order id: ${orderId}`);

        return { status: 200, message: `Successful delivery status reset for order id: ${orderId}` };
    } catch (err) {
        console.error(`Error while trying to update database: `, err);
        throw { status: 500, message: 'Error while trying to update database', error: err };
    }
}

export async function checkExistingDelivery(id: string, isOrderId: boolean = true): Promise<boolean> {
    try {
        const column = isOrderId ? 'order_id' : 'delivery_id';
        const [rows] = await db.execute(
            `SELECT COUNT(*) as count FROM ${DELIVERIES_TABLE} WHERE ${column} = ? AND delivery_status IN (?, ?, ?)`, 
            [id, DeliveryStatus.pending, DeliveryStatus.inTransit, DeliveryStatus.delivered]
        ) as [RowDataPacket[], FieldPacket[]];

        return rows[0].count > 0;
    } catch (err) {
        console.error(`Error while trying to query database: `, err);
        throw { status: 500, message: 'Error while trying to query database', error: err };
    }
}

export async function checkDeliveryTokenRecordExists(deliveryId: string): Promise<boolean> {
    try {
        const [rows] = await db.execute(
            `SELECT * FROM ${DELIVERY_TOKENS_TABLE} WHERE delivery_id = ?`, 
            [deliveryId]
        ) as [RowDataPacket[], FieldPacket[]];

        return rows.length > 0;
    } catch (err) {
        console.error(`Error while trying to query database: `, err);
        throw { status: 500, message: 'Error while trying to query database', error: err };
    }
}