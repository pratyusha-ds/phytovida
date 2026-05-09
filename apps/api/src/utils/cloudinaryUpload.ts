import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
* Uploads image from remote URL included in API response to Cloudinary
* Returns permanent URL from Cloudinary for persistent storage in database
**/

export async function cloudinaryUpload(
  sourceUrl: string | null | undefined
): Promise<string | null> {
  if (!sourceUrl) return null;
 
  try {
    const result = await cloudinary.uploader.upload(sourceUrl, {
      folder: "plants",
      resource_type: "image",
      unique_filename: false,
      use_filename: false,
    });
 
    return result.secure_url;
  } catch (err) {
    console.error(`Cloudinary upload failed for ${sourceUrl}:`, err);
    return null;
  }
}