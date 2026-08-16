import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import recommendationHistoryController from '../controllers/recommendationHistoryController';

const router = Router();

router.get('/', authMiddleware, (req, res) => recommendationHistoryController.getHistory(req, res));

export default router;
