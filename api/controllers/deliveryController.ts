// Description: This file will contain logic for the user router.
import { Request, Response } from "express";
import { catchError } from "./errorController";
import { customAlphabet } from 'nanoid';
import { DeliveryDetails, DeliveryRecord, DeliveryRecordFields, DeliveryRequest, DeliveryStatus, ServiceLevel } from "../interfaces/delivery";
import { formatDateInMySQL } from "../helpers/functions";
import tokenGenerator from "../helpers/tokenGenerator";
import { checkDeliveryTokenRecordExists, checkExistingDelivery, getDeliveryRecordWhere, getDeliveryRecords, getDeliveryRecordsForOrderIds, incrementDeliveryStatus, insertDelivery, insertDeliveryToken, resetDeliveryStatus, setDeliveryTokenLinkToNull, updateDeliveryRecord, validateDeliveryToken, getDeliveryTokenRecordWhere } from "../database/delivery";
import { QueryResult } from "../interfaces/sql";
import { DeliveryTokenRecord } from "../interfaces/deliveryToken";


// Business logic
const determineExpectedDeliveryDate = (serviceLevel: ServiceLevel): Date => {
    const STANDARD_SEVICE_DAYS = 7
    const EXPRESS_SERVICE_DAYS = 3

    const currentDate = new Date();
    switch(serviceLevel) {
        case ServiceLevel.standard:
            currentDate.setDate(currentDate.getDate() + STANDARD_SEVICE_DAYS);
            break;
        case ServiceLevel.express:
            currentDate.setDate(currentDate.getDate() + EXPRESS_SERVICE_DAYS);
            break;
    }
    return currentDate;
};

const determineDeliveryTokenExpiry = (expectedDeliveryDate: Date): Date => {
    const EXPIRY_DATE_INCREMENT = 1; 

    const tokenExpiry = new Date(expectedDeliveryDate.getTime());
    tokenExpiry.setDate(tokenExpiry.getDate() + EXPIRY_DATE_INCREMENT);
    return tokenExpiry;
};

const getSenderAddress = () => {
    /* NOTE: Placeholder for the company warehouse address that deals with returns. */
    const COMPANY_NAME = "Advanced Development Shoe Company";
    
    return `${COMPANY_NAME}, 123 High Street, Bournemouth, BH2 5QX, UK`;
};

const determineDeliveryStatus = (deliveryStatus: DeliveryStatus) => {
    const DELIVERY_STATUS_MAP = {
        [DeliveryStatus.cancelled]: 'Cancelled',
        [DeliveryStatus.pending]: 'Pending',
        [DeliveryStatus.inTransit]: 'In Transit',
        [DeliveryStatus.delivered]: 'Delivered'
    }

    return DELIVERY_STATUS_MAP[deliveryStatus];
};

// Controllers
// TODO: Create custom error objects

// External use endpoints
export const fetchDeliveryDetails = catchError(async (req: Request, res: Response) => {
    const orderId = req.query.orderId as string;
    const deliveryId = req.query.deliveryId as string;

    if (!orderId && !deliveryId) {
        res.status(400).json({ message: 'Invalid request. Provide either orderId or deliveryId.' });
        return;
    }

    let result = { data: null, status: 400, message: 'No record found', error: null } as unknown as QueryResult<DeliveryRecord>;
    if (orderId) {
        result = await getDeliveryRecordWhere({field: 'order_id', value: orderId});
    } else if (deliveryId) {
        result = await getDeliveryRecordWhere({field: 'delivery_id', value: deliveryId});
    }

    if (!result.data) {
        res.status(result.status).json({ message: result.message, error: result.error });
        return;
    }

    const deliveryDetails: DeliveryDetails = {
        deliveryId: result.data.deliveryId,
        version: result.data.version || 0,
        deliveryStatus: determineDeliveryStatus(result.data.deliveryStatus),
        expectedDeliveryDate: new Date(result.data.expectedDeliveryDate),
        deliveredAt: result.data.deliveredAt ? new Date(result.data.deliveredAt) : "Awaiting to be delivered",
        recipientAddress: result.data.recipientAddress,
        senderAddress: result.data.senderAddress,
    };

    res.status(200).json({ message: `Successfully fetched delivery details for ${orderId || deliveryId}`, data: deliveryDetails});
});

export const fetchMultipleDeliveryDetails = catchError(async (req: Request, res: Response) => {
    const orderIds: string[] = req.query.orderIds ? (req.query.orderIds as string).split(',') : [];
    const page = req.query.page ? Number(req.query.page) : 1;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 20;

    if ((page !== undefined && isNaN(page)) || (pageSize !== undefined && isNaN(pageSize))) {
        res.status(400).json({ message: 'Invalid page or pageSize parameter' });
        return;
    }

    if (!orderIds.length || orderIds.length == 0) {
        res.status(400).json({ message: 'Order IDs are required' });
        return;
    }

    const result = await getDeliveryRecordsForOrderIds(orderIds, page, pageSize);
    if (!result.data) {
        res.status(result.status).json({ message: result.message, error: result.error });
        return;
    }

    const deliveryDetails: DeliveryDetails[] = result.data.map(record => ({
        deliveryId: record.deliveryId,
        version: record.version || 0,
        deliveryStatus: determineDeliveryStatus(record.deliveryStatus),
        expectedDeliveryDate: new Date(record.expectedDeliveryDate),
        deliveredAt: record.deliveredAt ? new Date(record.deliveredAt) : "Awaiting to be delivered",
        recipientAddress: record.recipientAddress,
        senderAddress: record.senderAddress,
    }));

    res.json(deliveryDetails);
});

export const cancelDelivery = catchError(async (req: Request, res: Response) => {
    const orderId = req.params.orderId as string;

    if (!orderId) {
        res.status(400).json({ message: 'Invalid order ID, please send a valid order ID' });
        return;
    }

    const result = await resetDeliveryStatus(orderId);
    if (result.status !== 200) {
        res.status(result.status).json({ message: result.message, error: result.error });
        return;
    }

    res.status(200).json({ message: `Successfully cancelled delivery for order ID: ${orderId}` });
});

export const createNewDelivery = catchError(async (req: Request, res: Response) => {
    // Unpack request
    const { orderId, serviceLevel, recipientAddress }: DeliveryRequest = req.body;

    // Check if order already has a delivery pending, in-transit or delivered
    if (await checkExistingDelivery(orderId)) {
        res.status(403).send({
            message: "Order already has a delivery that is: pending, in-transit or delivered"
        });
        return;
    } 

    // Construct delivery record
    const deliveryId = customAlphabet('1234567890abcdef', 10)(); 
    const deliveryStatus = DeliveryStatus.pending;
    const createdAt = formatDateInMySQL(new Date());
    const expectedDeliveryDate = determineExpectedDeliveryDate(serviceLevel);
    const senderAddress = getSenderAddress();

    const newDelivery: DeliveryRecord = {
        deliveryId,
        deliveryStatus,
        serviceLevel,
        expectedDeliveryDate: formatDateInMySQL(expectedDeliveryDate),
        senderAddress,
        recipientAddress,
        createdAt,
        updatedAt: createdAt,
        orderId,
    };

    // Commit delivery record
    await insertDelivery(newDelivery);
    
    // Return delivery confirmation and details
    const deliveryDetails: DeliveryDetails = {
        deliveryId: deliveryId,
        version: 1,
        deliveryStatus: determineDeliveryStatus(deliveryStatus),
        expectedDeliveryDate: expectedDeliveryDate,
        recipientAddress: recipientAddress,
        senderAddress: senderAddress
    }

    res.status(201).json({ message: `Successfully created a delivery for order ID: ${orderId}`, data: deliveryDetails});
});

// Internal use endpoints
export const fetchDeliveryList = catchError(async (req: Request, res: Response) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 20;

    if ((page !== undefined && isNaN(page)) || (pageSize !== undefined && isNaN(pageSize))) {
        res.status(400).json({ message: 'Invalid page or page size parameter' });
        return;
    }

    const result = await getDeliveryRecords(page, pageSize);
    res.status(200).json(result);
});

export const fetchDeliveryById = catchError(async (req: Request, res: Response) => {
    const deliveryId = req.params.deliveryId as string;

    if (!deliveryId) {
        res.status(400).json({ message: 'Invalid delivery ID parameter' });
        return;
    }

    const result = await getDeliveryRecordWhere({field: 'delivery_id', value: deliveryId});
    if (!result.data) {
        res.status(result.status).json({ message: result.message, error: result.error });
        return;
    }

    res.status(200).json(result);
});

export const fetchDeliveryTokenById = catchError(async (req: Request, res: Response) => {
    const deliveryId = req.params.deliveryId as string;

    if (!deliveryId) {
        res.status(400).json({ message: 'Invalid delivery ID parameter' });
        return;
    }

    const result = await getDeliveryTokenRecordWhere({field: 'delivery_id', value: deliveryId});
    if (!result.data) {
        res.status(result.status).json({ message: result.message, error: result.error });
        return;
    }

    res.status(200).json(result);
});

export const updateDeliveryRecordById = catchError(async (req: Request, res: Response) => {
    const deliveryId = req.params.deliveryId as string;
    let updatedRecord = req.body;

    if (!deliveryId || !updatedRecord || Object.keys(updatedRecord).length === 0) {
        res.status(400).json({ message: 'Invalid deliveryId or updatedRecord' });
        return;
    }

    // Check if delivery exists
    const deliveryRecordQuery = await getDeliveryRecordWhere({field: DeliveryRecordFields.deliveryId, value: deliveryId })
    if (!deliveryRecordQuery.data) {
        res.status(deliveryRecordQuery.status).json({ message: deliveryRecordQuery.message, error: deliveryRecordQuery.error })
        return;
    }

    // Convert the updatedRecord keys to snake case (mysql)
    updatedRecord = Object.fromEntries(
        Object.entries(updatedRecord).map(([key, value]) => [DeliveryRecordFields[key as keyof typeof DeliveryRecordFields], value])
    );

    const result = await updateDeliveryRecord(deliveryId, updatedRecord);
    if (result.status !== 200) {
        res.status(result.status).json({ message: result.message, error: result.error });
        return;
    }

    res.status(200).json({ message: `Successfully updated delivery record for delivery id: ${deliveryId}` });
});

export const generateDeliveryToken = catchError(async (req: Request, res: Response) => {
    // Extract delivery ID
    const deliveryId = req.params.deliveryId;

    // Check if delivery already has an existing token
    if (await checkDeliveryTokenRecordExists(deliveryId)) {
        res.status(409).json({ message: `Cannot create a new delivery token for delivery '${deliveryId}' as it already has a token active` })
        return;
    }

    // Check if delivery exists
    const deliveryRecordQuery = await getDeliveryRecordWhere({field: DeliveryRecordFields.deliveryId, value: deliveryId })
    if (!deliveryRecordQuery.data) {
        res.status(deliveryRecordQuery.status).json({ message: deliveryRecordQuery.message, error: deliveryRecordQuery.error })
        return;
    }
    const { expectedDeliveryDate } = deliveryRecordQuery.data

    // Generate delivery token for updating delivey status
    const deliveryTokenId = `${deliveryId}-${Date.now()}`
    const deliveryTokenExpiry = determineDeliveryTokenExpiry(new Date(expectedDeliveryDate));
    const deliveryToken = tokenGenerator.generateToken();

    // Commit delivery token record
    await insertDeliveryToken(deliveryTokenId, deliveryToken, deliveryTokenExpiry, deliveryId);

    const deliveryTokenDetails: DeliveryTokenRecord = {
        deliveryTokenId, 
        deliveryToken,
        deliveryTokenExpiry: deliveryTokenExpiry.toISOString(),
    } 

    res.status(201).json({ message: `Successfully generated a delivery token for '${deliveryId}'`,
        data: deliveryTokenDetails
    });
});

export const revokeDeliveryToken = catchError(async (req: Request, res: Response) => {
    // Extract delivery ID
    const deliveryId = req.params.deliveryId;

    // Identify delivery token and invalidate
    const result = await setDeliveryTokenLinkToNull(deliveryId);

    res.status(result.status).json({ message: result.message });
});

export const updateDeliveryStatus = catchError(async (req: Request, res: Response) => {
    // Extract token
    const deliveryToken: string = req.params.token;

    // Validate delivery token
    const deliveryTokenQuery = await validateDeliveryToken(deliveryToken);
    if (!deliveryTokenQuery.data) {
        res.status(deliveryTokenQuery.status).json({ message: deliveryTokenQuery.message, error: deliveryTokenQuery.error })
        return;
    }
    const { deliveryId } = deliveryTokenQuery.data;

    // Get delivery status
    const deliveryRecordQuery = await getDeliveryRecordWhere({field: 'delivery_id', value: deliveryId});
    if (!deliveryRecordQuery.data) {
        res.status(deliveryRecordQuery.status).json({ message: deliveryRecordQuery.message, error: deliveryRecordQuery.error })
        return;
    }
    const currentDeliveryStatus = deliveryRecordQuery.data.deliveryStatus;

    // Get current delivery item status
    if (+currentDeliveryStatus === 0) {
        console.log('0 status')
        res.status(410).json({ message: 'Cannot update a delivery that has already been cancelled' })
        return;
    }
    if (+currentDeliveryStatus === 3) {
        console.log('3 status')
        res.status(410).json({ message: 'Delivery has already been fulfilled' })
        return
    }
    // Update delivery record
    await incrementDeliveryStatus(deliveryId);

    if (currentDeliveryStatus + 1 === 3) {
        await setDeliveryTokenLinkToNull(deliveryId);
    }

    res.status(200).json({ message: `Successfully updated the delivery status` })
});