
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Removes the background from an image using the Gemini API.
 * @param base64Image The base64 encoded image string (without data URI prefix).
 * @param mimeType The MIME type of the image (e.g., 'image/jpeg').
 * @returns A promise that resolves to the base64 encoded string of the processed image.
 */
export const removeBackground = async (base64Image: string, mimeType: string): Promise<string> => {
  const model = 'gemini-2.5-flash-image';
  const cleanBase64 = base64Image.split(',')[1] || base64Image;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: 'You are an expert at image segmentation. Your task is to remove the background from this image. Isolate the main subject and make the background transparent. Output only the resulting image.',
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Find the image part in the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error("No image data found in the API response.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to process image with Gemini API.");
  }
};
