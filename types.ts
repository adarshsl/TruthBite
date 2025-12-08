export enum Language {
  ENGLISH = 'English',
  HINDI = 'Hindi',
  TAMIL = 'Tamil',
  TELUGU = 'Telugu',
  KANNADA = 'Kannada',
  BENGALI = 'Bengali',
  MARATHI = 'Marathi',
  GUJARATI = 'Gujarati'
}

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

export interface AnalysisResult {
  productName: string;
  servingSize: string;
  sugarPerServingGrams: number;
  sugarTeaspoons: number;
  ingredients: IngredientAnalysis[];
  claims: MarketingClaim[];
  healthScore: number; // 0 to 100
  summary: string;
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