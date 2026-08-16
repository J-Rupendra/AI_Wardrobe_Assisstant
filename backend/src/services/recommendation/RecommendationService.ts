import { WardrobeItem } from '../../models/WardrobeItem';
import { EventRequest } from '../ai/AIProvider';
import { AIService } from '../ai/AIService';
import { generateCandidates } from './RankingEngine';

export class RecommendationService {
  private readonly aiService: AIService;

  constructor(aiService: AIService = new AIService()) {
    this.aiService = aiService;
  }

  async generateRecommendations(userId: string, request: EventRequest) {
    const items = await WardrobeItem.find({ userId, active: true }).sort({ createdAt: -1 });
    const candidates = generateCandidates(items, request);

    const ranked = await Promise.all(
      candidates.map(async (candidate) => {
        const explanation = await this.aiService.explainRecommendation(candidate.items);
        return {
          id: `rec_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
          items: candidate.items,
          score: Math.round(candidate.score),
          reasons: candidate.reasons,
          explanation,
          generatedAt: new Date().toISOString(),
        };
      })
    );

    return ranked.sort((a, b) => b.score - a.score);
  }
}

export default new RecommendationService();
