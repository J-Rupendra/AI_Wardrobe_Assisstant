import { Request, Response } from 'express';
import recommendationService from '../services/recommendation/RecommendationService';
import aiService from '../services/ai/AIService';

export class RecommendationController {
  async generate(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const parsed = await aiService.parseEventRequest(message);
      const recommendations = await recommendationService.generateRecommendations(userId, parsed);
      res.json({ data: recommendations, parsedRequest: parsed });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate recommendations' });
    }
  }
}

export default new RecommendationController();
