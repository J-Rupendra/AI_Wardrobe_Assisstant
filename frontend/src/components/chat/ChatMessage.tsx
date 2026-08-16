import React from 'react';
import { ChatMessage } from '../../services/chatApi';
import styles from './ChatMessage.module.css';

interface ChatMessageProps {
  message: ChatMessage;
}

export const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`${styles.messageContainer} ${isUser ? styles.user : styles.assistant}`}>
      <div className={styles.message}>
        {message.content}
      </div>
      <span className={styles.timestamp}>
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};
