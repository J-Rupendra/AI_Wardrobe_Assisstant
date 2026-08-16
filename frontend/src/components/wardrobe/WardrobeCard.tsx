import React from 'react';
import { WardrobeItem } from '../../services/wardrobeApi';
import { Button } from '../common/Button';
import styles from './WardrobeCard.module.css';

export const WardrobeCard: React.FC<{ item: WardrobeItem; onDelete: (id: string) => void }> = ({ item, onDelete }) => {
  return (
    <div className={styles.card}>
      <img src={item.image.url} alt={item.name} className={styles.image} />
      <div className={styles.content}>
        <h3>{item.name}</h3>
        <p className={styles.category}>{item.category}</p>
        <div className={styles.colors}>
          {item.colors.map((color) => (
            <span key={color} className={styles.colorTag}>
              {color}
            </span>
          ))}
        </div>
        <div className={styles.tags}>
          {item.styleTags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <Button
          variant="danger"
          onClick={() => onDelete(item._id)}
          style={{ marginTop: '10px' }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
