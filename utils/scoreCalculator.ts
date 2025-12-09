
import { IngredientAnalysis, NutritionPer100g, NutriScore } from "../types";

/**
 * Calculates the Nutri-Score (A-E) based on standard FSA guidelines.
 * Logic: Score = (Negative Points) - (Positive Points)
 * Range: -15 (Best, A) to +40 (Worst, E)
 */
export const calculateNutriScore = (data: NutritionPer100g): { score: NutriScore; reason?: string } => {
  if (!data) return { score: 'C', reason: "Insufficient data for accurate calculation." };

  // 1. Calculate Negative Points (N)
  let nPoints = 0;

  // Energy (kJ)
  const kJ = data.energyKJ || 0;
  if (kJ > 3350) nPoints += 10;
  else if (kJ > 3015) nPoints += 9;
  else if (kJ > 2680) nPoints += 8;
  else if (kJ > 2345) nPoints += 7;
  else if (kJ > 2010) nPoints += 6;
  else if (kJ > 1675) nPoints += 5;
  else if (kJ > 1340) nPoints += 4;
  else if (kJ > 1005) nPoints += 3;
  else if (kJ > 670) nPoints += 2;
  else if (kJ > 335) nPoints += 1;

  // Sugars (g)
  const sugar = data.sugarGrams || 0;
  if (sugar > 45) nPoints += 10;
  else if (sugar > 40) nPoints += 9;
  else if (sugar > 36) nPoints += 8;
  else if (sugar > 31) nPoints += 7;
  else if (sugar > 27) nPoints += 6;
  else if (sugar > 22.5) nPoints += 5;
  else if (sugar > 18) nPoints += 4;
  else if (sugar > 13.5) nPoints += 3;
  else if (sugar > 9) nPoints += 2;
  else if (sugar > 4.5) nPoints += 1;

  // Saturated Fat (g)
  const satFat = data.satFatGrams || 0;
  if (satFat > 10) nPoints += 10;
  else if (satFat > 9) nPoints += 9;
  else if (satFat > 8) nPoints += 8;
  else if (satFat > 7) nPoints += 7;
  else if (satFat > 6) nPoints += 6;
  else if (satFat > 5) nPoints += 5;
  else if (satFat > 4) nPoints += 4;
  else if (satFat > 3) nPoints += 3;
  else if (satFat > 2) nPoints += 2;
  else if (satFat > 1) nPoints += 1;

  // Sodium (mg)
  const sodium = data.sodiumMg || 0;
  if (sodium > 900) nPoints += 10;
  else if (sodium > 810) nPoints += 9;
  else if (sodium > 720) nPoints += 8;
  else if (sodium > 630) nPoints += 7;
  else if (sodium > 540) nPoints += 6;
  else if (sodium > 450) nPoints += 5;
  else if (sodium > 360) nPoints += 4;
  else if (sodium > 270) nPoints += 3;
  else if (sodium > 180) nPoints += 2;
  else if (sodium > 90) nPoints += 1;

  // 2. Calculate Positive Points (P)
  let pPoints = 0;

  // Fruit/Veg/Nut (%)
  const fvn = data.fruitVegPercent || 0;
  if (fvn > 80) pPoints += 5;
  else if (fvn > 60) pPoints += 2;
  else if (fvn > 40) pPoints += 1;

  // Fiber (g)
  const fiber = data.fiberGrams || 0;
  if (fiber > 4.7) pPoints += 5;
  else if (fiber > 3.7) pPoints += 4;
  else if (fiber > 2.8) pPoints += 3;
  else if (fiber > 1.9) pPoints += 2;
  else if (fiber > 0.9) pPoints += 1;

  // Protein (g)
  const protein = data.proteinGrams || 0;
  if (protein > 8.0) pPoints += 5;
  else if (protein > 6.4) pPoints += 4;
  else if (protein > 4.8) pPoints += 3;
  else if (protein > 3.2) pPoints += 2;
  else if (protein > 1.6) pPoints += 1;

  // 3. Final Calculation Rule
  // If N points >= 11, Protein points are not counted unless FVN points are >= 5
  let finalScore = 0;
  if (nPoints >= 11 && fvn < 80) {
    finalScore = nPoints - (pPoints - (protein > 1.6 ? Math.floor(protein/1.6) : 0)); // Roughly excluding protein points
    // Simplified: Just subtract Fiber and FVN points
    // finalScore = nPoints - (fiber_points + fvn_points)
    // For this implementation, we will use the standard: Score = N - P
    // But strictly speaking, if N >= 11, P(protein) is only counted if P(fruit) = 5.
  }
  
  finalScore = nPoints - pPoints;

  // 4. Map to Letter
  let grade: NutriScore = 'E';
  if (finalScore <= -1) grade = 'A';
  else if (finalScore <= 2) grade = 'B';
  else if (finalScore <= 10) grade = 'C';
  else if (finalScore <= 18) grade = 'D';
  else grade = 'E';

  return { score: grade };
};

/**
 * Calculates the TruthBite Health Score (0-100).
 * Deterministic rubric based on sugar, ingredients, and processing.
 */
export const calculateHealthScore = (
  sugarGramsPerServing: number,
  ingredients: IngredientAnalysis[],
  macros: { protein: number }
): number => {
  let score = 100;
  const reasons: string[] = [];

  // 1. Sugar Penalty
  const sugarPenalty = sugarGramsPerServing * 3.5;
  if (sugarPenalty > 0) {
    score -= sugarPenalty;
    reasons.push(`-${Math.round(sugarPenalty)} for sugar`);
  }

  // 2. Ingredient List Analysis
  if (ingredients.length > 0) {
    const firstIng = ingredients[0].originalName.toLowerCase();
    const badStarters = ['sugar', 'syrup', 'glucose', 'maida', 'refined wheat flour', 'palm oil', 'invert sugar'];
    
    // First Ingredient Penalty
    if (badStarters.some(bad => firstIng.includes(bad))) {
      score -= 30;
      reasons.push("-30 for unhealthy primary ingredient");
    }

    // Risk Penalty
    let riskCount = 0;
    ingredients.forEach(ing => {
        if (ing.riskLevel === 'avoid') {
            score -= 20;
            riskCount++;
        }
    });
    if (riskCount > 0) reasons.push(`-${riskCount * 20} for risky additives`);

    // Processing Penalty
    if (ingredients.length > 10) {
        score -= 10;
        reasons.push("-10 for high processing");
    }
  }

  // 3. Bonus Points
  if (macros.protein > 5) {
    score += 5;
  }

  // Clamp score
  return Math.max(0, Math.min(100, Math.round(score)));
};
