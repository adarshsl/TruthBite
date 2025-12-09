
export enum Language {
  ENGLISH = 'English',
  HINDI = 'Hindi',
  TAMIL = 'Tamil',
  TELUGU = 'Telugu',
  KANNADA = 'Kannada',
  MALAYALAM = 'Malayalam',
  BENGALI = 'Bengali',
  MARATHI = 'Marathi',
  GUJARATI = 'Gujarati'
}

export type NutriScore = 'A' | 'B' | 'C' | 'D' | 'E';

export interface IngredientAnalysis {
  originalName: string;
  translatedName: string;
  description: string;
  riskLevel: 'safe' | 'caution' | 'avoid';
  bannedIn?: string[]; // List of countries/regions where this is banned
}

export interface MarketingClaim {
  claim: string; // e.g. "Made with real Cashews"
  reality: string; // e.g. "Contains only 4% Cashew paste"
  verdict: 'verified' | 'misleading' | 'unknown';
}

export interface NutritionPer100g {
  energyKJ: number;
  sugarGrams: number;
  satFatGrams: number;
  sodiumMg: number;
  fiberGrams: number;
  proteinGrams: number;
  fruitVegPercent: number;
}

export interface AnalysisResult {
  productName: string;
  servingSize: string;
  sugarPerServingGrams: number;
  sugarTeaspoons: number;
  ingredients: IngredientAnalysis[];
  claims: MarketingClaim[];
  
  // Scores (calculated deterministically now)
  healthScore: number; // 0 to 100
  summary: string;
  nutriScore?: NutriScore;
  nutriScoreReason?: string;
  
  // Raw data extracted by AI
  nutritionPer100g?: NutritionPer100g;

  macros: {
    carbs: number;
    protein: number;
    fat: number;
  };
}

export interface AppState {
  language: Language;
  frontImage: string | null; // base64
  backImage: string | null; // base64
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
}
