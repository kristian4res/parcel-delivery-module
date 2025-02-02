import { OrderID } from "./order";

export enum DeliveryRecordFields {
    deliveryId = "delivery_id",
    deliveryStatus = "delivery_status",
    serviceLevel = "service_level",
    expectedDeliveryDate = "expected_delivery_date",
    senderAddress = "sender_address",
    recipientAddress = "recipient_address",
    version = "version",
    createdAt = "created_at",
    updatedAt = "updated_at",
    orderId = "order_id"
}

export enum DeliveryStatus {
    cancelled = 0,
    pending = 1,
    inTransit = 2,
    delivered = 3
};

export enum ServiceLevel {
    standard = "Standard",
    express = "Express"
};

export type DeliveryRecord = {
    deliveryId: string;
    deliveryStatus: DeliveryStatus;
    serviceLevel: ServiceLevel;
    expectedDeliveryDate: string;
    senderAddress: string;
    recipientAddress: string;
    deliveredAt?: string | null;
    version?: number;
    createdAt: string;
    updatedAt: string;
    orderId: OrderID;
};

export type DeliveryDetails = {
    deliveryId: string;
    version: number;
    deliveryStatus: string;
    expectedDeliveryDate: Date;
    deliveredAt?: Date | string;
    recipientAddress: string;
    senderAddress: string;
};

export type DeliveryRequest = {
    orderId: OrderID;
    serviceLevel: ServiceLevel;
    recipientAddress: string;
};