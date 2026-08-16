import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import chatController from '../controllers/chatController';

const router = Router();

// GET /api/chat - Get chat messages
router.get('/', authMiddleware, (req, res) => chatController.getMessages(req, res));

// POST /api/chat - Send message
router.post('/', authMiddleware, (req, res) => chatController.sendMessage(req, res));

// DELETE /api/chat - Clear chat
router.delete('/', authMiddleware, (req, res) => chatController.clearChat(req, res));

export default router;
