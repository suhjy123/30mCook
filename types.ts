
export interface Recipe {
  recipeName: string;
  estimatedTime: string;
  requiredIngredients: string[];
  instructions: string[];
  recipeImageUrl?: string | null;
}