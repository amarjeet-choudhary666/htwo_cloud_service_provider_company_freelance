import { v2 as cloudinary } from 'cloudinary';
import { ApiError } from './apiError';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (fileBuffer: Buffer, folder: string = 'partners'): Promise<string> => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(new ApiError(500, 'Failed to upload image to Cloudinary'));
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new ApiError(500, 'Upload failed: No result returned'));
          }
        }
      );

      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    throw new ApiError(500, 'Error uploading to Cloudinary');
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new ApiError(500, 'Failed to delete image from Cloudinary');
  }
};

export { cloudinary };