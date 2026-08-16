import React, { useEffect, useState } from 'react';
import chatApi, { ChatMessage } from '../services/chatApi';
import { ChatMessageComponent } from '../components/chat/ChatMessage';
import { Button } from '../components/common/Button';
import styles from './ChatPage.module.css';

export const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const res = await chatApi.getMessages(20);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    try {
      const res = await chatApi.sendMessage(userMessage, { eventType: 'general' });
      setMessages((prev) => [...prev, res.data]);

      const assistantReply: ChatMessage = {
        _id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `I received: "${userMessage}". AI recommendation flow is ready for the next phase.`,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantReply]);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>AI Wardrobe Assistant</h1>
        <Button variant="secondary" onClick={() => chatApi.clearChat()}>
          Clear chat
        </Button>
      </div>

      <div className={styles.chatWindow}>
        {messages.length === 0 ? (
          <div className={styles.empty}>Start a conversation about your wardrobe.</div>
        ) : (
          messages.map((message) => <ChatMessageComponent key={message._id} message={message} />)
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.inputBar}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your event and wardrobe needs..."
          disabled={loading}
        />
        <Button type="submit" isLoading={loading} variant="primary">
          Send
        </Button>
      </form>
    </div>
  );
};
