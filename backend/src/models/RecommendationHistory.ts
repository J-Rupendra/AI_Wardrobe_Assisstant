import { Schema, model } from 'mongoose';

export interface IRecommendationHistory {
  _id: string;
  userId: string;
  requestText: string;
  parsedRequest: {
    eventType?: string;
    mood?: string;
    style?: string;
    colors?: string[];
    occasion?: string;
    notes?: string;
  };
  recommendationId: string;
  recommendationScore: number;
  itemIds: string[];
  explanation: string;
  shownAt: Date;
  viewed: boolean;
}

const recommendationHistorySchema = new Schema<IRecommendationHistory>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    requestText: {
      type: String,
      required: true,
    },
    parsedRequest: {
      eventType: String,
      mood: String,
      style: String,
      colors: [String],
      occasion: String,
      notes: String,
    },
    recommendationId: {
      type: String,
      required: true,
    },
    recommendationScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    itemIds: [{ type: String, required: true }],
    explanation: {
      type: String,
      required: true,
    },
    shownAt: {
      type: Date,
      default: Date.now,
    },
    viewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

recommendationHistorySchema.index({ userId: 1, shownAt: -1 });

export const RecommendationHistory = model<IRecommendationHistory>('RecommendationHistory', recommendationHistorySchema);
