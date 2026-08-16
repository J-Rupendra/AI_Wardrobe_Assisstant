import { v2 as cloudinary } from 'cloudinary';
import config from '../../config/env';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export class CloudinaryService {
  async uploadImage(
    fileBuffer: Buffer,
    fileName: string,
    folder: string = 'ai-wardrobe'
  ): Promise<{ url: string; publicId: string; width?: number; height?: number }> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder,
          public_id: fileName,
          overwrite: true,
          // THIS TRANSFORMATION ARRAY IS TO DROP THE FILE SIZE
          transformation: [
            { width: 1000, height: 1000, crop: 'limit' }, // Prevents images from being larger than 1000px while maintaining aspect ratio
            { quality: 'auto' },                          // Compresses file size intelligently without losing human-visible quality
            { fetch_format: 'webp' }                      // Automatically converts png/jpeg into lightweight WebP format
          ]
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
            });
          }
        }
      );

      stream.end(fileBuffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}

export default new CloudinaryService();
