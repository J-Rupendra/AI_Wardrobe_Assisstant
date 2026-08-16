import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import recommendationController from '../controllers/recommendationController';

const router = Router();

router.post('/', authMiddleware, (req, res) => recommendationController.generate(req, res));

export default router;
