import { Request, Response } from 'express';
import recommendationHistoryService from '../services/recommendation/RecommendationHistoryService';

export class RecommendationHistoryController {
  async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const history = await recommendationHistoryService.getHistory(userId);
      res.json({ data: history });
    } catch (error) {
      res.status(500).json({ error: 'Failed to load recommendation history' });
    }
  }
}

export default new RecommendationHistoryController();
