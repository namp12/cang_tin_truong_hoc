import { Router } from 'express';
import { OrdersController } from './orders.controller.js';

const router = Router();

router.get('/', OrdersController.getAllOrders);
router.post('/', OrdersController.createOrder);
router.patch('/:id/status', OrdersController.updateOrderStatus);

export default router;
