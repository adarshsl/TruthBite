import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a truthful, friendly Indian nutritionist and food scientist. Your goal is to decode food labels for Indian families.
Analyze the provided product images (Front of pack, Back of pack/Nutrition label).

Your tasks:
1. Identify the product name.
2. Extract sugar per serving. If per serving is not explicit, calculate it based on a typical serving size for that product type (e.g., 2 biscuits, 200ml juice).
3. Convert sugar grams to teaspoons (divide by 4.2).
4. Analyze the Ingredients List. Translate names to the requested target language. Identify "red flag" ingredients (palm oil, high fructose corn syrup, maida, invert sugar).
5. CRITICAL: Identify if any ingredient is currently banned or strictly regulated in other major countries/regions (e.g., Potassium Bromate banned in EU/UK/Canada, Titanium Dioxide banned in EU, Red 3 banned in California, BHA/BHT restricted in EU/Japan). Populate the 'bannedIn' field with the names of these regions if applicable.
6. Compare Front-of-Pack claims (e.g., "Real Cashew", "Orange Juice") with the actual percentage in the ingredients list (Truth vs Hype).
7. Provide a health score (0-100, where 100 is very healthy whole food).
8. Extract macros per serving.

Return PURE JSON matching the schema. Do not include markdown formatting like \`\`\`json.
`;

export const analyzeImages = async (
  frontImageBase64: string | null,
  backImageBase64: string,
  targetLanguage: Language
): Promise<AnalysisResult> => {
  
  const parts = [];

  // Add Back Image (Required for nutrition)
  if (backImageBase64) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: backImageBase64.split(",")[1] || backImageBase64,
      },
    });
  }

  // Add Front Image (Optional, for claims)
  if (frontImageBase64) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: frontImageBase64.split(",")[1] || frontImageBase64,
      },
    });
  }

  // Add the prompt
  parts.push({
    text: `Analyze these images. The user speaks ${targetLanguage}. 
    If the text is blurry, do your best to infer based on standard products in this category in India.
    For the 'description' of ingredients, provide a very short, simple explanation in ${targetLanguage} or English (whichever is more natural for a bilingual speaker) about what it is (e.g., "Preservative", "Sweetener", "Refined Flour").
    For 'riskLevel', use 'avoid' for trans fats, high sugar, or controversial additives. 'caution' for maida, palm oil. 'safe' for natural ingredients.
    `
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: parts,
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            servingSize: { type: Type.STRING },
            sugarPerServingGrams: { type: Type.NUMBER },
            sugarTeaspoons: { type: Type.NUMBER },
            healthScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            macros: {
              type: Type.OBJECT,
              properties: {
                carbs: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                fat: { type: Type.NUMBER },
              }
            },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  originalName: { type: Type.STRING },
                  translatedName: { type: Type.STRING },
                  description: { type: Type.STRING },
                  riskLevel: { type: Type.STRING, enum: ["safe", "caution", "avoid"] },
                  bannedIn: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "List of regions where this is banned e.g. ['EU', 'Japan', 'California']" 
                  },
                }
              }
            },
            claims: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  claim: { type: Type.STRING },
                  reality: { type: Type.STRING },
                  verdict: { type: Type.STRING, enum: ["verified", "misleading", "unknown"] },
                }
              }
            }
          }
        }
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze product. Please try again with a clearer photo.");
  }
};