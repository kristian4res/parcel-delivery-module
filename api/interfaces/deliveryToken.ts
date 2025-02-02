export enum DeliveryTokenRecordFields {
    deliveryTokenId = "delivery_token_id",
    deliveryToken = "delivery_token",
    deliveryTokenExpiry = "delivery_token_expiry",
    deliveryId = "delivery_id",
}

export type DeliveryTokenRecord = {
    deliveryTokenId: string;
    deliveryToken: string;
    deliveryTokenExpiry: string;
    deliveryId?: string;
}