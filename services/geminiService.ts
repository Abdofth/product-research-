
import { GoogleGenAI, Type } from "@google/genai";
import type { ResearchData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const researchSchema = {
  type: Type.OBJECT,
  properties: {
    marketAnalysis: {
      type: Type.OBJECT,
      properties: {
        targetAudience: { type: Type.STRING },
        marketSize: { type: Type.STRING },
        keyTrends: { type: Type.STRING },
      },
      required: ['targetAudience', 'marketSize', 'keyTrends'],
    },
    competitiveLandscape: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          strengths: { type: Type.STRING },
          weaknesses: { type: Type.STRING },
        },
        required: ['name', 'strengths', 'weaknesses'],
      },
    },
    swotAnalysis: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.STRING },
        weaknesses: { type: Type.STRING },
        opportunities: { type: Type.STRING },
        threats: { type: Type.STRING },
      },
      required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
    },
    featureSuggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    marketingStrategy: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    potentialRisks: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
    }
  },
  required: [
    'marketAnalysis',
    'competitiveLandscape',
    'swotAnalysis',
    'featureSuggestions',
    'marketingStrategy',
    'potentialRisks',
  ],
};

export const getProductResearch = async (productIdea: string): Promise<ResearchData> => {
  const prompt = `
    Analyze the following product idea and provide a comprehensive market research report.
    Product Idea: "${productIdea}"

    Please provide the analysis in the following structured format:
    1.  **Market Analysis**: Identify the target audience, estimate the market size, and list key trends.
    2.  **Competitive Landscape**: List 2-3 key competitors, detailing their main strengths and weaknesses.
    3.  **SWOT Analysis**: Provide a brief SWOT analysis for the product idea.
    4.  **Feature Suggestions**: Suggest 3-5 core features for an MVP.
    5.  **Marketing Strategy**: Propose 3-5 high-level marketing strategies.
    6.  **Potential Risks**: Identify 2-3 potential risks or challenges.

    Ensure your response is concise, insightful, and directly addresses the product idea.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: researchSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const researchData = JSON.parse(jsonText) as ResearchData;
    
    // Basic validation to ensure the parsed object is not empty
    if (Object.keys(researchData).length === 0) {
        throw new Error("Received empty research data from API.");
    }

    return researchData;
  } catch (error) {
    console.error("Error fetching or parsing product research:", error);
    throw new Error("Failed to get product research from Gemini API.");
  }
};
