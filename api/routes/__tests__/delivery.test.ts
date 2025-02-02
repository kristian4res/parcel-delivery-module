import request, { Response, Agent } from 'supertest';
import { BASE_URL, app, testAuthenticatedUser } from '../../test/setup';

import { DeliveryRecord, ServiceLevel } from '../../interfaces/delivery';

const TEST_DELIVERY_REQUEST = {
    "orderId": "2534567894",
    "serviceLevel": ServiceLevel.express,
    "recipientAddress": "123 Main St, Anytown, UK"
};

const isExpectedDeliveryDateCorrect = (date: Date, serviceLevel: ServiceLevel): boolean => {
    const SERVICE_LEVEL_DAYS: Record<ServiceLevel, number> = {
        [ServiceLevel.standard]: 7,
        [ServiceLevel.express]: 3,
    }
    const days: number = SERVICE_LEVEL_DAYS[serviceLevel];
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + days);
    const checkDate = new Date(date);

    return currentDate.getFullYear() === checkDate.getFullYear() &&
        currentDate.getMonth() === checkDate.getMonth() &&
        currentDate.getDate() === checkDate.getDate();
};

function isDeliveryTokenExpiryCorrect(expectedDeliveryDate: Date, tokenExpiryDate: Date): boolean {
    const deliveryDate = new Date(expectedDeliveryDate);
    const expiryDate = new Date(tokenExpiryDate);

    deliveryDate.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);
    deliveryDate.setDate(deliveryDate.getDate() + 1);

    return deliveryDate.getTime() === expiryDate.getTime();
};

const createNewTestDeliveryRecord = (agent: Agent) => {
    return agent
    .post(`${BASE_URL}/delivery/`)
    .send(TEST_DELIVERY_REQUEST);
};

const getTestDeliveryRecord = (field: string, value: string, agent: Agent) => {
    return agent
    .get(`${BASE_URL}/delivery/`)
    .query({ [field]: value })
    .send();
};

const createNewTestDeliveryToken = (deliveryId: string, agent: Agent) => {
    return agent
    .post(`${BASE_URL}/delivery/${deliveryId}/token`)
    .send();
};

const getTestDeliveryToken = (deliveryId: string, agent: Agent) => {
    return agent
    .get(`${BASE_URL}/delivery/${deliveryId}/token`)
    .send();
};


let agent = new request.agent(app);
let authenticatedUser: Agent;
beforeAll(async () => {
    authenticatedUser = await testAuthenticatedUser(agent);
});

describe('Create new delivery from order details', () => {
    it('should create a new delivery record based on the order details', async () => {
        const res = await createNewTestDeliveryRecord(authenticatedUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body.data.deliveryId.length).toBe(10);
        expect(res.body.data.deliveryStatus).toEqual("Pending");
        expect(isExpectedDeliveryDateCorrect(res.body.data.expectedDeliveryDate, ServiceLevel.express)).toBe(true);
        expect(res.body.data.recipientAddress).toEqual("123 Main St, Anytown, UK");
        expect(res.body.data.senderAddress).toEqual("Advanced Development Shoe Company, 123 High Street, Bournemouth, BH2 5QX, UK");
    });

    it('should not create a duplicate delivery record for an existing order', async () => {
        await createNewTestDeliveryRecord(authenticatedUser);

        const res = await createNewTestDeliveryRecord(authenticatedUser);

        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toEqual("Order already has a delivery that is: pending, in-transit or delivered");
    });
});

describe('Get delivery details', () => {
    let deliveryRecord: Response;

    beforeEach(async () => {
        await createNewTestDeliveryRecord(authenticatedUser);
        deliveryRecord = await getTestDeliveryRecord("orderId", TEST_DELIVERY_REQUEST["orderId"], authenticatedUser);
    });

    it('should respond with delivery details (delivery ID supplied)', async () => {
        const deliveryId = deliveryRecord.body.data.deliveryId;
        
        const res = await authenticatedUser
            .get(`${BASE_URL}/delivery/`)
            .query({ deliveryId: deliveryId})
            .send();
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.deliveryId.length).toBe(10);
        expect(res.body.data.deliveryStatus).toEqual("Pending");
        expect(isExpectedDeliveryDateCorrect(res.body.data.expectedDeliveryDate, ServiceLevel.express)).toBe(true);
        expect(res.body.data.recipientAddress).toEqual("123 Main St, Anytown, UK");
        expect(res.body.data.senderAddress).toEqual("Advanced Development Shoe Company, 123 High Street, Bournemouth, BH2 5QX, UK");
    });
    
    it('should respond with delivery details (order ID supplied)', async () => {
        const res = await authenticatedUser
            .get(`${BASE_URL}/delivery/`)
            .query({ orderId: TEST_DELIVERY_REQUEST["orderId"] })
            .send();

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.deliveryId.length).toBe(10);
        expect(res.body.data.deliveryStatus).toEqual("Pending");
        expect(isExpectedDeliveryDateCorrect(res.body.data.expectedDeliveryDate, ServiceLevel.express)).toBe(true);
        expect(res.body.data.recipientAddress).toEqual("123 Main St, Anytown, UK");
        expect(res.body.data.senderAddress).toEqual("Advanced Development Shoe Company, 123 High Street, Bournemouth, BH2 5QX, UK");
    });

    it('should respond with delivery not found (order ID supplied)', async () => {
        const res = await authenticatedUser
            .get(`${BASE_URL}/delivery/`)
            .query({ orderId: "example-order-id" })
            .send();

        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual("Delivery not found");
    });
});

describe('Cancel a delivery by order ID', () => {
    beforeAll(async () => {
        await createNewTestDeliveryRecord(authenticatedUser);
    });

    it('should cancel a delivery', async () => {
        const res = await authenticatedUser
            .patch(`${BASE_URL}/delivery/${TEST_DELIVERY_REQUEST["orderId"]}/cancel`)
            .send();
        const fetchDeliveryRecord = await getTestDeliveryRecord("orderId", TEST_DELIVERY_REQUEST["orderId"], authenticatedUser);

        expect(res.statusCode).toEqual(200);
        expect(fetchDeliveryRecord.statusCode).toEqual(200);
    });
});

describe('Generate delivery token by delivery ID', () => {
    let deliveryRecordRes: Response;
    let deliveryTokenRes: Response;

    beforeEach(async () => {
        await createNewTestDeliveryRecord(authenticatedUser);
        deliveryRecordRes = await getTestDeliveryRecord("orderId", TEST_DELIVERY_REQUEST["orderId"], authenticatedUser);
    });

    it('should create a delivery token for a specified delivery', async () => {
        const { deliveryId, expectedDeliveryDate } = deliveryRecordRes.body.data;

        deliveryTokenRes = await createNewTestDeliveryToken(deliveryId, authenticatedUser);
        
        expect(deliveryTokenRes.statusCode).toEqual(201);
        expect(isDeliveryTokenExpiryCorrect(expectedDeliveryDate, deliveryTokenRes.body.data.deliveryTokenExpiry)).toBe(true);
    });

    it('should not create a delivery token if specified delivery already has a token', async () => {
        const { deliveryId } = deliveryRecordRes.body.data;
        await createNewTestDeliveryToken(deliveryId, authenticatedUser);

        const res = await createNewTestDeliveryToken(deliveryId, authenticatedUser);

        expect(res.statusCode).toEqual(409);
        expect(res.body.message).toEqual(`Cannot create a new delivery token for delivery '${deliveryId}' as it already has a token active`);
    });
});

describe('Get delivery token by delivery ID', () => {
    let deliveryRecordRes: Response;
    let deliveryTokenRes: Response;

    beforeAll(async () => {
        await createNewTestDeliveryRecord(authenticatedUser);
        deliveryRecordRes = await getTestDeliveryRecord("orderId", TEST_DELIVERY_REQUEST["orderId"], authenticatedUser);
        const { deliveryId } = deliveryRecordRes.body.data;
        deliveryTokenRes = await createNewTestDeliveryToken(deliveryId, authenticatedUser);
    });

    it('should get the delivery token for a specified delivery', async () => {
        const { deliveryId, expectedDeliveryDate } = deliveryRecordRes.body.data;
        const { deliveryToken: expectedDeliveryToken } = deliveryTokenRes.body.data;

        const res = await getTestDeliveryToken(deliveryId, authenticatedUser);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.deliveryToken).toEqual(expectedDeliveryToken);
        expect(isDeliveryTokenExpiryCorrect(expectedDeliveryDate, res.body.data.deliveryTokenExpiry)).toBe(true);
    });
});

describe('Revoke delivery token by delivery ID', () => {
    let deliveryRecord: Response;

    beforeAll(async () => {
        await createNewTestDeliveryRecord(authenticatedUser);
        deliveryRecord = await getTestDeliveryRecord("orderId", TEST_DELIVERY_REQUEST["orderId"], authenticatedUser);
    });

    // TODO: Admin only route
    it('should revoke the delivery token for a specified delivery', async () => {
        const { deliveryId } = deliveryRecord.body.data;
        await createNewTestDeliveryToken(deliveryId, authenticatedUser);

        const res = await authenticatedUser
            .patch(`${BASE_URL}/delivery/admin/${deliveryId}/revoke`)
            .send();
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual(`Delivery token has been revoked for ${deliveryId}`);
    });
});

describe('Update delivery details', () => {
    let deliveryRecordRes: Response;
    let deliveryTokenRes: Response;
    let deliveryToken: string;

    beforeEach(async () => {
        await createNewTestDeliveryRecord(authenticatedUser);
        deliveryRecordRes = await getTestDeliveryRecord("orderId", TEST_DELIVERY_REQUEST["orderId"], authenticatedUser);
        const { deliveryId } = deliveryRecordRes.body.data;
        await createNewTestDeliveryToken(deliveryId, authenticatedUser);
        deliveryTokenRes = await getTestDeliveryToken(deliveryRecordRes.body.data.deliveryId, authenticatedUser);
        deliveryToken = deliveryTokenRes.body.data.deliveryToken;
    });

    it('should update the delivery status of specified delivery using a valid delivery token', async () => {
        const res = await authenticatedUser
            .patch(`${BASE_URL}/delivery/${deliveryToken}/scan`)
            .send();

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual(`Successfully updated the delivery status`);
        
        const updatedDeliveryRecordRes = await getTestDeliveryRecord("orderId", TEST_DELIVERY_REQUEST["orderId"], authenticatedUser);
        expect(updatedDeliveryRecordRes.body.data.version).toEqual(2);
        expect(updatedDeliveryRecordRes.body.data.deliveryStatus).toEqual("In Transit");
    });

    it('should update the details of specified delivery', async () => {
        const { deliveryId } = deliveryRecordRes.body.data;
        const updatedRecord: Partial<DeliveryRecord> = {
            serviceLevel: ServiceLevel.standard
        }
        
        const res = await authenticatedUser
            .patch(`${BASE_URL}/delivery/admin/${deliveryId}/update`)
            .send(updatedRecord);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual(`Successfully updated delivery record for delivery id: ${deliveryId}`)
    });

    it('should not update the details of specified delivery that does not exist', async () => {
        const deliveryId = 'fake-delivery-id';
        const updatedRecord: Partial<DeliveryRecord> = {
            serviceLevel: ServiceLevel.standard
        }
        
        const res = await authenticatedUser
            .patch(`${BASE_URL}/delivery/admin/${deliveryId}/update`)
            .send(updatedRecord);

        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Delivery not found');
    });

    it('should not update the details of specified delivery without a valid updated record', async () => {
        const { deliveryId } = deliveryRecordRes.body.data;
        const updatedRecord = {}
        
        const res = await authenticatedUser
            .patch(`${BASE_URL}/delivery/admin/${deliveryId}/update`)
            .send(updatedRecord);
        
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Invalid deliveryId or updatedRecord');
    });
});