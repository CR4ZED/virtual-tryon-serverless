import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { baseImageUrl, swapImageUrl } = req.body;
  try {
    if (!baseImageUrl || !swapImageUrl) throw new Error("Images not found!");
    const response = await axios.post(
      "https://fal.run/fal-ai/face-swap",
      {
        base_image_url: baseImageUrl,
        swap_image_url: swapImageUrl,
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
