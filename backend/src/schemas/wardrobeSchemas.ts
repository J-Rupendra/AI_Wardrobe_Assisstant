import { z } from 'zod';

export const wardrobeItemSchema = z.object({
  category: z.enum(['frock', 'top', 'shirt', 'pant', 'earring', 'chain', 'necklace', 'bracelet', 'sandal', 'heel', 'flat']),
  subCategory: z.string().optional(),
  name: z.string().min(1).max(200),
  colors: z.array(z.string()).min(1),
  material: z.string().optional(),
  pattern: z.string().optional(),
  styleTags: z.array(z.string()).default([]),
  occasionTags: z.array(z.string()).default([]),
  formality: z.coerce.number().int().min(1).max(5),
  seasonTags: z.array(z.string()).optional(),
  active: z.boolean().default(true),
});

export const updateWardrobeItemSchema = wardrobeItemSchema.partial();

export type WardrobeItemInput = z.infer<typeof wardrobeItemSchema>;
export type UpdateWardrobeItemInput = z.infer<typeof updateWardrobeItemSchema>;
