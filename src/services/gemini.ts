import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function suggestOpposite(category: string, word: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Given the category "${category}", what is the direct opposite attribute of "${word}"? Respond with ONLY the opposite word or short phrase, nothing else.`,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Error suggesting opposite:", error);
    return "";
  }
}

export interface ChartItem {
  title: string;
  description: string;
  imageSeed: string;
  x: number; // -100 to 100
  y: number; // -100 to 100
}

export async function generateChartItems(
  category: string,
  xAxis: { start: string; end: string },
  yAxis: { start: string; end: string }
): Promise<ChartItem[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Generate 5 distinct items in the category "${category}".
      Evaluate each item on two axes:
      X-Axis: from -100 (${xAxis.start}) to 100 (${xAxis.end})
      Y-Axis: from -100 (${yAxis.start}) to 100 (${yAxis.end})
      
      Provide a title, a short 1-sentence description, a single keyword for an image search seed, and the x and y coordinates.
      Make sure the items are spread out across the quadrants if possible.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              imageSeed: { type: Type.STRING },
              x: { type: Type.NUMBER },
              y: { type: Type.NUMBER },
            },
            required: ["title", "description", "imageSeed", "x", "y"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as ChartItem[];
  } catch (error) {
    console.error("Error generating items:", error);
    return [];
  }
}
