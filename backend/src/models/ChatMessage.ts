import { Schema, model } from 'mongoose';

export interface IChatMessage {
  _id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  eventDetails?: {
    eventType: string;
    eventDate: string;
    eventVenue?: string;
    mood?: string;
  };
  createdAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    eventDetails: {
      eventType: String,
      eventDate: String,
      eventVenue: String,
      mood: String,
    },
  },
  { timestamps: true }
);

chatMessageSchema.index({ userId: 1, createdAt: -1 });

export const ChatMessage = model<IChatMessage>('ChatMessage', chatMessageSchema);
