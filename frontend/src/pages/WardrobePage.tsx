import React, { useEffect, useState } from 'react';
import wardrobeApi, { WardrobeItem } from '../services/wardrobeApi';
import { WardrobeCard } from '../components/wardrobe/WardrobeCard';
import { WardrobeForm } from '../components/wardrobe/WardrobeForm';
import { Button } from '../components/common/Button';
import styles from './WardrobePage.module.css';

export const WardrobePage: React.FC = () => {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    loadItems();
  }, [category]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await wardrobeApi.getItems({ category: category || undefined, active: true });
      setItems(res.data);
    } catch (err) {
      console.error('Failed to load items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await wardrobeApi.deleteItem(id);
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const handleItemAdded = (item: WardrobeItem) => {
    setItems([item, ...items]);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>My Wardrobe</h1>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Item'}
        </Button>
      </div>

      {showForm && <WardrobeForm onItemAdded={handleItemAdded} onCancel={() => setShowForm(false)} />}

      <div className={styles.filterSection}>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="frock">Frock</option>
          <option value="top">Top</option>
          <option value="shirt">Shirt</option>
          <option value="pant">Pant</option>
          <option value="earring">Earring</option>
          <option value="chain">Chain</option>
          <option value="necklace">Necklace</option>
          <option value="bracelet">Bracelet</option>
          <option value="sandal">Sandal</option>
          <option value="heel">Heel</option>
          <option value="flat">Flat</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No items found. Add your first wardrobe item!</p>
        </div>
      ) : (
        <div className={styles.itemsGrid}>
          {items.map((item) => (
            <WardrobeCard key={item._id} item={item} onDelete={handleDeleteItem} />
          ))}
        </div>
      )}
    </div>
  );
};
