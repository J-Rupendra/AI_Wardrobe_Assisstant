import { RecommendationHistory } from '../../models/RecommendationHistory';

export class RecommendationHistoryService {
  async recordRecommendation(userId: string, recommendation: any, requestText: string, parsedRequest: any): Promise<void> {
    await RecommendationHistory.create({
      userId,
      requestText,
      parsedRequest,
      recommendationId: recommendation.id,
      recommendationScore: recommendation.score,
      itemIds: recommendation.items.map((item: any) => item._id || item.id),
      explanation: recommendation.explanation,
      shownAt: new Date(),
      viewed: true,
    });
  }

  async getHistory(userId: string): Promise<any[]> {
    return RecommendationHistory.find({ userId }).sort({ shownAt: -1 }).lean();
  }
}

export default new RecommendationHistoryService();
