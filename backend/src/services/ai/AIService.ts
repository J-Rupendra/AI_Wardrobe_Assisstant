import { AIProvider, EventRequest, createAIProvider } from './AIProvider';

export class AIService {
  private readonly aiProvider: AIProvider;

  constructor(aiProvider: AIProvider = createAIProvider()) {
    this.aiProvider = aiProvider;
  }

  async parseEventRequest(message: string): Promise<EventRequest> {
    return this.aiProvider.parseEventRequest(message);
  }

  async explainRecommendation(outfit: any[]): Promise<string> {
    return this.aiProvider.explainRecommendation(outfit);
  }
}

export default new AIService();
