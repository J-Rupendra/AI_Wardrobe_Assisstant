export interface RecommendationItem {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  colors: string[];
  image?: {
    url: string;
    publicId?: string;
  };
}

export interface Recommendation {
  id: string;
  score: number;
  explanation: string;
  reasons: string[];
  generatedAt: string;
  items: RecommendationItem[];
}

export interface RecommendationHistoryEntry {
  _id: string;
  recommendationId: string;
  recommendationScore: number;
  requestText: string;
  explanation: string;
  shownAt: string;
  itemIds: string[];
}
