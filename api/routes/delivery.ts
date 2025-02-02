import { Router } from "express";
import { createNewDelivery, updateDeliveryStatus, generateDeliveryToken, revokeDeliveryToken, fetchDeliveryList, fetchDeliveryById, fetchDeliveryDetails, cancelDelivery, updateDeliveryRecordById, fetchDeliveryTokenById } from "../controllers/deliveryController";
import { body, oneOf, param, query } from 'express-validator';
import { validateRequest } from "../controllers/errorController";
import { requireAuth } from "../controllers/authController";

const router: Router = Router();

/** NB: Before integrating this with other services in a production setting, it should have a zero-trust security approach by protecting these endpoints a layer of authentication, 
 * ideally use one that is standard across the company, i.e. used by other company services.  */
router.use(requireAuth);

/** Endpoints to be used by external services */
router.route('/')
    .get(
        oneOf([
            query('orderId').notEmpty().withMessage('Invalid Order ID'),
            query('deliveryId').notEmpty().withMessage('Invalid Delivery ID')
        ]),
        validateRequest,
        fetchDeliveryDetails
    )
    .post(
        body('orderId').notEmpty().withMessage('Please provide the order ID'),
        body('serviceLevel').notEmpty().withMessage('Please provide the delivery service level'),
        body('recipientAddress').notEmpty().withMessage('Please provide the recipient address'),
        validateRequest,
        createNewDelivery
);
router.patch(
    '/:orderId/cancel',
    validateRequest,
    cancelDelivery
);


/** Endpoints for internal use */
router.route('/:deliveryId/token')
    .get(
        param('deliveryId').notEmpty().withMessage('Invalid Delivery ID'), 
        validateRequest,
        fetchDeliveryTokenById,
    )
    .post( 
        param('deliveryId').notEmpty().withMessage('Invalid Delivery ID'), 
        validateRequest, 
        generateDeliveryToken
);
router.patch('/:token/scan', 
    param('token').notEmpty().withMessage('Invalid Delivery Token'), 
    validateRequest, 
    updateDeliveryStatus
);

/** Admin endpoints 
 * These endpoints and actions are meant for those with high authorization 
 * and so this authorization needs to be verified before allowing the action
 *  (assuming the user is authenticated).
*/
router.route('/admin/all').get(
    /* isAdmin, */ 
    fetchDeliveryList
);   
router.patch(
    '/admin/:deliveryId/revoke',
    /* isAdmin, */ 
    param('deliveryId').notEmpty().withMessage('Invalid Delivery ID'), 
    validateRequest, 
    revokeDeliveryToken
);
router.patch(
    '/admin/:deliveryId/update',
    /* isAdmin, */
    param('deliveryId').notEmpty().withMessage('Invalid Delivery ID'), 
    body().notEmpty().withMessage('Please send the updated record'),
    validateRequest,
    updateDeliveryRecordById
);

export { router as deliveryRouter };
