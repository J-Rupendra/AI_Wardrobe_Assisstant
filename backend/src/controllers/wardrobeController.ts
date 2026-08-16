import { Request, Response } from 'express';
import wardrobeService from '../services/wardrobe/WardrobeService';
import { wardrobeItemSchema, updateWardrobeItemSchema } from '../schemas/wardrobeSchemas';

export class WardrobeController {
  async getItems(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { category, active } = req.query;

      const filters: any = {};
      if (category && typeof category === 'string') {
        filters.category = category;
      }
      if (active !== undefined) {
        filters.active = active === 'true';
      }

      const items = await wardrobeService.getItems(userId, filters);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch wardrobe items' });
    }
  }

  async getItemById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const item = await wardrobeService.getItemById(userId, id);
      if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }

      res.json(item);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch item' });
    }
  }

  async createItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const rawBody = { ...req.body };
      console.log('Raw request body:', rawBody);

      if (typeof rawBody.colors === 'string') {
        rawBody.colors = JSON.parse(rawBody.colors);
      }
      if (typeof rawBody.styleTags === 'string') {
        rawBody.styleTags = JSON.parse(rawBody.styleTags);
      }
      if (typeof rawBody.occasionTags === 'string') {
        rawBody.occasionTags = JSON.parse(rawBody.occasionTags);
      }
      if (typeof rawBody.seasonTags === 'string') {
        rawBody.seasonTags = JSON.parse(rawBody.seasonTags);
      }

      const validated = wardrobeItemSchema.parse(rawBody);
      const file = (req as any).file;
      const item = await wardrobeService.createItem(userId, validated, file?.buffer, file?.originalname);
      res.status(201).json(item);
    } catch (error) {
      console.log('Error in createItem:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Failed to create item' });
      }
    }
  }

  async updateItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const validated = updateWardrobeItemSchema.parse(req.body);

      const item = await wardrobeService.updateItem(userId, id, validated);
      if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }

      res.json(item);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Failed to update item' });
      }
    }
  }

  async deleteItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const success = await wardrobeService.deleteItem(userId, id);
      if (!success) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }

      res.json({ message: 'Item deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete item' });
    }
  }
}

export default new WardrobeController();
