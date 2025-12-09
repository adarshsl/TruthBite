
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Language } from "../types";
import { calculateHealthScore, calculateNutriScore } from "../utils/scoreCalculator";

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
7. Extract macros per serving (Carbs, Protein, Fat).

8. EXTRACT RAW NUTRITION DATA PER 100g/ml (REQUIRED FOR CALCULATING SCORES EXTERNALLY):
   - Energy (kJ)
   - Sugar (g)
   - Saturated Fat (g)
   - Sodium (mg)
   - Fiber (g)
   - Protein (g)
   - Fruit/Veg/Nut percentage (estimate from ingredients list if not explicitly stated).

   *If specific per 100g values are missing, try to calculate them from 'per serving' values if available.*

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
        temperature: 0, // Deterministic output
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            servingSize: { type: Type.STRING },
            sugarPerServingGrams: { type: Type.NUMBER },
            sugarTeaspoons: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            macros: {
              type: Type.OBJECT,
              properties: {
                carbs: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                fat: { type: Type.NUMBER },
              }
            },
            nutritionPer100g: {
              type: Type.OBJECT,
              properties: {
                energyKJ: { type: Type.NUMBER },
                sugarGrams: { type: Type.NUMBER },
                satFatGrams: { type: Type.NUMBER },
                sodiumMg: { type: Type.NUMBER },
                fiberGrams: { type: Type.NUMBER },
                proteinGrams: { type: Type.NUMBER },
                fruitVegPercent: { type: Type.NUMBER },
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
      const rawResult = JSON.parse(response.text) as AnalysisResult;
      
      // Post-processing: Calculate scores deterministically in code
      const healthScore = calculateHealthScore(
        rawResult.sugarPerServingGrams,
        rawResult.ingredients,
        rawResult.macros
      );

      // Calculate Nutri-Score if data exists
      let nutriScoreResult;
      if (rawResult.nutritionPer100g) {
        nutriScoreResult = calculateNutriScore(rawResult.nutritionPer100g);
      } else {
        nutriScoreResult = { score: undefined, reason: "Label did not provide per 100g data." };
      }

      return {
        ...rawResult,
        healthScore,
        nutriScore: nutriScoreResult.score,
        nutriScoreReason: nutriScoreResult.reason
      };
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze product. Please try again with a clearer photo.");
  }
};
