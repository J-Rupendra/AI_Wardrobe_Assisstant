import { Schema, model } from 'mongoose';

export interface IWardrobeItem {
  _id: string;
  userId: string;
  category: string;
  subCategory?: string;
  name: string;
  colors: string[];
  material?: string;
  pattern?: string;
  styleTags: string[];
  occasionTags: string[];
  formality: number;
  seasonTags?: string[];
  image: {
    url: string;
    publicId: string;
    width?: number;
    height?: number;
  };
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const wardrobeItemSchema = new Schema<IWardrobeItem>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['frock', 'top', 'shirt', 'pant', 'earring', 'chain', 'necklace', 'bracelet', 'sandal', 'heel', 'flat'],
      required: true,
    },
    subCategory: String,
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    colors: [String],
    material: String,
    pattern: String,
    styleTags: [String],
    occasionTags: [String],
    formality: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    seasonTags: [String],
    image: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
      width: Number,
      height: Number,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes for queries
wardrobeItemSchema.index({ userId: 1 });
wardrobeItemSchema.index({ userId: 1, category: 1 });
wardrobeItemSchema.index({ userId: 1, active: 1 });

export const WardrobeItem = model<IWardrobeItem>('WardrobeItem', wardrobeItemSchema);
