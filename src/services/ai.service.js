import axios from "axios";
import ServiceError from "../errors/serviceError.js";

const HF_API_URL = process.env.HF_API_URL;

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
      data: {
        inputs: pureBase64,
      },
    });

    return response.data;
  } catch (err) {
    // Wrap or rethrow error to be handled in controller's error middleware
    const message = err.response?.data?.error || err.message || "AI service error";
    console.error("AI error:", message);
    throw new ServiceError(message, err.response?.status || 502);
  }
};
