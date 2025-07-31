import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import catchAsync from '../utils/catchAsync.js';

const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  // 1. Resize and compress
  const processedImageBuffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();

  // 2. Set a consistent Cloudinary folder and public_id(Image Name)
  const userFolder = `chatApp/users/${req.user.id}`;
  const imageName = 'profileImage';

  // 3. Upload the image buffer
  const streamUpload = () =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: userFolder,
          public_id: imageName,
          resource_type: 'image',
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result.secure_url);
        }
      );

      // Convert buffer into a readable stream and pipe it to Cloudinary
      streamifier.createReadStream(processedImageBuffer).pipe(stream);
    });

  // 4. Attach data to req.body
  req.body.image = await streamUpload();
  req.body.cloudinaryFolder = userFolder;

  next();
});

export default resizeUserPhoto;
