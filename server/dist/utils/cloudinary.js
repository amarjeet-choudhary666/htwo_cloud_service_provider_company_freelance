"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const apiError_1 = require("./apiError");
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadToCloudinary = async (fileBuffer, folder = 'partners') => {
    try {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder,
                resource_type: 'auto',
            }, (error, result) => {
                if (error) {
                    reject(new apiError_1.ApiError(500, 'Failed to upload image to Cloudinary'));
                }
                else if (result) {
                    resolve(result.secure_url);
                }
                else {
                    reject(new apiError_1.ApiError(500, 'Upload failed: No result returned'));
                }
            });
            uploadStream.end(fileBuffer);
        });
    }
    catch (error) {
        throw new apiError_1.ApiError(500, 'Error uploading to Cloudinary');
    }
};
exports.uploadToCloudinary = uploadToCloudinary;
const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary_1.v2.uploader.destroy(publicId);
    }
    catch (error) {
        throw new apiError_1.ApiError(500, 'Failed to delete image from Cloudinary');
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
//# sourceMappingURL=cloudinary.js.map