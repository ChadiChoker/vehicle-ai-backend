import axios from "axios";
import ServiceError from "../errors/serviceError.js";

const HF_API_URL =
  "https://router.huggingface.co/hf-inference/models/facebook/detr-resnet-50";

export const analyzeDamage = async (base64Image) => {
  try {
    const pureBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const response = await axios({
      method: "post",
      url: HF_API_URL,
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: { inputs: pureBase64 },
    });

    return response.data;
  } catch (err) {
    console.error("AI error:", err.response?.data || err.message);
    throw new ServiceError("AI analysis failed", 500);
  }
};
