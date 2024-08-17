import cloudinary from "cloudinary";
import formidable from "formidable";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret:
    process.env.CLOUDINARY_API_SECRET,
});

const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }
    return await fn(req, res)
  }

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: "virtual-try-on-uploads",
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "File parsing failed", error: err });
    }

    const image = files.image[0]; // 'file' is the name of the form field used to upload

    try {
      // Upload file to Cloudinary
      const result = await uploadToCloudinary(image.filepath);

      // Return Cloudinary URL
      return res.status(200).json({
        success: true,
        data: {
          message: "File uploaded successfully",
          url: result.secure_url,
        },
      });
    } catch (error) {
        console.log(error.message)
      return res
        .status(500)
        .json({ success: false, error: "Image upload failed" });
    }
  });
}
