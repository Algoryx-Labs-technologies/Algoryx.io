import { v2 as cloudinary } from 'cloudinary';
import { env } from '@/config/env';
import { AppError } from '@/types';

let configured = false;

const ensureConfigured = (): void => {
  if (configured) {
    return;
  }

  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new AppError(
      503,
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
    );
  }

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  configured = true;
};

export interface UploadedImage {
  url: string;
  publicId: string;
}

export const uploadPortfolioImage = async (buffer: Buffer): Promise<UploadedImage> => {
  ensureConfigured();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: env.CLOUDINARY_FOLDER,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error || !result) {
          reject(new AppError(500, error?.message || 'Failed to upload image'));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    uploadStream.end(buffer);
  });
};

export const deletePortfolioImage = async (publicId: string): Promise<void> => {
  if (!publicId.trim()) {
    return;
  }

  ensureConfigured();
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
};
