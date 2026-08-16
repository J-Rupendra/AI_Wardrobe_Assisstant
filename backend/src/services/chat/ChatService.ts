import { ChatMessage, IChatMessage } from '../../models/ChatMessage';

export class ChatService {
  async saveMessage(userId: string, role: 'user' | 'assistant', content: string, eventDetails?: any): Promise<IChatMessage> {
    const message = await ChatMessage.create({
      userId,
      role,
      content,
      eventDetails,
    });
    return message;
  }

  async getConversation(userId: string, limit: number = 50): Promise<IChatMessage[]> {
    return await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async clearConversation(userId: string): Promise<void> {
    await ChatMessage.deleteMany({ userId });
  }
}

export default new ChatService();
