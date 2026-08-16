import { Request, Response } from 'express';
import chatService from '../services/chat/ChatService';

export class ChatController {
  async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const messages = await chatService.getConversation(userId, limit);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }

  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { content, eventDetails } = req.body;

      if (!content) {
        res.status(400).json({ error: 'Message content is required' });
        return;
      }

      const message = await chatService.saveMessage(userId, 'user', content, eventDetails);
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save message' });
    }
  }

  async clearChat(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      await chatService.clearConversation(userId);
      res.json({ message: 'Chat cleared successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to clear chat' });
    }
  }
}

export default new ChatController();
