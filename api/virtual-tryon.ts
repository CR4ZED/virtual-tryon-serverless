import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "Only POST requests are allowed" });
  }
  const { humanImageUrl, outfitUrl, description } = req.body;
  console.log(humanImageUrl, outfitUrl, description)
  try {
    console.log(process.env.FAL_KEY)
    if (!humanImageUrl || !outfitUrl) throw new Error("Images not found!");
    const response = await axios.post(
      "https://fal.run/fal-ai/idm-vton",
      {
        "human_image_url": humanImageUrl,
        "garment_image_url": outfitUrl,
        "garment_type": "upper_body",
        "description": description,
        "num_inference_steps": 30,
        "seed": 42
      },
      {
        headers: {
          Authorization: `Key ${process.env.FAL_KEY}`
        },
      }
    );
    console.log(`Succesfully converted image: ${response.data.image.url}`);
    return res.json({ success: true, image: response.data.image });
  } catch (error) {
    console.log(`Unable to swap: ${error.message}`);
    return res.json({
      success: false,
      error: `Failed to load the result`,
    });
  }
}
