import { WardrobeItem, IWardrobeItem } from '../../models/WardrobeItem';
import cloudinaryService from '../cloudinary/CloudinaryService';

export class WardrobeService {
  async createItem(userId: string, data: Partial<IWardrobeItem>, imageBuffer?: Buffer, fileName?: string): Promise<IWardrobeItem> {
    let image: { url: string; publicId: string; width?: number; height?: number } | undefined;

    if (imageBuffer && fileName) {
      image = await cloudinaryService.uploadImage(imageBuffer, fileName);
    }

    const item = await WardrobeItem.create({
      ...data,
      userId,
      image,
    });

    return item;
  }

  async getItems(userId: string, filters?: { category?: string; active?: boolean }): Promise<IWardrobeItem[]> {
    const query: any = { userId };
    
    if (filters?.category) {
      query.category = filters.category;
    }
    
    if (filters?.active !== undefined) {
      query.active = filters.active;
    }

    return await WardrobeItem.find(query).sort({ createdAt: -1 });
  }

  async getItemById(userId: string, itemId: string): Promise<IWardrobeItem | null> {
    const item = await WardrobeItem.findById(itemId);
    
    if (!item || item.userId !== userId) {
      return null;
    }

    return item;
  }

  async updateItem(userId: string, itemId: string, data: Partial<IWardrobeItem>): Promise<IWardrobeItem | null> {
    const item = await WardrobeItem.findById(itemId);
    
    if (!item || item.userId !== userId) {
      return null;
    }

    Object.assign(item, data);
    await item.save();
    return item;
  }

  async deleteItem(userId: string, itemId: string): Promise<boolean> {
    const item = await WardrobeItem.findById(itemId);
    
    if (!item || item.userId !== userId) {
      return false;
    }

    // Delete image from Cloudinary
    if (item.image?.publicId) {
      await cloudinaryService.deleteImage(item.image.publicId);
    }

    await item.deleteOne();
    return true;
  }
}

export default new WardrobeService();
