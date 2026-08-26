import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authenticateJwt } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', AuthController.login);
router.get('/me', authenticateJwt, AuthController.getMe);
router.post('/logout', authenticateJwt, AuthController.logout);

export default router;
