import { Router } from 'express';
import { InventoryController } from './inventory.controller.js';

const router = Router();

router.get('/stocks', InventoryController.getStocks);
router.get('/kitchen-requisitions', InventoryController.getKitchenRequisitions);
router.post('/kitchen-requisitions', InventoryController.createKitchenRequisition);
router.put('/kitchen-requisitions/:id/approve', InventoryController.approveRequisition);
router.get('/inbound', InventoryController.getInboundReceipts);
router.get('/outbound', InventoryController.getOutboundIssues);

export default router;
