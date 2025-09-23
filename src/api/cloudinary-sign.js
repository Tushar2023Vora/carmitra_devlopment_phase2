import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: "Only POST requests allowed" });
    return;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      upload_preset: 'carmitra',
    },
    cloudinary.config().api_secret
  );

  res.status(200).json({ timestamp, signature });
}
