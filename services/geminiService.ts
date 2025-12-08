
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a truthful, friendly Indian nutritionist and food scientist. Your goal is to decode food labels for Indian families.
Analyze the provided product images (Front of pack, Back of pack/Nutrition label).

Your tasks:
1. Identify the product name.
2. Extract sugar per serving. If per serving is not explicit, calculate it based on a typical serving size for that product type.
3. Convert sugar grams to teaspoons (divide by 4.2).
4. Analyze the Ingredients List. Translate names to the requested target language.
   - IF TARGET LANGUAGE IS ENGLISH: All 'translatedName' fields MUST be in English. Do not use Hindi words or script.
5. Identify ingredients currently banned or strictly regulated in EU/UK/Canada/Japan/California.
6. Compare Front-of-Pack claims with actual percentage in the ingredients list (Truth vs Hype).
7. Extract macros per serving.

8. COMPUTE NUTRI-SCORE (A-E) BASED ON INTERNATIONAL STANDARDS (PER 100g/100ml):
   - Analyze Energy (kJ), Sugars (g), Sat Fat (g), and Sodium (mg).
   - Analyze Protein (g), Fibre (g), and % Fruits/Veg/Nuts.
   - Use the official European Nutri-Score model points system.
   - Return 'A', 'B', 'C', 'D', or 'E'.
   - If labels are missing data required for this (e.g., no Sodium or Saturated Fat listed), return null for nutriScore and explain why in 'nutriScoreReason'.

9. CALCULATE OUR TRUTHBITE HEALTH SCORE (0-100) DETERMINISTICALLY:
   - Start with 100.
   - SUGAR PENALTY: Deduct 3.5 points for every 1g of sugar per serving.
   - FIRST INGREDIENT PENALTY: Deduct 30 points if the FIRST ingredient is "Refined Wheat Flour" (Maida), "Sugar", "Liquid Glucose", "Invert Syrup", or "Palm Oil".
   - RISK PENALTY: Deduct 20 points for EACH ingredient identified with riskLevel 'avoid'.
   - PROCESSING PENALTY: Deduct 10 points if the ingredient list has > 10 items.
   - Bonus points for Protein > 5g (+5) or Whole Grain as first ingredient (+5).

Return PURE JSON matching the schema.
`;

export const analyzeImages = async (
  frontImageBase64: string | null,
  backImageBase64: string,
  targetLanguage: Language
): Promise<AnalysisResult> => {
  
  const parts = [];

  if (backImageBase64) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: backImageBase64.split(",")[1] || backImageBase64,
      },
    });
  }

  if (frontImageBase64) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: frontImageBase64.split(",")[1] || frontImageBase64,
      },
    });
  }

  parts.push({
    text: `Analyze these images. User speaks ${targetLanguage}. 
    STRICT LANGUAGE REQUIREMENT: Ingredient names must be in ${targetLanguage}. No vernacular if language is English.
    `
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: parts,
      },
      config: {
        temperature: 0,
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
            nutriScore: { type: Type.STRING, enum: ["A", "B", "C", "D", "E"] },
            nutriScoreReason: { type: Type.STRING },
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
                  bannedIn: { type: Type.ARRAY, items: { type: Type.STRING } },
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
