import React, { useState } from 'react';
import wardrobeApi, { WardrobeItem } from '../../services/wardrobeApi';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { ErrorMessage } from '../common/ErrorMessage';
import styles from '../../pages/WardrobePage.module.css';

export const WardrobeForm: React.FC<{ onItemAdded: (item: WardrobeItem) => void; onCancel: () => void }> = ({ onItemAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    category: 'top',
    name: '',
    colors: '',
    material: '',
    styleTags: '',
    occasionTags: '',
    formality: 3,
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const form = new FormData();
      form.append('category', formData.category);
      form.append('name', formData.name);
      form.append('colors', JSON.stringify(formData.colors.split(',')));
      form.append('styleTags', JSON.stringify(formData.styleTags.split(',')));
      form.append('occasionTags', JSON.stringify(formData.occasionTags.split(',')));
      form.append('formality', String(formData.formality));
      if (formData.material) form.append('material', formData.material);
      if (image) form.append('image', image);
      console.log('FormData entries:', Array.from(form.entries()));

      const res = await wardrobeApi.createItem(form);
      onItemAdded(res.data);
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Add Wardrobe Item</h2>
      {error && <ErrorMessage message={error} />}
      
      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      >
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

      <Input
        label="Name"
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <Input
        label="Colors (comma-separated)"
        type="text"
        value={formData.colors}
        onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
        required
      />

      <Input
        label="Material"
        type="text"
        value={formData.material}
        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
      />

      <Input
        label="Style Tags (comma-separated)"
        type="text"
        value={formData.styleTags}
        onChange={(e) => setFormData({ ...formData, styleTags: e.target.value })}
      />

      <Input
        label="Occasion Tags (comma-separated)"
        type="text"
        value={formData.occasionTags}
        onChange={(e) => setFormData({ ...formData, occasionTags: e.target.value })}
      />

      <div>
        <label>Formality (1-5)</label>
        <input
          type="range"
          min="1"
          max="5"
          value={formData.formality}
          onChange={(e) => setFormData({ ...formData, formality: parseInt(e.target.value) })}
        />
        <span>{formData.formality}</span>
      </div>

      <div>
        <label>Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
      </div>

      <div className={styles.formActions}>
        <Button type="submit" isLoading={loading} variant="primary">
          Add Item
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
